const express = require('express')
const router = express.Router()
const Ingredients = require('./ingredients-model')

router.get('/', (req, res, next) => {
    Ingredients.getAllIngredients()
        .then(recipes => {
            res.json(recipes)
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