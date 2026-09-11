import { db } from "hatchable";
export const access = "public";

function key(p){ return [p.age,p.gender,p.height,p.activity,p.goal,p.diet,(p.allergies||[]).slice().sort().join(',')].join('|'); }

export default async function(req,res){
  if(req.method==='GET'){
    const p=req.query||{}; const profileKey=p.profileKey;
    if(!profileKey) return res.status(400).json({error:'profileKey is required'});
    const {rows}=await db.query('SELECT id, weight_kg AS weight, calories, protein_g AS protein, nutrition_score AS score, note, logged_at FROM progress_logs WHERE profile_key = $1 ORDER BY logged_at ASC LIMIT 90',[profileKey]);
    return res.json({entries:rows});
  }
  if(req.method==='POST'){
    const p=req.body||{}; const profileKey=key(p); const weight=Number(p.weight); if(!Number.isFinite(weight)||weight<=0) return res.status(400).json({error:'Valid weight is required'});
    const calories=Number(p.calories)||null, protein=Number(p.protein)||null, score=Number(p.score)||null;
    const {rows}=await db.query('INSERT INTO progress_logs (profile_key,weight_kg,calories,protein_g,nutrition_score,note) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id, weight_kg AS weight, calories, protein_g AS protein, nutrition_score AS score, note, logged_at',[profileKey,weight,calories,protein,score,String(p.note||'')]);
    return res.status(201).json({entry:rows[0]});
  }
  return res.status(405).json({error:'Method not allowed'});
}
export const methods=['GET','POST'];
export { key as profileKey };