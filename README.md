# Palette Picker
## Author:  Jonathan Sweet - [Github @*JSweet314*](https://github.com/jsweet314)
### View this project [live on heroku](https://palettepicker-js.herokuapp.com)

A simple application for generating and saving project color palettes. The front end is built with JS/JQuery, HTML, and CSS. The backend serves up the static assets on a node/express server with a relational database utilizing postgres/knex.js.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. 

### Prerequisites

Node and postgresql can be installed with [homebrew](http://brew.sh) if needed. 

```
/* postgreSQL */
brew install postgresql
/* node.js */
brew install node 
```

### Installing


Clone down this repo

```
git clone https://github.com/JSweet314/palette-picker.git
```

Change in to the project directory and install the dependencies.

```
cd palette-picker && npm install
```

Start the node/express server.

```
node server.js

Visit http://localhost:3000/ in your browser
```



## Running the tests

Make sure the test runner, mocha, is installed globally. Tests utilize the chai assertion library along with chai http for testing server routes.

```
npm install -G mocha
```

Run the test suite in your terminal with the command

```
npm test
```

Make sure you do not already have the project server running prior to running the test suite.

## Built With

* [Node](https://nodejs.org/) - Javascript runtime environment
* [Express](https://https://expressjs.com/) - Web application framework for node.
* [postgreSQL](https://www.postgresql.org/) - Database Management System
* [Knex](https://rometools.github.io/rome/) - Javascript SQL query builder
* [jQuery](https://jquery.com) - Javascript utility library.