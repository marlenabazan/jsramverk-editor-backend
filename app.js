require('dotenv').config()
const express = require("express");
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require("body-parser");

const visual = false;
const { graphqlHTTP } = require('express-graphql');
const {
    GraphQLSchema
} = require('graphql');

const RootQueryType = require('./graphql/root.js');

const app = express();
const httpServer = require("http").createServer(app);

const port = process.env.PORT || 1337;

const documents = require('./routes/documents');
const index = require('./routes/index');
const auth = require('./routes/auth');
const invite = require('./routes/invite');

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cors());
app.options('*', cors());
app.use(express.json());


// don't show the log when it is test
if (process.env.NODE_ENV !== 'test') {
    // use morgan to log at command line
    app.use(morgan('combined')); // 'combined' outputs the Apache style LOGs
}

const schema = new GraphQLSchema({
    query: RootQueryType
});

app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: visual, // Visual är satt till true under utveckling
}));

app.use('/docs', documents);
app.use('/auth', auth);
app.use('/invite', invite);
app.use('/', index);

const io = require("socket.io")(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

io.sockets.on("connection", function(socket) {
    console.log("Socket id: ", socket.id); // Nått lång och slumpat

    socket.on("create", (room) => {
        console.log("joining room", room);
        socket.join(room);
    });

    socket.on("doc", (data) => {
        // console.log("received data:", data);
        socket.to(data["_id"]).emit("doc", data);
    });
});

app.use((req, res, next) => {
    console.log(req.method);
    console.log(req.path);
    next();
});


// Start up server
// app.listen(port, () => console.log(`Example API listening on port ${port}!`));


// Add routes for 404 and error handling
// Catch 404 and forward to error handler
// Put this last
app.use((req, res, next) => {
    var err = new Error("Not Found");
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    res.status(err.status || 500).json({
        "errors": [
            {
                "status": err.status,
                "title":  err.message,
                "detail": err.message
            }
        ]
    });
});

const server = httpServer.listen(port, () => console.log(`Example app listening on port ${port}!`));

module.exports = server;