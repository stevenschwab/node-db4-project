/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('steps_ingredients').truncate()
  await knex('ingredients').truncate()
  await knex('steps').truncate()
  await knex('recipes').truncate()

  await knex('recipes').insert([
    { recipe_name: 'Spaghetti Bolognese' },
    { recipe_name: 'Roast Chicken' }
  ]);

  await knex('steps').insert([
    { recipe_id: 1, step_number: 1, step_instructions: 'Put a large saucepan on a medium heat' },
    { recipe_id: 1, step_number: 2, step_instructions: 'Add olive oil' },
    { recipe_id: 1, step_number: 3, step_instructions: 'Add minced beef and cook until browned' },
    { recipe_id: 2, step_number: 1, step_instructions: 'Preheat the oven to 200C' },
    { recipe_id: 2, step_number: 2, step_instructions: 'Season the chicken' },
    { recipe_id: 2, step_number: 3, step_instructions: 'Roast the chicken for 1 hour' }
  ]);

  await knex('ingredients').insert([
    { ingredient_name: 'olive oil' },
    { ingredient_name: 'minced beef' },
    { ingredient_name: 'chicken' },
    { ingredient_name: 'salt' },
    { ingredient_name: 'pepper' }
  ]);

  await knex('steps_ingredients').insert([
    { step_id: 2, ingredient_id: 1, quantity: 1.0, unit: 'tbsp' }, // Olive oil in Add 1 tbsp olive oil
    { step_id: 3, ingredient_id: 2, quantity: 0.5, unit: 'lb' }, // Minced beef in Add minced beef and cook until browned
    { step_id: 5, ingredient_id: 3, quantity: 1.0, unit: 'lb' }, // Chicken in Season the chicken
    { step_id: 5, ingredient_id: 4, quantity: 1.0, unit: 'tsp' }, // Salt in Season the chicken
    { step_id: 5, ingredient_id: 5, quantity: 1.0, unit: 'tsp' } // Pepper in Season the chicken
  ]);
};
