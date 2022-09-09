const database = require("../db/database.js");
// const initDocuments = require("../data/documents.json");

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
    }
}

export default documents;