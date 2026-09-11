# NutriAI — AI Nutrition Recommendation System

NutriAI is a software-only personalized nutrition web application designed for nutrition planning and wellness education.

## Features

- Personalized BMI, BMR, TDEE and calorie-target calculation
- Dataset-driven KNN-style meal recommendation
- Vegetarian, vegan and non-vegetarian filtering
- Allergy / food-avoidance filtering
- 7-day personalized meal planner
- Nutrition-profile-based food substitutions
- Nutrition dashboard and scoring
- Weight progress tracking and analytics
- Free rule-based NutriAI wellness assistant
- SIH project overview and demonstration workflow

## Recommendation approach

The hosted recommender uses a pure-JavaScript nearest-neighbor / KNN-style content-based approach. It compares five nutrition features — calories, protein, carbohydrates, fat and fibre — using cosine similarity and ranks eligible foods against meal targets.

This should be described as a KNN-style recommendation system, not as a scikit-learn-trained classifier.

## Safety

NutriAI provides general wellness education only. Calorie estimates are approximate, and the system does not diagnose medical conditions or prescribe treatment.

## Hosted demo

https://ai-nutrition.hatchable.site

## Project structure

```text
api/
  assistant.js
  progress.js
  recommend.js
  substitute.js
  weekly-plan.js
migrations/
  001_nutrition.sql
  002_progress.sql
  003_food_dataset.sql
public/
  index.html
  sih.html
hatchable.toml
```

## Deployment

The production prototype is hosted on Hatchable and uses PostgreSQL for nutrition data, recommendation history and progress logs.
