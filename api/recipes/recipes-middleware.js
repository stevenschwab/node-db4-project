const db = require('../../data/db-config')
const Recipes = require('./recipes-model')

const checkRecipeId = async (req, res, next) => {
    const { recipe_id } = req.params
    const recipe = await db('recipes').where('id', recipe_id).first()

    if (recipe) {
        next()
    } else {
        next({ status: 404, message: `recipe with recipe id ${recipe_id} not found` })
    }
}

const validateRecipe = async (req, res, next) => {
    const { recipe_name, steps } = req.body

    if (
        recipe_name == null || 
        typeof recipe_name !== 'string' || 
        !recipe_name.trim().length
    ) {
        next({ status: 400, message: "invalid recipe_name" })
    } else if (
        steps == null || 
        !Array.isArray(steps) || 
        steps.length < 1
    ) {
        next({ status: 400, message: "invalid steps" })
    } else {
        next()
    }
}

const validateSteps = async (req, res, next) => {
    const { steps } = req.body

    for (const step of steps) {
        const { step_number, step_instructions } = step

        if (
            step_number == null || 
            typeof step_number !== 'number'
        ) {
            return next({ status: 400, message: "invalid step_number" })
        } else if (
            step_instructions == null || 
            typeof step_instructions !== 'string' || 
            !step_instructions.trim().length
        ) {
            return next({ status: 400, message: "invalid step_instructions" })
        }
    }
    next()
}

const validateStepIngredients = async (req, res, next) => {
    const { steps } = req.body

    try {
        for (const step of steps) {
            if (step.ingredients && step.ingredients.length > 0) {
                for (const ingredient of step.ingredients) {
                    const { ingredient_id, quantity, unit } = ingredient

                    if (
                        ingredient_id == null || 
                        typeof ingredient_id !== 'number' || 
                        !(await Recipes.getIngredientById(ingredient_id))
                    ) {
                        throw new Error('invalid ingredient_id')
                    } else if (
                        quantity == null || 
                        typeof quantity !== 'number' || 
                        quantity < 0
                    ) {
                        throw new Error('invalid quantity')
                    } else if (
                        unit == null || 
                        typeof unit !== 'string' || 
                        !unit.trim().length
                    ) {
                        throw new Error('invalid unit')
                    }
                }
            }
        }

        next()
    } catch (error) {
        next({ status: 400, message: error.message })
    }
}

module.exports = {
    checkRecipeId,
    validateRecipe,
    validateSteps,
    validateStepIngredients
}