const _ = require('lodash');
const User = require('../models/user_model');
const shortid = require('shortid');

const ORDER_STATUS = {
    'SUCCEEDED': 0,
    'PAID': 1,
    'FAILED': 2
};

const authenticate = async (req, res, next) => {
    let user_id = parseInt(req.params.id);
    let status_code = 200;
    let message = '';

    if (!user_id) {
        status_code = 400;
        message = 'user_id is wrong';
    } else if (user_id != req.user.id) {
        status_code = 403;
        message = 'Not allowed';
    }

    if (status_code != 200) {
        res.status(status_code).json(message);
    } else {
        next();
    }
};

/**
 * @api {get} api/v1/users/:id/orders GetUserOrders
 * @apiGroup User
 * @apiVersion 0.1.0
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *       {
 *         "id": 1,
 *         "user_id": 1,
 *         "status": 0,
 *         "order_number": "1SLbpt5b",
 *         "description": "my order",
 *         "created_at": "2019-10-30T14:13:52.000Z",
 *         "updated_at": "2019-10-30T14:13:52.000Z",
 *         "link": [
 *           {
 *             "rel": "items",
 *             "method": "get",
 *             "href": "/api/v1/orders/1/items"
 *           }
 *         ]
 *       }
 *     ]
 */
const getUserOrders = async (req, res) => {
    const user_id = parseInt(req.params.id);

    try {
        const orders = await User.getUserOrders(user_id);
        res.status(200).json(orders);
    } catch (e) {
        console.log(e);
        res.status(500).end('Internal Error');
    }
};

/**
 * @api {post} api/v1/users/:id/orders CreateUserOrder
 * @apiGroup User
 * @apiVersion 0.1.0
 * 
 * @apiParam {Number} [status]
 * @apiParam {String} [description]
 *
 * @apiParam {Object[]} items
 * @apiParam {Number} items[product_id]
 * @apiParam {Number} items[number]
 * 
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 201 OK
 *     {
 *       "id": 1,
 *       "user_id": 1,
 *       "status": 0,
 *       "order_number": "1SLbpt5b",
 *       "description": "a new order",
 *       "created_at": "2019-10-30T14:13:52.000Z",
 *       "updated_at": "2019-10-30T14:13:52.000Z",
 *       "link": [
 *         {
 *           "rel": "items",
 *           "method": "get",
 *           "href": "/api/v1/orders/1/items"
 *         }
 *       ]
 *    }
 */
const createUserOrder = async (req, res) => {
    const user_id = parseInt(req.params.id);

    if (!req || _.isEmpty(req.body) || _.isEmpty(req.params)) {
        return res.status(400).send('No data');
    }

    const items = req.body.items;
    if (!items || _.isEmpty(items)) {
        res.status(400).end('Input data is wrong');
        return;
    }

    const status = parseInt(req.body.status);
    const description = String(req.body.description || '');

    const order_number = shortid.generate();
    const order = {
        user_id: user_id,
        status: isNaN(status) ? ORDER_STATUS.SUCCEEDED : status,
        order_number: order_number,
        description: description
    };

    try {
        const new_order = await User.createUserOrder(order, items);
        res.location('api/v1/orders/' + new_order.order_id);
        res.status(201).json(new_order);
    } catch (e) {
        console.log(e);
        res.status(400).end('Input data is wrong');
    }

};

/**
 * @api {delete} api/v1/users/:id/orders DeleteUserOrders
 * @apiGroup User
 * @apiVersion 0.1.0
 * 
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 204 OK
 */
const deleteUserOrders = async (req, res) => {
    const user_id = parseInt(req.params.id);

    try {
        await User.deleteUserOrders(user_id);
        res.status(204).end('');
    } catch (e) {
        console.log(e);
        res.status(500).end('Internal Error');
    }
};

module.exports = {
    authenticate,
    getUserOrders,
    createUserOrder,
    deleteUserOrders
};