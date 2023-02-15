const database = require("../db/database.js");
const ObjectId = require('mongodb').ObjectId; 
const collectionName = "documents";

const documents = {
    getAllDocuments: async function getAllDocuments() {
        let db;

        try {
            db = await database.getDb(collectionName);

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
            db = await database.getDb(collectionName);

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
            db = await database.getDb(collectionName);

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
    updateDoc: async function updateDoc(docToUpdateId, newText) {
        console.log("update start");
        let db;

        try {
            db = await database.getDb(collectionName);

            await db.collection.updateOne({ _id: ObjectId(docToUpdateId) }, 
                { 
                    $set: {
                        text: newText 
                    }
                });

            const result = await db.collection.findOne({ _id: ObjectId(docToUpdateId) });

            return {
                result
            }
        } catch (error) {
            console.error(error.message);
        } finally {
            await db.client.close();
        }
    },
    shareDoc: async function updateDoc(docToShare, userToShare) {
        let db;

        try {
            db = await database.getDb(collectionName);

            await db.collection.updateOne({ _id: ObjectId(docToShare) }, 
                { 
                    $push: {
                        shared: userToShare
                    }
                });

            const result = await db.collection.findOne({ _id: ObjectId(docToShare) });

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
            db = await database.getDb(collectionName);

            const result = await db.collection.deleteMany({});

        } catch (error) {
            console.error(error.message);
        } finally {
            await db.client.close();
        }
    }
};

module.exports = documents;