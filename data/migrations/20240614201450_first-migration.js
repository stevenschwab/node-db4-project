/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  await knex.schema
    .createTable('recipes', table => {
      table.increments('id')
      table.string('recipe_name')
        .notNullable()
        .unique()
      table.timestamp('created_at').defaultTo(knex.fn.now())
    })
    .createTable('steps', table => {
      table.increments('id')
      table.integer('recipe_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('recipes')
        .onDelete('CASCADE')
      table.integer('step_number')
        .unsigned()
        .notNullable()
      table.string('step_instructions')
        .notNullable()
      table.unique(['recipe_id', 'step_number'])
    })
    .createTable('ingredients', table => {
      table.increments('id')
      table.string('ingredient_name')
        .notNullable()
    })
    .createTable('steps_ingredients', table => {
      table.increments('step_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('steps')
        .onDelete('CASCADE')
      table.integer('ingredient_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('ingredients')
        .onDelete('CASCADE')
      table.string('quantity')
        .notNullable()
      table.primary(['step_id', 'ingredient_id'])
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  await knex.schema
    .dropTableIfExists('steps_ingredients')
    .dropTableIfExists('ingredients')
    .dropTableIfExists('steps')
    .dropTableIfExists('recipes')
};
