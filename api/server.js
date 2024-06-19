const express = require('express')
const cors = require('cors')

const recipesRouter = require('./recipes/recipes-router')
const ingredientsRouter = require('./ingredients/ingredients-router')

const server = express()

server.use(express.json())
server.use(cors())
server.use('/api/recipes', recipesRouter)
server.use('/api/ingredients', ingredientsRouter)

module.exports = server