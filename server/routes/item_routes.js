const router = require('express').Router();

const {
    authenticate,
    getItem,
    updateItem,
    deleteItem
} = require('../controllers/item_controller');

router.use('/items/:id', authenticate);

router.route('/items/:id')
    .get(getItem)
    .patch(updateItem)
    .delete(deleteItem);

module.exports = router;