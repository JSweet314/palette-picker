const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.set('port', process.env.PORT || 3000);
app.use('/', express.static('public'));
app.use(bodyParser.json());

app.get('/api/v1/palettes', (request, response) => {
  database('palettes').select()
    .then(palettes => response.status(200).json(palettes))
    .catch(error => response.status(500).json({ error }));
});

app.post('/api/v1/palettes', (request, response) => {
  const palette = request.body;
  for (
    let requiredParam of 
    ['name', 'color-1', 'color-2', 'color-3', 'color-4', 'color-5', 'projectId']
  ) {
    if (!palette[requiredParam]) {
      return response.status(422)
        .send({ error: `Missing required ${requiredParam} property.`});
    }
  }

  database('palettes').insert(palette, 'id')
    .then(palette => response.status(201).json({ id: palette[0] }))
    .catch(error => response.status(500).json({ error }));
});

app.get('/api/v1/projects', (request, response) => {
  database('projects').select()
    .then(projects => response.status(200).json(projects))
    .catch(error => response.status(500).json({ error }));
})

app.post('/api/v1/projects', (request, response) => {
  const project = request.body;
  if (!project.projectName) {
    console.log(project);
    return 'baloney';
  }
  database('projects').insert(project, 'id')
    .then(project => response.status(201).json({ id: project[0] }))
    .catch(error => response.status(500).json({ error }));
});

app.listen(app.get('port'), () => {
  console.log(`Palette Picker server running on ${app.get('port')}.`);
});