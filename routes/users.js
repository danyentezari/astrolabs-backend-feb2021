const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs')
const UsersModel = require('../models/UsersModel');

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
            (dbDocument) => {
                // 3.1) If email exists
                if(dbDocument) {
                    // Then reject registration
                    res.send("Sorry. An account with thay email already exists");
                }
                // 3.2) If email does not exists
                else {
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

module.exports = router;