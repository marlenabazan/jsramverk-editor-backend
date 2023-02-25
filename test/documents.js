process.env.NODE_ENV = 'test';

const database = require("../db/database.js");
const docsModel = require("../models/documents");
const collectionName = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app.js');

chai.should();
chai.use(chaiHttp);

const sinon = require('sinon');

const expect = chai.expect;
const Mailgun = require('mailgun.js');
const formData = require('form-data');

const inviteModel = require("../models/invite");

describe('Documents', () => {
    let user;
    let token;
    let doc;

    before(() => {
        return new Promise(async (resolve) => {
            const db = await database.getDb(collectionName);

            db.db.listCollections(
                { name: collectionName }
            )
                .next()
                .then(async function (info) {
                    if (info) {
                        await db.collection.drop();
                    }
                })
                .catch(function (err) {
                    console.error(err);
                })
                .finally(async function () {
                    await db.client.close();
                    resolve();
                });
        });
    });

    describe('POST /register', () => {
        it('Register new user', (done) => {

            const registerUser = {
                email: `testemail@test.se`,
                password: "testpassword"
            };

            chai.request(server)
                .post("/auth/register")
                .send(registerUser)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.data.message.should.equal("User succesfully created");

                    user = registerUser;

                    done();
                });
        });

        it('Register with no password', (done) => {

            const registerUserWithNoPassword = {
                email: `testemail1@test.se`,
                password: ""
            };

            chai.request(server)
                .post("/auth/register")
                .send(registerUserWithNoPassword)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.errors.message.should.equal("E-mail or password missing");

                    done();
                });
        });

        it('Register with wrong email form', (done) => {

            const registerUserWithNoPassword = {
                email: `testwrongemail.se`,
                password: "testpassword"
            };

            chai.request(server)
                .post("/auth/register")
                .send(registerUserWithNoPassword)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.errors.message.should.equal("E-mail is not in correct form");

                    done();
                });
        });
    });

    describe('POST /login', () => {
        it('Login', (done) => {

            const loginUser = {
                email: user.email,
                password: user.password
            };

            chai.request(server)
                .post("/auth/login")
                .send(loginUser)
                .end((err, res) => {
                    res.should.have.status(201);

                    token = res.body.data.token;

                    done();
                });
        });

        it('Login with wrong password', (done) => {

            const loginUserWithWrongPassword = {
                email: user.email,
                password: "wrongpassword"
            };

            chai.request(server)
                .post("/auth/login")
                .send(loginUserWithWrongPassword)
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.errors.message.should.equal("Password not correct");

                    done();
                });
        });
    });

    describe('GET /docs', () => {
        it('200 HAPPY PATH', (done) => {
            chai.request(server)
                .get("/docs")
                .set('x-access-token', token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    res.body.data.should.be.an("array");
                    res.body.data.length.should.be.equal(1); // 1 = registered user above

                    done();
                });
        });
    });

    describe('GET /invalidpath', () => {
        it('404 Invalid path', (done) => {
            chai.request(server)
                .get("/invalidpath")
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.have.property("errors");

                    done();
                });
        });
    });

    describe('POST /docs', () => {
        it('201 Create new document', (done) => {
            let newDoc = {
                title: 'test doc',
                text: 'test'
            }
            chai.request(server)
                .post("/docs")
                .send(newDoc)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.an("object");
                    res.body.should.have.property("data");
                    res.body.data.should.have.property("title");
                    res.body.data.should.have.property("text");
                    res.body.data.title.should.equal("test doc");
                    res.body.data.text.should.equal("test");

                    doc = res.body.data;

                    done();
                });
        });
    });

    describe('Root Query', () => {
        it('returns a list of all documents', (done) => {
            const query = `
                query {
                    documents {
                        _id
                        title
                        text
                    }
                }
            `;
          
          chai.request(server)
            .post('/graphql')
            .send({ query })
            .end((err, res) => {
                res.should.have.status(200);

                done();
            });
        });

        it('returns a single document by id', (done) => {
            const query = `
                query {
                document(id: "${doc._id}") {
                    _id
                    title
                    text
                    }
                }
            `;
            
            chai.request(server)
                .post('/graphql')
                .send({ query })
                .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.an("object");
                res.body.should.have.property("data");

                done();
            });
        });
    });

    describe('PUT /docs/update', () => {
        it('201 Update a document', (done) => {
            let updatedDoc = {
                _id: doc._id,
                text: 'test updated'
            }
            chai.request(server)
                .put("/docs/update")
                .send(updatedDoc)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    res.body.should.have.property("data");
                    res.body.data.result.should.have.property("title");
                    res.body.data.result.should.have.property("text");
                    res.body.data.result.title.should.equal("test doc");
                    res.body.data.result.text.should.equal("test updated");
    
                    done();
                });
        });
    });

    describe('DELETE /docs', () => {
        it('204 Delete a document', (done) => {
            chai.request(server)
                .delete("/docs")
                .end((err, res) => {
                    res.should.have.status(204);
    
                    done();
                });
        });
    });
    
    describe('GET /docs/:id', () => {
        it('200 Get a document by id', (done) => {
            chai.request(server)
                .get("/docs/123")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    res.body.should.have.property("data");
    
                    done();
                });
        });
    });

    describe('POST /invite', () => {
        it('should call send function', () => {

            const req = { 
                body: { 
                    recipient: 'test@test.com',
                    title: 'Test'
                }
            };

            const res = { 
                status: sinon.spy(), 
                json: sinon.spy() 
              };
              
            const sendSpy = sinon.spy(inviteModel, 'send');
            
            inviteModel.send(req, res);
        
            expect(sendSpy.calledOnce).to.be.true;
        });
      });
});