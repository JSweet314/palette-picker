
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('palettes').del()
    .then(() => knex('projects').del())
    .then(() => 
      Promise.all([knex('projects').insert([
        {projectName: 'my-project-1'},
        {projectName: 'my-project-2'}
      ], 'id')
        .then(projects => 
          knex('palettes').insert([
            {
              name: 'test-palette-1', 
              'color-1': 'black', 
              'color-2': 'black', 
              'color-3': 'black', 
              'color-4': 'black', 
              'color-5': 'black',
              'projectId': projects[0]
            },
            {
              name: 'test-palette-2', 
              'color-1': 'white', 
              'color-2': 'white', 
              'color-3': 'white', 
              'color-4': 'white', 
              'color-5': 'white',
              'projectId': projects[1]
            },
            {
              name: 'test-palette-4', 
              'color-1': 'blue', 
              'color-2': 'blue', 
              'color-3': 'blue', 
              'color-4': 'blue', 
              'color-5': 'blue',
              'projectId': projects[0]
            },
          ])
        )
        .catch(error => console.log(`Error seeding data: ${error}`))
      ])
    );
};
