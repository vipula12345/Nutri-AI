import { db } from "hatchable";
export const access = "public";
export const methods = ["POST"];

const aliases={milk:["milk","paneer","curd"],peanut:["peanut","nuts"],soy:["soy","tofu"],wheat:["wheat","dalia","upma"]};
function blocked(f,a){return a.some(x=>(aliases[x]||[x]).some(t=>f.name.toLowerCase().includes(t))||(f.allergens||[]).some(y=>String(y).toLowerCase()===x))}
function num(v){const n=Number(v);return Number.isFinite(n)?n:0}
function distance(a,b){const scale=[500,30,80,30,15];let s=0;for(let i=0;i<5;i++){const d=(a[i]-b[i])/scale[i];s+=d*d}return Math.sqrt(s)}
export default async function(req,res){
 const p=req.body||{}, foodName=String(p.food||p.name||"").trim();
 if(!foodName)return res.status(400).json({error:"Food name is required."});
 const allergies=Array.isArray(p.allergies)?p.allergies.map(x=>String(x).toLowerCase()):[];
 const {rows}=await db.query("SELECT id,name,meal_type AS meal,diet,calories AS cal,protein_g AS protein,carbs_g AS carbs,fat_g AS fat,fiber_g AS fiber,allergens,tags FROM nutrition_foods ORDER BY name");
 const source=rows.find(f=>f.name.toLowerCase()===foodName.toLowerCase())||rows.find(f=>f.name.toLowerCase().includes(foodName.toLowerCase()));
 if(!source)return res.status(404).json({error:"Food was not found in the nutrition dataset."});
 const diet=p.diet||"vegetarian";
 const pool=rows.filter(f=>f.id!==source.id&&f.meal===source.meal).filter(f=>diet==="vegan"?f.diet==="vegan":diet==="vegetarian"?f.diet!=="non-vegetarian":true).filter(f=>!blocked(f,allergies));
 const v=[num(source.cal),num(source.protein),num(source.carbs),num(source.fat),num(source.fiber)];
 const ranked=pool.map(f=>({...f,similarity:distance(v,[num(f.cal),num(f.protein),num(f.carbs),num(f.fat),num(f.fiber)])})).sort((a,b)=>a.similarity-b.similarity).slice(0,5).map(f=>{const match=Math.max(0,Math.round(100-(f.similarity/Math.max(1,Math.sqrt(5)))*100));return {...f,similarityScore:match,reason:"Closest nutrition profile in the same meal category, after dietary and allergy filtering."}});
 res.json({source,substitutions:ranked,model:{name:"Nutrition-profile nearest-neighbor substitution",features:["calories","protein","carbohydrates","fat","fibre"],datasetSamples:rows.length,eligibleSamples:pool.length}})
}