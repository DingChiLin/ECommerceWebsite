const _ = require('lodash');
const Order = require('../models/order_model');
const Product = require('../models/product_model');

const authenticate = async (req) => {
    let order_id = parseInt(req.params.id);
    let status_code = 200;
    let message = '';

    if (!req.isAuthenticated()) {
        status_code = 401;
        message = 'Not logged-in';
    } else if (!order_id) {
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

    return {
        order_id,
        status_code,
        message,
    };
};

const getOrder = async (req, res) => {
    const {order_id, status_code, message} = await authenticate(req);
    if (status_code != 200){
        res.status(status_code).json(message);
        return;
    }

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

const updateOrder = async (req, res) => {
    const {order_id, status_code, message} = await authenticate(req);
    if (status_code != 200){
        res.status(status_code).json(message);
        return;
    }

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

const deleteOrder = async (req, res) => {
    const {order_id, status_code, message} = await authenticate(req);
    if (status_code != 200){
        res.status(status_code).json(message);
        return;
    }

    try {
        await Order.deleteOrder(order_id);
        res.status(204).end('');
    } catch(e){
        console.log(e);
        res.status(400).end('Input data is wrong');
        return;
    }
};

const getOrderItems = async (req, res) => {
    const {order_id, status_code, message} = await authenticate(req);
    if (status_code != 200){
        res.status(status_code).json(message);
        return;
    }

    try {
        const order_items = await Order.getOrderItems(order_id);
        const product_ids = _.uniq(order_items.map(item => item.product_id));
        const products = await Product.getProducts(product_ids);
        const products_map = _.groupBy(products, prod => prod.id);

        order_items.map(item => {
            item.product = products_map[item.product_id];
        });

        res.status(200).json(order_items);
    } catch(e) {
        console.log(e);
        res.status(500).end('Internal Error');
    }
};

const createOrderItems = async (req, res) => {
    const {order_id, status_code, message} = await authenticate(req);
    if (status_code != 200){
        res.status(status_code).json(message);
        return;
    }

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
    getOrder,
    updateOrder,
    deleteOrder,
    getOrderItems,
    createOrderItems,
};