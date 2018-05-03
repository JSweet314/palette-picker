const chai = require('chai');
const { expect } = chai;
const chaiHttp = require('chai-http');
const {app, database} = require('../server.js');

chai.use(chaiHttp);

describe('Client Routes', () => {
  it('should serve up public html assets by default', done => {
    chai.request(app)
      .get('/')
      .end((error, response) => {
        expect(response).to.have.status(200);
        expect(response).to.be.html;
        done();
      })
      
  });
  it('should return a 404 for an unknown route', done => {
    chai.request(app)
      .get('/notARealRoute')
      .end((error, response) => {
        expect(response).to.have.status(404);
        done();
      })
  });
});

describe('API Routes', () => {
  beforeEach(done => {
    database.migrate.rollback()
      .then(() => {
        database.migrate.latest()
          .then(() => {
            return database.seed.run()
              .then(() => {
                done();
              });
          });
      });
  });

  it('GET palettes should return all of the palettes', done => {
    chai.request(app)
      .get('/api/v1/palettes')
      .end((error, response) => {
        expect(response).to.have.status(200);
        expect(response).to.be.json;
        expect(response.body).to.be.an('array');
        expect(response.body.length).to.eql(3);
        expect(response.body[0]).to.have.property('id');
        expect(response.body[0]).to.have.property('name');
        expect(response.body[0]).to.have.property('color-1');
        expect(response.body[0]).to.have.property('color-2');
        expect(response.body[0]).to.have.property('color-3');
        expect(response.body[0]).to.have.property('color-4');
        expect(response.body[0]).to.have.property('color-5');
        expect(response.body[0]).to.have.property('projectId');
        done();
      })
  })

  it('GET projects should return all of the projects', done => {
    chai.request(app)
      .get('/api/v1/projects')
      .end((error, response) => {
        expect(response).to.have.status(200);
        expect(response).to.be.json;
        expect(response.body).to.be.an('array');
        expect(response.body.length).to.eql(2);
        expect(response.body[0]).to.have.property('id');
        expect(response.body[0]).to.have.property('projectName');
        done();
      })
  })

  it('POST projcet should add a new project to the DB', done => {
    chai.request(app)
      .post('/api/v1/projects')
      .send({projectName: 'Some additional project'})
      .end((error, response) => {
        expect(response).to.have.status(201);
        expect(response.body).to.be.an('object');
        expect(response.body).to.have.property('id');
        expect(response.body.id).to.eql(3);
        done();
      });
  });

  it('POST project should return status 422 with error message if missing a parameter', done => {
    chai.request(app)
      .post('/api/v1/projects')
      .send({})
      .end((error, response) => {
        expect(response).to.have.status(422);
        expect(response.body).to.have.property('error');
        expect(response.body.error)
          .to.eql('Post Error: Missing required projectName');
        done();
      });
  });

  it('POST palette should add a palette to the DB', done => {
    chai.request(app)
      .post('/api/v1/palettes')
      .send({
        name: 'my palette', 
        'color-1': '#000000',
        'color-2': '#000000',
        'color-3': '#000000',
        'color-4': '#000000',
        'color-5': '#000000',
        projectId: 1
      })
      .end((error, response) => {
        expect(response).to.have.status(201);
        expect(response.body).to.be.an('object');
        expect(response.body).to.have.property('id');
        expect(response.body.id).to.eql(4);
        done()
      });
  });

  it('POST palette should return status 422 with an error message if missing a parameter', done => {
    chai.request(app)
      .post('/api/v1/palettes')
      .send({
        'color-1': '#000000',
        'color-2': '#000000',
        'color-3': '#000000',
        'color-4': '#000000',
        'color-5': '#000000',
        projectId: 1})
      .end((error, response) => {
        expect(response).to.have.status(422);
        expect(response.body).to.have.property('error');
        expect(response.body.error)
          .to.eql('Post Error: Missing required name property.');
        done();
      });
  });

  it('DELETE palette should delete a palette from the DB', done => {
    chai.request(app)
      .delete('/api/v1/palettes')
      .send({id: 1})
      .end((error, response) => {
        expect(response).to.have.status(200);
        expect(response.body).to.be.an('object');
        expect(response.body).to.have.property('message');
        expect(response.body.message).to.eql('Deleted 1');
        done();
      })
  });

  it('DELETE palette should return status 422 with error message if missing a parameter', done => {
    chai.request(app)
      .delete('/api/v1/palettes')
      .send({})
      .end((error, response) => {
        expect(response).to.have.status(422);
        expect(response.body).to.have.property('error');
        expect(response.body.error)
          .to.eql('Delete Error: Missing required id');
        done();
      });
  });
});
