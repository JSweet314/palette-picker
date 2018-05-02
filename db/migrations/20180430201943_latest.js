
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('projects', table => {
      table.increments('id').primary();
      table.string('projectName');
      table.timestamps(true, true);
    }),
    knex.schema.createTable('palettes', table => {
      table.increments('id').primary();
      table.string('name');
      table.string('color-1');
      table.string('color-2');
      table.string('color-3');
      table.string('color-4');
      table.string('color-5');
      table.integer('projectId');
      table.foreign('projectId').references('projects.id');
      table.timestamps(true, true);
    })
  ]); 
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('palettes'),
    knex.schema.dropTable('projects')
  ]);
};
