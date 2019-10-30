const router = require('express').Router();

const {
    authenticate,
    getProducts,
    getProduct,
} = require('../controllers/product_controller');

router.use('/products', authenticate);

router.route('/products')
    .get(getProducts);

router.route('/products/:id')
    .get(getProduct);

module.exports = router;