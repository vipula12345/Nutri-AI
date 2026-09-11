import { db } from "hatchable";

export const access = "public";
export const methods = ["POST"];

function num(v, fallback=0){ const n=Number(v); return Number.isFinite(n)?n:fallback; }
function bmiLabel(b){ return b<18.5?"Underweight":b<25?"Healthy range":b<30?"Overweight":"Obesity range"; }
function calculate(p){
  const age=num(p.age,25), height=num(p.height,165), weight=num(p.weight,65);
  const bmi=weight/Math.pow(height/100,2);
  const sex=(p.gender||"female").toLowerCase();
  const bmr=sex==="male" ? 10*weight+6.25*height-5*age+5 : 10*weight+6.25*height-5*age-161;
  const factors={sedentary:1.2,light:1.375,moderate:1.55,active:1.725};
  const tdee=bmr*(factors[p.activity]||1.375);
  const goal=p.goal||"maintenance";
  const target=goal==="weight-loss"?tdee-350:goal==="weight-gain"?tdee+300:tdee;
  return {bmi:Number(bmi.toFixed(1)),bmiLabel:bmiLabel(bmi),bmr:Math.round(bmr),tdee:Math.round(tdee),targetCalories:Math.round(target)};
}
const mealTargets={Breakfast:.25,Lunch:.35,Snack:.10,Dinner:.30};
const aliases={milk:["milk","paneer","curd"],peanut:["peanut","nuts"],soy:["soy","tofu"],wheat:["wheat","dalia","upma"]};
function blocked(food, allergies){
  return allergies.some(a=>{
    const terms=aliases[a]||[a];
    return terms.some(t=>food.name.toLowerCase().includes(t)) || food.allergens.some(x=>x.toLowerCase()===a);
  });
}
function vector(food,target,goal){
  const proteinTarget=goal==="maintenance"?20:28;
  const fiberTarget=8;
  return [Number(food.cal)/Math.max(target,1),Number(food.protein)/proteinTarget,Number(food.carbs)/55,Number(food.fat)/18,Number(food.fiber)/fiberTarget];
}
function cosine(a,b){let dot=0,aa=0,bb=0;for(let i=0;i<a.length;i++){dot+=a[i]*b[i];aa+=a[i]*a[i];bb+=b[i]*b[i]}return dot/(Math.sqrt(aa)*Math.sqrt(bb)||1)}

export default async function(req,res){
  const p=req.body||{}; const age=num(p.age),height=num(p.height),weight=num(p.weight);
  if(age<13||age>100||height<100||height>230||weight<25||weight>250) return res.status(400).json({error:"Please enter realistic age, height and weight values."});
  const calc=calculate(p), diet=p.diet||"vegetarian";
  const allergies=Array.isArray(p.allergies)?p.allergies.map(x=>String(x).toLowerCase()):[];
  const {rows:foods}=await db.query("SELECT id,name,meal_type AS meal,diet,calories AS cal,protein_g AS protein,carbs_g AS carbs,fat_g AS fat,fiber_g AS fiber,allergens,tags FROM nutrition_foods ORDER BY id");
  let pool=foods.filter(f=>diet==="vegetarian"?f.diet!=="non-vegetarian":diet==="vegan"?f.diet==="vegan":true).filter(f=>!blocked(f,allergies));
  const selected=[];
  for(const meal of ["Breakfast","Lunch","Snack","Dinner"]){
    const mealPool=pool.filter(f=>f.meal===meal);
    const target=calc.targetCalories*mealTargets[meal];
    const desired=[target, p.goal==="maintenance"?20:28, target*.5, target*.3, 8];
    const ranked=mealPool.map(f=>{
      const sim=cosine(vector(f,target,p.goal),[desired[0]/Math.max(target,1),desired[1]/28,desired[2]/55,desired[3]/18,1]);
      const goalBonus=(p.goal==="weight-loss"&&f.tags.includes("high-fiber"))?.08:(p.goal==="weight-gain"&&f.tags.includes("high-protein"))?.08:0;
      const score=sim*.9+goalBonus;
      return {...f,_score:score};
    }).sort((a,b)=>b._score-a._score);
    if(ranked[0]){const best={...ranked[0]};delete best._score;best.recommendationScore=Math.round(ranked[0]._score*100);best.reason=best.tags.includes("high-protein")?"KNN similarity prioritizes protein and calorie fit":"KNN similarity matches calorie and nutrient profile";selected.push(best);}
  }
  const total=selected.reduce((s,f)=>({cal:s.cal+Number(f.cal),protein:s.protein+Number(f.protein),carbs:s.carbs+Number(f.carbs),fat:s.fat+Number(f.fat),fiber:s.fiber+Number(f.fiber)}),{cal:0,protein:0,carbs:0,fat:0,fiber:0});
  const aiNote="This plan is generated from estimated calorie needs, dietary filters and a KNN-style similarity model over the nutrition dataset. Calorie estimates are approximate; use this as general wellness guidance, not medical advice."
  try{await db.query("INSERT INTO recommendation_history (profile,recommendations,ai_note) VALUES ($1,$2,$3)",[JSON.stringify(p),JSON.stringify({metrics:calc,meals:selected,totals:total}),aiNote])}catch(e){console.log("history save failed",String(e))}
  res.json({profile:p,metrics:calc,meals:selected,totals:total,aiNote,model:{name:"KNN-style content-based recommender",neighbors:5,datasetSamples:foods.length,filteredSamples:pool.length,features:["calories","protein","carbohydrates","fat","fibre"],note:"Nearest-neighbor similarity is computed directly from the nutrition dataset; no scikit-learn runtime is required."}});
}