// Import packages
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressFormData = require('express-form-data');
const cors = require('cors');
const cloudinary = require('cloudinary').v2;
const products = require('./routes/products.js');
const users = require('./routes/users.js');

// Import passport
const passport = require('passport');
// Import the strategies & way to extract the jsonwebtoken
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

// The same secret in routes/UsersRoutes will be needed
// to read the jsonwebtoken
const secret = process.env.SECRET;

// Options for passport-jwt
const passportJwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: secret
};

// This function is what will read the contents (payload) of the jsonwebtoken
const passportJwt = (passport) => {
    passport.use(
        new JwtStrategy(
            passportJwtOptions, 
            (jwtPayload, done) => {

                // Extract and find the user by their id (contained jwt)
                UsersModel.findOne({ _id: jwtPayload.id })
                .then(
                    // If the document was found
                    (document) => {
                        return done(null, document);
                    }
                )
                .catch(
                    // If something went wrong with database search
                    (err) => {
                        return done(null, null);
                    }
                )
            }
        )
    )
};

// Invoke passportJwt and pass the passport npm package as argument
passportJwt(passport);

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

// Configure for Cloudinary
cloudinary.config(
    {
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.API_KEY,
        api_secret: process.env.API_SECRET
    }
)

// Tell express to allow CORS (Cross-Origin Resource Sharing)
server.use(cors());    

// Tell express how to use body-parser
server.use( bodyParser.urlencoded({ extended: false }) );

// Also tell express to recognize JSON
server.use( bodyParser.json() );

// Also tell express to read HTTP form data
server.use(expressFormData.parse());

// Create a Route
server.get(
    '/',                                // http://localhost:3001/
    (req, res) => {
        res.send("<h1>Welcome to Home Page</h1>");
    }
);

server.use(
    '/product', //http://www.myapp.com/product/
    //passport.authenticate('jwt', {session:false}),
    products
)

server.use(
    '/users', //http://www.myapp.com/users/
    users
)

// Use Heroku port number if it exists otherwise use 3001
const port = process.env.PORT || 3001;
server.listen(
    port, 
    () => {
        console.log('(2) server is running on http://localhost:3001')
    }
);
