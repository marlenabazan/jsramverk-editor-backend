require('dotenv').config()

const mongo = require("mongodb").MongoClient;
const collectionName = "documents";

const database = {
    getDb: async function getDb(collectionName) {
        // let dsn = `mongodb://localhost:27017/editor`;
        let dsn = `mongodb+srv://${process.env.ATLAS_USERNAME}:${process.env.ATLAS_PASSWORD}@cluster0.tcyi1yu.mongodb.net/?retryWrites=true&w=majority`;

        if (process.env.NODE_ENV === 'test') {
            dsn = "mongodb://localhost:27017/test";
            collectionName = 'test';
        }

        const client = await mongo.connect(dsn, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        const db = await client.db();

        const collection = await db.collection(collectionName);

        return {
            db: db,
            collection: collection,
            client: client
        };   
    }
};

module.exports = database;