const router = require('express').Router()

const {
    getUserOrders,
    createUserOrders,
    deleteUserOrders
} = require('../controllers/user_controller')

router.route('/users/:id/orders')
    .get(getUserOrders)
    .post(createUserOrders)
    .delete(deleteUserOrders)

module.exports = router