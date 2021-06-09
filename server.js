require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors'); //for handliing cors configuration.

const mongoose = require('mongoose'); // for working w/ our database
const config = require('./config');

mongoose.Promise = global.Promise;
mongoose.connect(config.database, { useUnifiedTopology: true, useFindAndModify: false, useNewUrlParser: true });

let conn = mongoose.connection;
conn.on('error', function(err){
    console.log('mongoose connection error:', err.message);
});

app.use(cors());

//for parsing and receiving json payloads.
app.use(express.urlencoded({ limit: '5mb', extended: true}));
app.use(express.json());

// configure our app to handle CORS requests
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Headers', 'x-access-token,X-Requested-With,Content-Type,Authorization');
    res.setHeader('X-Powered-By', 'Lucky Lucciano');
    next();
});

//import our routes.
let PostRoutes = require('./app/routes/PostRoutes');

app.use(function(req, res, next) {
    console.log(req.method, req.url); //logs each request to the console.
    next(); 
});

//set our app to handling our routes.
app.use("/api/v1/posts", PostRoutes);

app.use(function(req, res) {
    return res.status(404).send({ message: 'The url you visited does not exist.' });
});

//start app.
app.listen(config.port, () => console.log(`Listening on port ${config.port}!`));

module.exports = app; // for testing