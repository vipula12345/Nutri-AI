import { db } from "hatchable";
export const access = "public";
export const methods = ["POST"];

function n(v,d=0){const x=Number(v);return Number.isFinite(x)?x:d}
function calculate(p){const age=n(p.age,25),height=n(p.height,165),weight=n(p.weight,65);const bmr=(String(p.gender||"female").toLowerCase()==="male")?10*weight+6.25*height-5*age+5:10*weight+6.25*height-5*age-161;const factor={sedentary:1.2,light:1.375,moderate:1.55,active:1.725}[p.activity]||1.375;const tdee=bmr*factor;const target=p.goal==="weight-loss"?tdee-350:p.goal==="weight-gain"?tdee+300:tdee;return {bmi:Number((weight/Math.pow(height/100,2)).toFixed(1)),bmr:Math.round(bmr),tdee:Math.round(tdee),targetCalories:Math.round(target)}}
const aliases={milk:["milk","paneer","curd"],peanut:["peanut","nuts"],soy:["soy","tofu"],wheat:["wheat","dalia","upma"]};
function blocked(f,a){return a.some(x=>(aliases[x]||[x]).some(t=>f.name.toLowerCase().includes(t))||(f.allergens||[]).some(y=>y.toLowerCase()===x))}
function cosine(a,b){let d=0,aa=0,bb=0;for(let i=0;i<a.length;i++){d+=a[i]*b[i];aa+=a[i]*a[i];bb+=b[i]*b[i]}return d/(Math.sqrt(aa)*Math.sqrt(bb)||1)}
function score(f,target,goal){const v=[Number(f.cal)/Math.max(target,1),Number(f.protein)/(goal==="maintenance"?20:28),Number(f.carbs)/55,Number(f.fat)/18,Number(f.fiber)/8];const q=[1,1,1,1,1];return cosine(v,q)*.9+(goal==="weight-loss"&&f.tags.includes("high-fiber")?.08:goal==="weight-gain"&&f.tags.includes("high-protein")?.08:0)}
export default async function(req,res){
 const p=req.body||{},calc=calculate(p),diet=p.diet||"vegetarian",allergies=Array.isArray(p.allergies)?p.allergies.map(x=>String(x).toLowerCase()):[];
 const {rows}=await db.query("SELECT name,meal_type AS meal,diet,calories AS cal,protein_g AS protein,carbs_g AS carbs,fat_g AS fat,fiber_g AS fiber,allergens,tags FROM nutrition_foods ORDER BY name");
 const pool=rows.filter(f=>diet==="vegan"?f.diet==="vegan":diet==="vegetarian"?f.diet!=="non-vegetarian":true).filter(f=>!blocked(f,allergies));
 const days=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],slots=["Breakfast","Lunch","Snack","Dinner"],targets={Breakfast:.25,Lunch:.35,Snack:.1,Dinner:.3};const used=new Set();
 const plan=days.map((day,di)=>{const meals=slots.map(slot=>{const target=calc.targetCalories*targets[slot];const opts=pool.filter(f=>f.meal===slot).map(f=>({...f,_score:score(f,target,p.goal)})).sort((a,b)=>b._score-a._score);const fresh=opts.find(f=>!used.has(f.name)),chosen=fresh||opts[di%Math.max(opts.length,1)];if(!chosen)return null;used.add(chosen.name);delete chosen._score;chosen.recommendationScore=Math.round(score(chosen,target,p.goal)*100);return chosen}).filter(Boolean);const totals=meals.reduce((s,f)=>({cal:s.cal+Number(f.cal),protein:s.protein+Number(f.protein),carbs:s.carbs+Number(f.carbs),fat:s.fat+Number(f.fat),fiber:s.fiber+Number(f.fiber)}),{cal:0,protein:0,carbs:0,fat:0,fiber:0});return {day,meals,totals}});
 const weekTotals=plan.reduce((s,d)=>({cal:s.cal+d.totals.cal,protein:s.protein+d.totals.protein,carbs:s.carbs+d.totals.carbs,fat:s.fat+d.totals.fat,fiber:s.fiber+d.totals.fiber}),{cal:0,protein:0,carbs:0,fat:0,fiber:0});
 res.json({metrics:calc,targetCalories:calc.targetCalories,days:plan,weekTotals,model:{name:"KNN-style content-based recommender",datasetSamples:rows.length,filteredSamples:pool.length}})
}