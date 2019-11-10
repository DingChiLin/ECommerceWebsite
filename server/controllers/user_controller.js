const _ = require('lodash');
const User = require('../models/user_model');
const shortid = require('shortid');

const ORDER_STATUS = {
    'SUCCEEDED': 0,
    'PAID': 1,
    'FAILED': 2
};

const authenticate = async (req, res, next) => {
    let userId = parseInt(req.params.id);
    let statusCode = 200;
    let message = '';

    if (!userId) {
        statusCode = 400;
        message = 'user id is wrong';
    } else if (userId != req.user.id) {
        statusCode = 403;
        message = 'Not allowed';
    }

    if (statusCode != 200) {
        res.status(statusCode).json(message);
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
const getUserOrders = async (req, res, next) => {
    const userId = parseInt(req.params.id);

    try {
        const orders = await User.getUserOrders(userId);
        res.status(200).json(orders);
    } catch (e) {
        next(e);
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
const createUserOrder = async (req, res, next) => {
    const userId = parseInt(req.params.id);

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

    const orderNumber = shortid.generate();
    const order = {
        user_id: userId,
        status: isNaN(status) ? ORDER_STATUS.SUCCEEDED : status,
        order_number: orderNumber,
        description: description
    };

    try {
        const newOrder = await User.createUserOrder(order, items);
        res.location('api/v1/orders/' + newOrder.order_id);
        res.status(201).json(newOrder);
    } catch (e) {
        next(e);
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
const deleteUserOrders = async (req, res, next) => {
    const userId = parseInt(req.params.id);

    try {
        await User.deleteUserOrders(userId);
        res.status(204).end('');
    } catch (e) {
        next(e);
    }
};

module.exports = {
    authenticate,
    getUserOrders,
    createUserOrder,
    deleteUserOrders
};