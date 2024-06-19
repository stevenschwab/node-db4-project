const db = require('../../data/db-config')

async function getRecipeById(recipe_id, trx = db) {
    const recipe = await trx('recipes as re')
        .join('steps as st', 're.id', 'st.recipe_id')
        .leftJoin('steps_ingredients as si', 'st.id', 'si.step_id')
        .leftJoin('ingredients as ing', 'si.ingredient_id', 'ing.id')
        .where('re.id', recipe_id)
        .select(
            'st.recipe_id', 
            're.recipe_name', 
            're.created_at',
            'st.id as step_id', 
            'st.step_number', 
            'st.step_instructions',
            'si.ingredient_id', 
            'ing.ingredient_name', 
            'si.quantity'
        )
        .orderBy('step_number', 'ASC');

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

async function insertRecipe(trx, recipe_name) {
    const [result] = await trx('recipes')
        .insert({ recipe_name})
        .returning('id')
    
    const recipe_id = result.id
    return recipe_id
}

async function insertSteps(trx, recipe_id, steps) {
    const stepsWithRecipeId = steps.map((step) => ({
        recipe_id,
        step_number: step.step_number,
        step_instructions: step.step_instructions
    }))

    await trx('steps').insert(stepsWithRecipeId)
}

async function getNewSteps(trx, recipe_id) {
    return await trx('steps')
      .select('id as step_id', 'step_number')
      .where('recipe_id', recipe_id)
}

function prepareIngredientsWithStepId(steps, newSteps) {
    const ingredientsWithStepId = []
    steps.forEach(step => {
        if (step.ingredients && step.ingredients.length) {
            const { step_id } = newSteps.find(newStep => newStep.step_number === step.step_number)
            step.ingredients.forEach(ingredient => {
                ingredientsWithStepId.push({
                    step_id,
                    ...ingredient
                })
            })
        }
    })
    return ingredientsWithStepId
}

async function insertStepsIngredients(trx, ingredientsWithStepId) {
    if (ingredientsWithStepId.length) {
        await trx('steps_ingredients').insert(ingredientsWithStepId)
    }
}

async function addRecipe(recipe) {
    const { recipe_name, steps } = recipe

    return db.transaction(async trx => {
        const recipe_id = await insertRecipe(trx, recipe_name)
        await insertSteps(trx, recipe_id, steps)
        const newSteps = await getNewSteps(trx, recipe_id)
        const ingredientsWithStepId = prepareIngredientsWithStepId(steps, newSteps)
        await insertStepsIngredients(trx, ingredientsWithStepId)
        return await getRecipeById(recipe_id, trx)
    })
}

async function getIngredientById(ingredient_id) {
    const ingredient = await db('ingredients')
        .select('ingredient_name')
        .where('id', ingredient_id)
        .first()

    return ingredient
}

module.exports = {
    getRecipeById,
    addRecipe,
    getIngredientById,
}