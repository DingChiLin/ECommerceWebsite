const router = require('express').Router();

const {
    authenticate,
    getOrder,
    updateOrder,
    deleteOrder,
    getOrderItems,
    createOrderItems
} = require('../controllers/order_controller');

router.use('/orders/:id', authenticate);

router.route('/orders/:id')
    .get(getOrder)
    .patch(updateOrder)
    .delete(deleteOrder);

router.route('/orders/:id/items')
    .get(getOrderItems)
    .post(createOrderItems);

module.exports = router;
