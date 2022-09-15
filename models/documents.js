const database = require("../db/database.js");
const ObjectId = require('mongodb').ObjectId; 

const documents = {
    getAllDocuments: async function getAllDocuments() {
        let db;

        try {
            db = await database.getDb();

            const allDocuments = await db.collection.find().toArray();
 
            return allDocuments
        } catch (error) {
            return {
                errors: {
                    message: error.message,
                }
            };
        } finally {
            await db.client.close();
        }
    },
    getOneDocument: async function getOneDocument(docToGet) {
        let db;

        try {
            db = await database.getDb();

            const oneDocument = await db.collection.findOne({ _id: ObjectId(docToGet) });
 
            return oneDocument
        } catch (error) {
            return {
                errors: {
                    message: error.message,
                }
            };
        } finally {
            await db.client.close();
        }
    },
    insertDoc: async function insertDoc(newDoc) {
        let db;

        try {
            db = await database.getDb();

            const result = await db.collection.insertOne(newDoc);

            return {
                ...newDoc,
                _id: result.insertedId,
            }
        } catch (error) {
            console.error(error.message);
        } finally {
            await db.client.close();
        }
    },
    updateDoc: async function updateDoc(docToUpdate, newText) {
        let db;

        try {
            db = await database.getDb();

            await db.collection.updateOne({ title: docToUpdate }, 
                { 
                    $set: {
                        text: newText 
                    }
                });

            const result = await db.collection.find({ title: docToUpdate }).toArray();

            return {
                result
            }
        } catch (error) {
            console.error(error.message);
        } finally {
            await db.client.close();
        }
    },
    removeDocs: async function removeDocs() {
        let db;

        try {
            db = await database.getDb();

            const result = await db.collection.deleteMany({});

        } catch (error) {
            console.error(error.message);
        } finally {
            await db.client.close();
        }
    }
};

module.exports = documents;