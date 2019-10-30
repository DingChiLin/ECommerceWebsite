const router = require('express').Router();

const {
    authenticate,
    getUserOrders,
    createUserOrder,
    deleteUserOrders
} = require('../controllers/user_controller');

router.use('/users/:id', authenticate);

router.route('/users/:id/orders')
    .get(getUserOrders)
    .post(createUserOrder)
    .delete(deleteUserOrders);

module.exports = router;