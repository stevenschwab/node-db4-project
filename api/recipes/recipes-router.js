const express = require('express')
const router = express.Router()
const { 
    checkRecipeId, 
    validateRecipe, 
    validateSteps, 
    validateStepIngredients
} = require('./recipes-middleware')
const Recipes = require('./recipes-model')

router.get('/:recipe_id', checkRecipeId, (req, res, next) => {
    const { recipe_id}  = req.params

    Recipes.getRecipeById(recipe_id)
        .then(recipe => {
            res.json(recipe)
        })
        .catch(next)
})

router.post(
    '/', 
    validateRecipe, 
    validateSteps, 
    validateStepIngredients, 
    (req, res, next) => {
    Recipes.addRecipe(req.body)
      .then(recipe => {
        res.status(201).json(recipe)
      })
      .catch(next)
})

router.use((error, req, res, next) => { // eslint-disable-line
    res.status(error.status || 500).json({
        message: 'something bad happened in the recipes-router',
        errorMessage: error.message,
        stack: error.stack
    })
})

module.exports = router