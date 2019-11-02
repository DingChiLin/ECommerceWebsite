const Item = require('../models/item_model');

const authenticate = async (req, res, next) => {
    let item_id = parseInt(req.params.id);
    let status_code = 200;
    let message = '';

    if (!item_id) {
        status_code = 400;
        message = 'item_id is wrong';
    } else {
        const user_id = await Item.getItemUserId(item_id);
        if (!user_id) {
            status_code = 400;
            message = 'item_id is wrong';
        } else if (user_id != req.user.id) {
            status_code = 403;
            message = 'Not allowed';
        }
    }

    if (status_code != 200) {
        res.status(status_code).json(message);
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
const getItem = async (req, res) => {
    const item_id = parseInt(req.params.id);

    try {
        const item = await Item.getItem(item_id);
        res.status(200).json(item);
    } catch(e) {
        console.log(e);
        res.status(400).end('Input data is wrong');
        return;
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
const updateItem = async (req, res) => {
    const item_id = parseInt(req.params.id);

    const update = req.body;
    if (!update) {
        res.status(400).end('Input data is wrong');
        return;
    }

    try {
        const new_item = await Item.updateItem(item_id, update);
        res.status(200).json(new_item);
    } catch(e) {
        console.log(e);
        res.status(400).end('Input data is wrong');
        return;
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
const deleteItem = async (req, res) => {
    const item_id = parseInt(req.params.id);

    try {
        await Item.deleteItem(item_id);
        res.status(204).end('');
    } catch(e) {
        console.log(e);
        res.status(400).end('Input data is wrong');
        return;
    }
};

module.exports = {
    authenticate,
    getItem,
    updateItem,
    deleteItem,
};