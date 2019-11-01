const Product = require('../models/product_model');

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