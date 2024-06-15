const db = require('../../data/db-config')

async function getRecipeById(recipe_id) {
    const recipe = await db('recipes as re')
        .join('steps as st', 're.id', 'st.recipe_id')
        .leftJoin('steps_ingredients as si', 'st.id', 'si.step_id')
        .leftJoin('ingredients as ing', 'si.ingredient_id', 'ing.id')
        .where('re.id', recipe_id)
        .select(
            'st.recipe_id', 
            're.recipe_name', 
            're.created_at',
            'si.step_id', 
            'st.step_number', 
            'st.step_instructions',
            'si.ingredient_id', 
            'ing.ingredient_name', 
            'si.quantity'
        );

    let result = recipe.reduce((acc, recipeStep) => {
      const {
        step_id, 
        step_number, 
        step_instructions, 
        ingredient_id, 
        ingredient_name, 
        quantity 
      } = recipeStep

      let step = {
        step_id,
        step_number,
        step_instructions,
        ingredients: []
      }

      if (ingredient_id) {
        step.ingredients.push({ 
            ingredient_id, 
            ingredient_name, 
            quantity 
        })
      }
      
      acc.steps.push(step)
      return acc
    }, { 
        recipe_id: recipe[0].recipe_id, 
        recipe_name: recipe[0].recipe_name, 
        created_at: recipe[0].created_at,
        steps: [] 
    })
    
    return result
}

module.exports = {
    getRecipeById
}