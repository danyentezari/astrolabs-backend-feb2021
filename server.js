// Import packages
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const products = require('./routes/products.js');
const users = require('./routes/users.js');

// A package that allows express to read environment variables (like CONNECTION_STRING)
require('dotenv').config();

// Create a server object
const server = express();

// Connect to the database using mongoose
// Note: make sure to put your connection string!
const connectionString = process.env.CONNECTION_STRING;
const connectionConfig = { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
};
mongoose
    .connect(connectionString, connectionConfig)
    .then(
        () => {
            console.log('(1) DB is connected')
        }
    )
    .catch(
        (error) => {
            console.log('error occured', error)
        }
    )


// Tell express how to use body-parser
server.use( bodyParser.urlencoded({ extended: false }) );

// Also tell express to recognize JSON
server.use( bodyParser.json() );

// Create a Route
server.get(
    '/',                                // http://localhost:3001/
    (req, res) => {
        res.send("<h1>Welcome to Home Page</h1>");
    }
);

server.use(
    '/product', //http://www.myapp.com/product/
    products
)

server.use(
    '/users', //http://www.myapp.com/users/
    users
)

server.listen(
    3001, 
    () => {
        console.log('(2) server is running on http://localhost:3001')
    }
);
