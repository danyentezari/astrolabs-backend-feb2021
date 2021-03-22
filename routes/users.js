const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs');
const cloudinary = require('cloudinary').v2;
const UsersModel = require('../models/UsersModel');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const secret = process.env.SECRET;

router.post(
    '/create',          // http://www.myapp.com/users/create
    (req, res) => {

        // 1) Capture user account details (e.g, first name, last name, etc.)
        const formData = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password,
            phoneNumber: req.body.phoneNumber,
            dob: req.body.dob,
            address: req.body.address
        };

        // 2) Create newUsersModel for saving the collection
        const newUsersModel = new UsersModel(formData)

        // 3) Check that no other document has the same email
        UsersModel
        .findOne({ email: formData.email })
        .then(
            async (dbDocument) => {
                // 3.1) If email exists
                if(dbDocument) {
                    // Then reject registration
                    res.send("Sorry. An account with thay email already exists");
                }
                // 3.2) If email does not exists
                else {

                    // 4a) Upload their picture if file(s) were sent
                    if( Object.values(req.files).length > 0 ) {
                        const files = Object.values(req.files);

                        // Image
                        await cloudinary.uploader.upload(
                            files[0].path,
                            (cloudinaryErr, cloudinaryResult) => {
                                if(cloudinaryErr) {
                                    console.log(cloudinaryErr)
                                }
                                // Add the URL of the picture to newUsersModel
                                newUsersModel.avatar = cloudinaryResult.url;
                            }
                        )
                    }

                    // 4) Generate a salt
                    bcryptjs.genSalt(
                        (err, theSalt) => {
                            // 5) With the salt and user's password, encrypt
                            bcryptjs.hash(
                                formData.password,
                                theSalt,
                                (err, theEncryption) => {
                                    // 6) Replace the password with the encryption
                                    newUsersModel.password = theEncryption;

                                    // 7) We will save user to collection
                                    newUsersModel
                                    .save()
                                    .then(
                                        (dbDocument) => {
                                            res.send("Account created successfully!")
                                        }
                                    )
                                    .catch(
                                        (error) => {
                                            console.log(error)
                                        }
                                    );
                                }
                            )     
                        }
                    )  
                }
            }
        )

    }
);

// /login
router.post(
    '/login',
    (req, res) => {

        // npm packages: passport, passport-jwt, jsonwebtoken

        // Step 1. Capture formData (email & password)
        const formData = {
            email: req.body.email,
            password: req.body.password
        }


        // Step 2a. In database, find account that matches email
        UsersModel.findOne(
            {email: formData.email},
            (err, document) => {

                // Step 2b. If email NOT match, reject the login request
                if(!document) {
                    res.json({message: "Please check email or password"});
                }

                // Step 3. If there's matching email, examine the document's password
                else {

                    // Step 4. Compare the encrypted password in db with incoming password
                    bcryptjs.compare(formData.password, document.password)
                    .then(
                        (isMatch) => {

                            // Step 5a. If the password matches, generate web token (JWT)
                            if(isMatch === true) {
                                // Step 6. Send the JWT to the client
                                const payload = { 
                                    id: document.id,
                                    email: document.email
                                };

                                jwt.sign(
                                    payload,
                                    secret,
                                    (err, jsonwebtoken) => {
                                        res.json(
                                            {
                                                message: 'Login successful',
                                                jsonwebtoken: jsonwebtoken
                                            }
                                        )
                                    }
                                )

                            }

                            // Step 5b. If password NOT match, reject login request
                            else {
                                res.json({message: "Please check email or password"})
                            }
                        }
                    )
                }
            }
        )
    }
)

module.exports = router;