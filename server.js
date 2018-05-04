const express = require('express'); // Imports the express library which is an abstraction layer applied to node's http server library to simplify server related tasks.
const bodyParser = require('body-parser'); // Imports the body-parser library in order to parse the json data sent in the body of a request.
const app = express(); //  Creates an express server and assigns it to the variable 'app'.
const environment = process.env.NODE_ENV || 'development'; // Assigns a manually defined environment variable NODE_ENV or 'development' by default to the variable 'environment'
const configuration = require('./knexfile')[environment]; // Imports an object of objects specifiying envirionment confirgurations for knex and assigns a specific environment object to the variable 'configuration'.
const database = require('knex')(configuration); // Imports the knex library and assigns an instance of knex, with the configuration variable passed as an argument, to the variable 'database'. Knex allows us to interact with our postgres database with useful javascript methods rather than writing SQL. 

app.set('port', process.env.PORT || 3000); // Sets the server port based on an environment variable established when the server is started or 3000 by default.
app.use('/', express.static('public')); // Tells the express server to respond with the files in the public directory of the application when the path of a get request. In this case, an html file is sent which contains script and link tags that import css, images, and javascript files.
app.use(bodyParser.json()); // Tells the express server to use the body-parser libary when a request is received.

app.get('/api/v1/palettes', (request, response) => { // Establishes a GET request route handler which takes two arguments, a route and a callback function.
  database('palettes').select() // Accesses the palettes table in the connected database and selects everything from the table and returns it as a promise.
    .then(palettes => response.status(200).json(palettes)) // Consumes the promise returned from the previous line and uses the response object paramater's methods to set an http status code of 200 to signify a successful response and return the requested database information in json format.
    .catch(error => response.status(500).json({ error })); // Catches any errors that may have resulted from a failed database interaction and returns a response with a http status code of 500 signifying an internal server error and an error message.
});

app.get('/api/v1/projects', (request, response) => { // Establishes a GET request route handler which takes two arguments, a route and a callback function.
  database('projects').select() // // Accesses the projects table in the connected database and selects everything from the table and returns it as a promise.
    .then(projects => response.status(200).json(projects)) // Consumes the promise returned from the previous line and uses the response object paramater's methods to set an http status code of 200 to signify a successful response and return the requested database information in json format.
    .catch(error => response.status(500).json({ error })); // Catches any errors that may have resulted from a failed database interaction and returns a response with a http status code of 500 signifying an internal server error and an error message.
});

app.post('/api/v1/palettes', (request, response) => { // Establishes a GET request route handler which takes two arguments, a route and a callback function.
  const palette = request.body; // Assigns the body of the request to the variable 'palette'.
  for (
    let requiredParam of
    ['name', 'color-1', 'color-2', 'color-3', 'color-4', 'color-5', 'projectId'] // For-Of loop which will check that the body of the request contains the parameters needed to successfuly post the new palette to the database. 
  ) {
    if (!palette[requiredParam]) { // If a required parameter is missing, a response is returned with status code 422 and an error stating the first missing required parameter.
      return response.status(422)
        .send({ 
          error: `Post Error: Missing required ${requiredParam} property.` 
        });
    }
  }

  database('palettes').insert(palette, 'id') // Inserts the new palette in to the database and returns a promise with an array containing the id (primary key) of the palette.
    .then(palette => response.status(201).json({ id: palette[0] })) // Consumes the promise returned from knex and returns a response with http status 201 signifying a succesful post and json data containing the id of the new pallete entry.
    .catch(error => response.status(500).json({ error })); // Catches any errors that may have resulted from a failed database interaction and returns a response with a http status code of 500 signifying an internal server error and an error message.
});

app.post('/api/v1/projects', (request, response) => { 
  const project = request.body; // Assigns the body of the request to the variable 'palette'.
  if (!project.projectName) { // Evaluates whether the a required 'projectName' parameter is provided and if not, a response is initiated with http status 422 signifying an unprocessable entity and an error message. 
    return response.status(422)
      .send({ error: 'Post Error: Missing required projectName' });
  }

  database('projects').insert(project, 'id') // Inserts the new project in to the database and returns a promise with an array containing the id (primary key) of the project..
    .then(project => response.status(201).json({ id: project[0] })) // Consumes the promise returned from knex and returns a response with http status 201 signifying a succesful post and json data containing the id of the new project entry.
    .catch(error => response.status(500).json({ error })); // Catches any errors that may have resulted from a failed database interaction and returns a response with a http status code of 500 signifying an internal server error and an error message.
});

app.delete('/api/v1/palettes', (request, response) => { // Establishes a DELETE request route handler which takes two arguments, a route and a callback function.
  const { id } = request.body; // Assigns the body of the request to a variable.
  if (!id) { // if the id required to identify the palette to delete is missing, a response is initiated with http status 422 signifying an unprocessable entity and an error message. a response is initiated with 
    return response.status(422)
      .send({ error: 'Delete Error: Missing required id' });
  }
  database('palettes').where({ id }).del() // Queries the palettes table in the database for the row that matches the provided id, deletes the row from the database, and returns a promise containing the number of deleted entries.
    .then(() => response.status(200).json({ message: `Deleted ${palette.id}` })) // Upon successful deletion, sends a confirmation message back to the user along with status code 200
    .catch(error => response.status(500).json({ error })); // Catches any errors that may have resulted from a failed database interaction and returns a response with a http status code of 500 signifying an internal server error and an error message.
});

app.listen(app.get('port'), () => { // starts the server so that it is listening for requests and console logs that fact.
  console.log(`Palette Picker server running on ${app.get('port')}.`);
});

module.exports = {app, database}; // exports the server and database instances created with express and knex for use in the routes test file.