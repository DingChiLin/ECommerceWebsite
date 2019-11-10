const _ = require('lodash');
const Order = require('../models/order_model');
const Product = require('../models/product_model');

const authenticate = async (req, res, next) => {
    let orderId = parseInt(req.params.id);
    let statusCode = 200;
    let message = '';

    if (!orderId) {
        statusCode = 400;
        message = 'order id is wrong';
    } else {
        const userId = await Order.getOrderUserId(orderId);
        if (!userId) {
            statusCode = 400;
            message = 'order id is wrong';
        } else if (userId != req.user.id) {
            statusCode = 403;
            message = 'Not allowed';
        }
    }

    if (statusCode != 200){
        res.status(statusCode).json(message);
    } else {
        next();
    }
};

/**
 * @api {get} api/v1/orders/:id GetOrder
 * @apiGroup Order
 * @apiVersion 0.1.0
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
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
const getOrder = async (req, res, next) => {
    const orderId = parseInt(req.params.id);

    try {
        const order = await Order.getOrder(orderId);
        if (!order) {
            res.status(404).end('NOT FOUND');
        } else {
            res.status(200).json(order);
        }
    } catch (e) {
        next(e);
    }
};

/**
 * @api {patch} api/v1/orders/:id UpdateOrder
 * @apiGroup Order
 * @apiVersion 0.1.0
 *
 * @apiParam {Number} [status]
 * @apiParam {String} [description]
 *
 * @apiParam {Object[]} [items]
 * @apiParam {Number} items[product_id]
 * @apiParam {Number} items[number]
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
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
const updateOrder = async (req, res, next) => {
    const orderId = parseInt(req.params.id);

    if (!req || _.isEmpty(req.body)) {
        return res.status(400).send('No data');
    }

    let status = parseInt(req.body.status);
    let description = req.body.description;
    let update = {
        status: isNaN(status) ? undefined : status,
        description: description,
    };

    let items = req.body.items;

    try {
        const newOrder = await Order.updateOrder(orderId, update, items);
        res.location('api/v1/orders/' + newOrder.order_id);
        res.status(200).json(newOrder);
    } catch(e) {
        next(e);
    }
};

/**
 * @api {delete} api/v1/orders/:id DeleteOrder
 * @apiGroup Order
 * @apiVersion 0.1.0
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 204 OK
 */
const deleteOrder = async (req, res, next) => {
    const orderId = parseInt(req.params.id);

    try {
        await Order.deleteOrder(orderId);
        res.status(204).end('');
    } catch(e){
        next(e);
    }
};

/**
 * @api {get} api/v1/orders/:id/items GetOrderItems
 * @apiGroup Order
 * @apiVersion 0.1.0
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *       {
 *         "id": 1,
 *         "order_id": 1,
 *         "product_id": 2,
 *         "number": 10,
 *         "created_at": "2019-10-30T14:09:44.000Z",
 *         "updated_at": "2019-10-30T14:09:44.000Z",
 *         "product": {
 *           "id": 2,
 *           "name": "iphone 11",
 *           "price": 880,
 *           "small_image_url": "small_images/iphone_11.jpg"
 *         }
 *       }
 *     ]
 */
const getOrderItems = async (req, res, next) => {
    const orderId = parseInt(req.params.id);

    try {
        const orderItems = await Order.getOrderItems(orderId);
        const productIds = _.uniq(orderItems.map(item => item.product_id));
        const products = await Product.getProducts(productIds);
        const productsMap = products.reduce((obj, prod) => {
            obj[prod.id] = prod;
            return obj;
        }, {});

        orderItems.map(item => {
            item.product = productsMap[item.product_id];
        });

        res.status(200).json(orderItems);
    } catch(e) {
        next(e);
    }
};

/**
 * @api {post} api/v1/orders/:id/items CreateOrderItems
 * @apiGroup Order
 * @apiVersion 0.1.0
 *
 * @apiParam {Object[]} items
 * @apiParam {Number} items[product_id]
 * @apiParam {Number} items[number]
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 201 OK
 *     [
 *       {
 *         "id": 1,
 *         "order_id": 1,
 *         "product_id": 2,
 *         "number": 10,
 *         "created_at": "2019-10-30T14:09:44.000Z",
 *         "updated_at": "2019-10-30T14:09:44.000Z",
 *       }
 *     ]
 */

const createOrderItems = async (req, res, next) => {
    const orderId = parseInt(req.params.id);

    const items = req.body;
    if (!items) {
        res.status(400).end('Input data is wrong');
        return;
    }

    try {
        const orderItem = await Order.createOrderItems(orderId, items);
        res.status(201).json(orderItem);
    } catch(e) {
        next(e);
    }
};

module.exports = {
    authenticate,
    getOrder,
    updateOrder,
    deleteOrder,
    getOrderItems,
    createOrderItems,
};