# Getting started with Document API
This API uses MongoDB Atlas to store all documents. You must have Node.js installed and have MongoDB installed or, if you want to, you can use MongoDB in Docker 

## Install depencensies
`npm install`

## Connect to database
You can connect to database localy: <br />
```let dsn = `mongodb://localhost:27017/`;```

or in the MongoDB Atlas cloud: <br />
```let dsn = `mongodb+srv://${process.env.ATLAS_USERNAME}:${process.env.ATLAS_PASSWORD}@cluster0.tcyi1yu.mongodb.net/?retryWrites=true&w=majority`;```

## Connect to MongoDB Atlas
To connect to MongoDBs Cluster create `.env` file in the root of your backend directory. It should contain 
```
ATLAS_USERNAME="YOUR_USERNAME"
ATLAS_PASSWORD="YOUR_PASSWORD"
```

## Start the server

`npm start` = node app.js <br />

`npm run watch` = nodemon app.js

# Routes
`"/docs"` gets and creates documents.

`"/docs/:id"` shows one chosen document.

`"/docs/update"` updates one document.

`"/docs/share"` shares a document with somebody.

`"/auth/register"` is used to register.

`"/auth/login"` is used to log in.

`"/invite"` sends an invite to a document.

