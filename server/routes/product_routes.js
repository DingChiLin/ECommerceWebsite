const router = require('express').Router();

const {
    getProducts,
    getProduct,
} = require('../controllers/product_controller');

router.route('/products')
    .get(getProducts);

router.route('/products/:id')
    .get(getProduct);

module.exports = router;