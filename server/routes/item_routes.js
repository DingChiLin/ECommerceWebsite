const router = require('express').Router();

const {
    getItem,
    updateItem,
    deleteItem
} = require('../controllers/item_controller');

router.route('/items/:id')
    .get(getItem)
    .patch(updateItem)
    .delete(deleteItem);

module.exports = router;