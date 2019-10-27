const router = require('express').Router();

const {
    getUserOrders,
    createUserOrder,
    deleteUserOrders
} = require('../controllers/user_controller');

router.route('/users/:id/orders')
    .get(getUserOrders)
    .post(createUserOrder)
    .delete(deleteUserOrders);

module.exports = router;