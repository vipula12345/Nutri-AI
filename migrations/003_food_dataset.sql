CREATE TABLE IF NOT EXISTS nutrition_foods (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 name text NOT NULL UNIQUE,
 meal_type text NOT NULL,
 diet text NOT NULL,
 calories numeric(7,2) NOT NULL,
 protein_g numeric(7,2) NOT NULL,
 carbs_g numeric(7,2) NOT NULL,
 fat_g numeric(7,2) NOT NULL,
 fiber_g numeric(7,2) NOT NULL,
 allergens text[] NOT NULL DEFAULT '{}',
 tags text[] NOT NULL DEFAULT '{}'
);

INSERT INTO nutrition_foods (name,meal_type,diet,calories,protein_g,carbs_g,fat_g,fiber_g,allergens,tags) VALUES ('Vegetable poha','Breakfast','vegetarian',280,7,45,8,5,'{}','{indian,weight-loss}') ON CONFLICT (name) DO NOTHING;
INSERT INTO nutrition_foods VALUES (gen_random_uuid(),'Moong dal chilla','Breakfast','vegetarian',300,15,38,8,7,'{}','{indian,high-protein}') ON CONFLICT (name) DO NOTHING;
INSERT INTO nutrition_foods VALUES (gen_random_uuid(),'Oats with banana','Breakfast','vegetarian',330,9,58,8,7,'{}','{breakfast}') ON CONFLICT (name) DO NOTHING;
INSERT INTO nutrition_foods VALUES (gen_random_uuid(),'Oats with banana and nuts','Breakfast','vegetarian',360,11,55,12,8,'{peanut,nuts}','{breakfast}') ON CONFLICT (name) DO NOTHING;
INSERT INTO nutrition_foods VALUES (gen_random_uuid(),'Idli with sambar','Breakfast','vegetarian',320,12,55,5,7,'{}','{indian}') ON CONFLICT (name) DO NOTHING;
INSERT INTO nutrition_foods VALUES (gen_random_uuid(),'Vegetable upma','Breakfast','vegetarian',300,8,48,9,6,'{wheat}','{indian}') ON CONFLICT (name) DO NOTHING;
INSERT INTO nutrition_foods VALUES (gen_random_uuid(),'Besan vegetable chilla','Breakfast','vegan',310,14,40,9,7,'{}','{indian,vegan,high-protein}') ON CONFLICT (name) DO NOTHING;
INSERT INTO nutrition_foods VALUES (gen_random_uuid(),'Vegetable dalia','Breakfast','vegetarian',290,10,50,6,8,'{wheat}','{indian,high-fiber}') ON CONFLICT (name) DO NOTHING;
INSERT INTO nutrition_foods VALUES (gen_random_uuid(),'Paneer vegetable bowl','Lunch','vegetarian',520,27,45,23,9,'{milk}','{indian,high-protein}') ON CONFLICT (name) DO NOTHING;
INSERT INTO nutrition_foods VALUES (gen_random_uuid(),'Dal rice with mixed vegetables','Lunch','vegetarian',500,18,78,10,10,'{}','{indian}') ON CONFLICT (name) DO NOTHING;
INSERT INTO nutrition_foods VALUES (gen_random_uuid(),'Rajma rice bowl','Lunch','vegetarian',540,20,82,10,14,'{}','{indian,high-fiber}') ON CONFLICT (name) DO NOTHING;
INSERT INTO nutrition_foods VALUES (gen_random_uuid(),'Chickpea salad','Lunch','vegan',420,18,58,12,13,'{}','{vegan,high-fiber}') ON CONFLICT (name) DO NOTHING;
INSERT INTO nutrition_foods VALUES (gen_random_uuid(),'Vegetable sambar rice','Lunch','vegan',460,15,72,9,9,'{}','{indian,vegan}') ON CONFLICT (name) DO NOTHING;
INSERT INTO nutrition_foods VALUES (gen_random_uuid(),'Tofu quinoa bowl','Lunch','vegan',480,24,55,15,9,'{soy}','{vegan,high-protein}') ON CONFLICT (name) DO NOTHING;
INSERT INTO nutrition_foods VALUES (gen_random_uuid(),'Curd rice with vegetables','Lunch','vegetarian',430,12,62,11,4,'{milk}','{indian}') ON CONFLICT (name) DO NOTHING;
INSERT INTO nutrition_foods VALUES (gen_random_uuid(),'Brown rice dal bowl','Lunch','vegan',470,19,75,8,11,'{}','{indian,high-fiber}') ON CONFLICT (name) DO NOTHING;
INSERT INTO nutrition_foods VALUES (gen_random_uuid(),'Roasted chana','Snack','vegan',180,9,28,3,7,'{}','{vegan,high-protein}') ON CONFLICT (name) DO NOTHING;
INSERT INTO nutrition_foods VALUES (gen_random_uuid(),'Fruit and mixed nuts','Snack','vegan',230,5,25,13,5,'{peanut,nuts}','{vegan}') ON CONFLICT (name) DO NOTHING;
INSERT INTO nutrition_foods VALUES (gen_random_uuid(),'Sprouts chaat','Snack','vegan',210,11,30,4,8,'{}','{vegan,high-protein}') ON CONFLICT (name) DO NOTHING;
INSERT INTO nutrition_foods VALUES (gen_random_uuid(),'Fruit bowl','Snack','vegan',150,2,34,1,5,'{}','{vegan}') ON CONFLICT (name) DO NOTHING;
INSERT INTO nutrition_foods VALUES (gen_random_uuid(),'Makhana roasted','Snack','vegan',170,5,24,6,4,'{}','{vegan}') ON CONFLICT (name) DO NOTHING;
INSERT INTO nutrition_foods VALUES (gen_random_uuid(),'Coconut chickpea snack','Snack','vegan',220,8,25,9,6,'{}','{vegan,high-fiber}') ON CONFLICT (name) DO NOTHING;
INSERT INTO nutrition_foods VALUES (gen_random_uuid(),'Tofu vegetable stir-fry','Dinner','vegan',430,25,30,21,9,'{soy}','{vegan,high-protein}') ON CONFLICT (name) DO NOTHING;
INSERT INTO nutrition_foods VALUES (gen_random_uuid(),'Paneer tikka with vegetables','Dinner','vegetarian',450,30,25,24,7,'{milk}','{indian,high-protein}') ON CONFLICT (name) DO NOTHING;
INSERT INTO nutrition_foods VALUES (gen_random_uuid(),'Vegetable khichdi','Dinner','vegetarian',390,14,62,8,9,'{}','{indian}') ON CONFLICT (name) DO NOTHING;
INSERT INTO nutrition_foods VALUES (gen_random_uuid(),'Dal soup with vegetable salad','Dinner','vegan',330,17,43,8,11,'{}','{vegan,high-fiber}') ON CONFLICT (name) DO NOTHING;
INSERT INTO nutrition_foods VALUES (gen_random_uuid(),'Palak tofu with rice','Dinner','vegan',440,22,55,13,8,'{soy}','{indian,vegan}') ON CONFLICT (name) DO NOTHING;
INSERT INTO nutrition_foods VALUES (gen_random_uuid(),'Vegetable millet bowl','Dinner','vegan',410,13,62,10,10,'{}','{indian,high-fiber}') ON CONFLICT (name) DO NOTHING;
INSERT INTO nutrition_foods VALUES (gen_random_uuid(),'Chana masala with rice','Dinner','vegan',500,19,78,9,13,'{}','{indian,vegan,high-fiber}') ON CONFLICT (name) DO NOTHING;
INSERT INTO nutrition_foods VALUES (gen_random_uuid(),'Paneer bhurji with vegetables','Dinner','vegetarian',460,28,22,27,6,'{milk}','{indian,high-protein}') ON CONFLICT (name) DO NOTHING;
INSERT INTO nutrition_foods VALUES (gen_random_uuid(),'Lentil vegetable soup','Dinner','vegan',340,18,46,7,12,'{}','{vegan,high-fiber}') ON CONFLICT (name) DO NOTHING;
INSERT INTO nutrition_foods VALUES (gen_random_uuid(),'Mixed vegetable curry with millet','Dinner','vegan',420,12,60,13,9,'{}','{indian,vegan}') ON CONFLICT (name) DO NOTHING;