import { db } from "hatchable";

export const access = "public";
export const methods = ["POST"];

const aliases = {
  milk: ["milk", "paneer", "curd"],
  peanut: ["peanut", "nuts"],
  soy: ["soy", "tofu"],
  wheat: ["wheat", "dalia", "upma"]
};

function blocked(food, allergies) {
  const name = String(food.name || "").toLowerCase();
  return allergies.some(a =>
    (aliases[a] || [a]).some(t => name.includes(t)) ||
    (food.allergens || []).some(x => String(x).toLowerCase() === a)
  );
}

function fallback(question, profile, safeFoods) {
  const q = String(question || "").toLowerCase();
  const goal = profile?.goal || "maintenance";
  if (q.includes("protein")) {
    const foods = safeFoods.slice(0, 5).map(f => `${f.name} (${Number(f.protein)}g protein)`).join(", ");
    return `For a ${goal} plan, useful protein-rich choices from the NutriAI dataset include ${foods || "dal, tofu and chickpeas"}. Spread protein across your meals and choose portions that fit your calorie target.`;
  }
  if (q.includes("alternative") || q.includes("substitut")) {
    const foods = safeFoods.slice(0, 5).map(f => `${f.name} (${Number(f.cal)} kcal, ${Number(f.protein)}g protein)`).join(", ");
    return `Safe alternatives from the current ${profile?.diet || "dietary"} and allergy-filtered dataset include ${foods || "dal, chickpeas and vegetables"}. For a specific recommended food, use “Find similar food” beside that meal to compare closer nutrition matches.`;
  }
  if (q.includes("why") || q.includes("recommend")) {
    return "Your recommendations are selected using your estimated calorie needs, goal, dietary preference and allergy filters. The KNN-style recommender then compares food nutrition profiles to the meal target.";
  }
  return "I can help explain your NutriAI plan, protein choices, meal recommendations, substitutions and general healthy-eating strategies. I use the information available in your profile and plan, and I do not provide diagnosis or medical treatment advice.";
}

export default async function(req, res) {
  const p = req.body || {};
  const question = String(p.question || "").trim();
  if (!question) return res.status(400).json({ error: "Please enter a nutrition question." });
  if (question.length > 1000) return res.status(400).json({ error: "Question is too long. Please keep it under 1000 characters." });

  const profile = p.profile || {};
  const plan = p.plan || {};
  const allergies = Array.isArray(profile.allergies) ? profile.allergies.map(x => String(x).toLowerCase()) : [];
  const diet = String(profile.diet || "vegetarian").toLowerCase();

  let safeFoods = [];
  try {
    const { rows } = await db.query("SELECT name, meal_type AS meal, diet, calories AS cal, protein_g AS protein, carbs_g AS carbs, fat_g AS fat, fiber_g AS fiber, allergens, tags FROM nutrition_foods ORDER BY protein_g DESC");
    safeFoods = rows
      .filter(f => diet === "vegan" ? f.diet === "vegan" : diet === "vegetarian" ? f.diet !== "non-vegetarian" : true)
      .filter(f => !blocked(f, allergies))
      .slice(0, 12);
  } catch (e) {
    console.log("food context unavailable", String(e));
  }

  const context = {
    profile: {
      age: profile.age,
      gender: profile.gender,
      height: profile.height,
      weight: profile.weight,
      activity: profile.activity,
      goal: profile.goal,
      diet,
      allergies
    },
    metrics: plan.metrics || null,
    recommendedMeals: Array.isArray(plan.meals) ? plan.meals.map(f => ({ name: f.name, meal: f.meal, calories: f.cal, protein: f.protein })) : [],
    dailyTotals: plan.totals || null,
    safeDatasetFoods: safeFoods.map(f => ({ name: f.name, meal: f.meal, calories: f.cal, protein: f.protein, tags: f.tags }))
  };

  const answer = fallback(question, profile, safeFoods);

  res.json({
    answer,
    source: "NutriAI rule-based wellness assistant",
    safety: "General wellness guidance only; not medical advice.",
    context: { safeFoodsConsidered: safeFoods.length, diet, allergies }
  });
}