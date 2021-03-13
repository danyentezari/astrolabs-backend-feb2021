// Import mongoose
const mongoose = require('mongoose');

// Schema
const ProductsSchema = new mongoose.Schema(
    {
        brand: {
            type: String,
            required: true
        },
        model: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        origin: {
            type: String
        },
        warranty: {
            type: Boolean
        }
    }
)

// Model
const ProductsModel = mongoose.model('products', ProductsSchema);

module.exports = ProductsModel;