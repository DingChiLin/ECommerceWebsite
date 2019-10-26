const _ = require('lodash');
const Order = require('../models/order_model');

const getOrder = async (req, res) => {
    const order_id = parseInt(req.params.id);
    if (!order_id) {
        res.status(400).end("Input data is wrong");
        return;
    }

    try {
        const order = await Order.getOrder(order_id);
        if (!order) {
            res.status(404).end("NOT FOUND");
        } else {
            res.status(200).json(order)
        }
    } catch (e) {
        console.log(e);
        res.status(500).end("Internal Error");
    }
};

const updateOrder = async (req, res) => {
    if (!req || _.isEmpty(req.body)) {
        return res.status(400).send('No data');
    }

    order_id = parseInt(req.params.id);

    if (!order_id) {
        res.status(400).end("Input data is wrong");
        return;
    }

    status = parseInt(req.body.status);
    description = req.body.description;
    update = {
        status: isNaN(status) ? undefined : status,
        description: description,
    }

    items = req.body.items;

    try {
        const new_order = await Order.updateOrder(order_id, update, items);
        res.location('api/v1/orders/' + new_order.order_id);
        res.status(200).json(new_order);
    } catch(e) {
        console.log(e);
        res.status(400).end("Input data is wrong"); 
        return;
    };
};

const deleteOrder = async (req, res) => {
    order_id = parseInt(req.params.id);

    if (!order_id) {
        res.status(400).end("Input data is wrong");
        return;
    }

    try {
        await Order.deleteOrder(order_id);
        res.status(204).end(""); 
    } catch(e){
        console.log(e);
        res.status(400).end("Input data is wrong"); 
        return;
    }
};

const getOrderItems = async (req, res) => {
    const order_id = parseInt(req.params.id);
    if (!order_id) {
        res.status(400).end("Input data is wrong");
        return;
    }    
    try {
        const order_items = await Order.getOrderItems(order_id);
        res.status(200).json(order_items);
    } catch(e) {
        console.log(e);
        res.status(500).end("Internal Error");
    }
};

const createOrderItems = async (req, res) => {
    const order_id = parseInt(req.params.id);
    if (!order_id) {
        res.status(400).end("Input data is wrong");
        return;
    }

    const items = req.body
    if (!items) {
        res.status(400).end("Input data is wrong");
        return;
    }

    items.order_id = order_id

    try {
        const order_item = await Order.createOrderItems(items);
        res.status(201).json(order_item);
    } catch(e) {
        console.log(e);
        res.status(400).end("Input data is wrong"); 
        return;
    };
};

module.exports = {
    getOrder,
    updateOrder,
    deleteOrder,
    getOrderItems,
    createOrderItems,
}