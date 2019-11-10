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
const getProducts = async (req, res, next) => {
    try {
        const products = await Product.getProducts();
        res.status(200).json(products);
    } catch(e) {
        next(e);
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
const getProduct = async (req, res, next) => {
    const productId = parseInt(req.params.id);
    if (!productId) {
        res.status(400).end('id should be integer');
        return;
    }

    try {
        const product = await Product.getProduct(productId);
        res.status(200).json(product);
    } catch (e) {
        next(e);
    }
};

module.exports = {
    getProducts,
    getProduct
};