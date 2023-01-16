process.env.NODE_ENV = 'test';

const database = require("../db/database.js");
const docsModel = require("../models/documents");
const collectionName = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app.js');

chai.should();
chai.use(chaiHttp);

describe('Documents', () => {
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


    describe('GET /docs', () => {
        it('200 HAPPY PATH', (done) => {
            chai.request(server)
                .get("/docs")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    res.body.data.should.be.an("array");
                    res.body.data.length.should.be.equal(0);

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

                    done();
                });
        });
    });

    describe('PUT /docs', () => {
        it('201 Update a document', (done) => {
            let updatedDoc = {
                title: 'test doc',
                text: 'test updated'
            }
            chai.request(server)
                .put("/docs")
                .send(updatedDoc)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.an("object");
                    res.body.should.have.property("data");
                    res.body.data.result[0].should.have.property("title");
                    res.body.data.result[0].should.have.property("text");
                    res.body.data.result[0].title.should.equal("test doc");
                    res.body.data.result[0].text.should.equal("test updated");
    
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
});

