const db = require('../../data/db-config')

async function getAllIngredients() {
    return await db('ingredients')
        .select('id', 'ingredient_name')
}

module.exports = {
    getAllIngredients
}