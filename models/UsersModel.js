// Import mongoose
const mongoose = require('mongoose');

const UsersSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true            
        },
        email: {
            type: String,
            required: true            
        },
        password: {
            type: String,
            required: true            
        },
        avatar: {
            type: String,      
        },
        dob: {
            type: String
        },
        phoneNumber: {
            type: String
        },
        address: {
            type: String
        },
        dateCreated: {
            type: Date,
            default: Date.now
        }
    }
);

const UsersModel = mongoose.model('users', UsersSchema);
module.exports = UsersModel;