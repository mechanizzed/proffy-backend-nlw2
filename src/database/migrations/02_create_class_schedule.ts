import Knex from 'knex';

export async function up(Knex: Knex) {
  return Knex.schema.createTable('class_schedule', (table) => {
    table.increments('id').primary();
    table.string('subject').notNullable();
    table.decimal('cost').notNullable();

    table
      .integer('class_id')
      .notNullable()
      .references('id')
      .inTable('classes')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
  });
}

export async function down(Knex: Knex) {
  return Knex.schema.dropTable('class_schedule');
}
