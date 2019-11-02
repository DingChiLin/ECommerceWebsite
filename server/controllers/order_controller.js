const _ = require('lodash');
const Order = require('../models/order_model');
const Product = require('../models/product_model');

const authenticate = async (req, res, next) => {
    let order_id = parseInt(req.params.id);
    let status_code = 200;
    let message = '';

    if (!order_id) {
        status_code = 400;
        message = 'order_id is wrong';
    } else {
        const user_id = await Order.getOrderUserId(order_id);
        if (!user_id) {
            status_code = 400;
            message = 'order_id is wrong';
        } else if (user_id != req.user.id) {
            status_code = 403;
            message = 'Not allowed';
        }
    }

    if (status_code != 200){
        res.status(status_code).json(message);
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
const getOrder = async (req, res) => {
    const order_id = parseInt(req.params.id);

    try {
        const order = await Order.getOrder(order_id);
        if (!order) {
            res.status(404).end('NOT FOUND');
        } else {
            res.status(200).json(order);
        }
    } catch (e) {
        console.log(e);
        res.status(500).end('Internal Error');
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
const updateOrder = async (req, res) => {
    const order_id = parseInt(req.params.id);

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
        const new_order = await Order.updateOrder(order_id, update, items);
        res.location('api/v1/orders/' + new_order.order_id);
        res.status(200).json(new_order);
    } catch(e) {
        console.log(e);
        res.status(400).end('Input data is wrong');
        return;
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
const deleteOrder = async (req, res) => {
    const order_id = parseInt(req.params.id);

    try {
        await Order.deleteOrder(order_id);
        res.status(204).end('');
    } catch(e){
        console.log(e);
        res.status(400).end('Input data is wrong');
        return;
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
const getOrderItems = async (req, res) => {
    const order_id = parseInt(req.params.id);

    try {
        const order_items = await Order.getOrderItems(order_id);
        const product_ids = _.uniq(order_items.map(item => item.product_id));
        const products = await Product.getProducts(product_ids);
        const products_map = products.reduce((obj, prod) => {
            obj[prod.id] = prod;
            return obj;
        }, {});

        order_items.map(item => {
            item.product = products_map[item.product_id];
        });

        res.status(200).json(order_items);
    } catch(e) {
        console.log(e);
        res.status(500).end('Internal Error');
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

const createOrderItems = async (req, res) => {
    const order_id = parseInt(req.params.id);

    const items = req.body;
    if (!items) {
        res.status(400).end('Input data is wrong');
        return;
    }

    try {
        const order_item = await Order.createOrderItems(order_id, items);
        res.status(201).json(order_item);
    } catch(e) {
        console.log(e);
        res.status(400).end('Input data is wrong');
        return;
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