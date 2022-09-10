const database = require("../db/database.js");

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
    }
};

module.exports = documents;