const express = require('express');
const router = express.Router();
const ProductsModel = require('../models/ProductsModel.js');

router.get(
    '/',                 // http://www.myapp.com/product/
    (req, res) => {

        ProductsModel
        .find({ model: 'iPhone 11' })
        .then(
            (dbDocuments) => {
                res.send(dbDocuments)
            }
        )
        .catch(
            (error) => {
                console.log(error)
            }
        )

    }
);

router.post(
    '/',             // //http://www.myapp.com/product/
    (req, res) => {

        // Capture the data in the BODY section
        const formData = {
            brand: req.body.brand,
            model: req.body.model,
            price: req.body.price,
            warranty: req.body.warranty,
            origin: req.body.origin
        }

        // Instantiate an instance of the ProductsModel constructor
        const newProductModel = new ProductsModel(formData);

        // Using newProductModel object to save to the database 
        newProductModel
        .save()
        // If Promise resolves...
        .then(
            (dbDocument) => {
                res.send(dbDocument)
            }
        )
        // If Promise rejects...
        .catch(
            (error) => {
                console.log(error)
            }
        )
    }
);

router.post(
    '/update',
    (req, res) => {

        ProductsModel
        .findOneAndUpdate(
            {
                'model': req.body.model
            },
            {
                $set: {
                    price: req.body.price
                }
            }
        )
        .then(
            (dbDocument) => {
                res.send(dbDocument)
            }
        )
        .catch(
            (error) => {
                console.log(error)
            }
        )
    }
);


module.exports = router;
