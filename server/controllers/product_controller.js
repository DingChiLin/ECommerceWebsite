const Product = require('../models/product_model');

/**
 * @api {get} api/v1/products GetProducts
 * @apiGroup Product
 * @apiVersion 0.1.0
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *       {
 *         "id": 1, 
 *         "name": "google pixel",
 *         "price": 100,
 *         "small_image_url": '/resource/images/image.jpg' 
 *       }
 *     ]
 */
const getProducts = async (req, res) => {
    try {
        const products = await Product.getProducts();
        res.status(200).json(products);
    } catch(e) {
        console.log(e);
        res.status(404).end('NOT FOUND');
        return;
    }
};

/**
 * @api {get} api/v1/products/:id GetProduct
 * @apiGroup Product
 * @apiVersion 0.1.0
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "id": 1, 
 *       "name": "google pixel",
 *       "price": 100,
 *       "description": "first product",
 *       "image_url": '/resource/small_images/image.jpg' 
 *     }
 */
const getProduct = async (req, res) => {
    const product_id = parseInt(req.params.id);
    if (!product_id) {
        res.status(400).end('id should be integer');
        return;
    }

    try {
        const product = await Product.getProduct(product_id);
        res.status(200).json(product);
    } catch (e) {
        console.log(e);
        res.status(404).end('NOT FOUND');
        return;
    }
};

module.exports = {
    getProducts,
    getProduct
};