const Item = require('../models/item_model');

const authenticate = async (req, res, next) => {
    let itemId = parseInt(req.params.id);
    let statusCode = 200;
    let message = '';

    if (!itemId) {
        statusCode = 400;
        message = 'item_id is wrong';
    } else {
        const userId = await Item.getItemUserId(itemId);
        if (!userId) {
            statusCode = 400;
            message = 'item_id is wrong';
        } else if (userId != req.user.id) {
            statusCode = 403;
            message = 'Not allowed';
        }
    }

    if (statusCode != 200) {
        res.status(statusCode).json(message);
    } else {
        next();
    }
};

/**
 * @api {get} api/v1/items/:id GetItem
 * @apiGroup Item
 * @apiVersion 0.1.0
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "id": 1,
 *       "order_id": 1,
 *       "product_id": 2,
 *       "number": 10,
 *       "created_at": "2019-10-30T14:09:44.000Z",
 *       "updated_at": "2019-10-30T14:09:44.000Z"
 *     }
 */
const getItem = async (req, res, next) => {
    const itemId = parseInt(req.params.id);

    try {
        const item = await Item.getItem(itemId);
        res.status(200).json(item);
    } catch(e) {
        next(e);
    }
};

/**
 * @api {patch} api/v1/items/:id UpdateItem
 * @apiGroup Item
 * @apiVersion 0.1.0
 *
 * @apiParam {Number} product_id
 * @apiParam {Number} number
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "id": 1,
 *       "order_id": 1,
 *       "product_id": 2,
 *       "number": 10,
 *       "created_at": "2019-10-30T14:09:44.000Z",
 *       "updated_at": "2019-10-30T14:09:44.000Z"
 *     }
 */
const updateItem = async (req, res, next) => {
    const itemId = parseInt(req.params.id);

    const update = req.body;
    if (!update) {
        res.status(400).end('Input data is wrong');
        return;
    }

    try {
        const newItem = await Item.updateItem(itemId, update);
        res.status(200).json(newItem);
    } catch(e) {
        next(e);
    }
};

/**
 * @api {delete} api/v1/items/:id DeleteItem
 * @apiGroup Item
 * @apiVersion 0.1.0
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 204 OK
 */
const deleteItem = async (req, res, next) => {
    const itemId = parseInt(req.params.id);

    try {
        await Item.deleteItem(itemId);
        res.status(204).end('');
    } catch(e) {
        next(e);
    }
};

module.exports = {
    authenticate,
    getItem,
    updateItem,
    deleteItem,
};