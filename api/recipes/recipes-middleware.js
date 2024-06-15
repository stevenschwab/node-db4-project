const db = require('../../data/db-config')

const checkRecipeId = async (req, res, next) => {
    const recipe_id = req.params
    const recipe = db('recipes').where('id', recipe_id).first()

    if (recipe) {
        next()
    } else {
        next({ status: 404, message: `recipe with recipe id ${recipe_id} not found` })
    }
}

module.exports = {
    checkRecipeId
}