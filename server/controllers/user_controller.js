const _ = require('lodash');
const User = require('../models/user_model');
const shortid = require('shortid');

const ORDER_STATUS = {
    "SUCCEEDED": 0,
    "PAID": 1,
    "FAILED": 2
}

const getUserOrders = async (req, res) => {
    const user_id = parseInt(req.params.id);
    if (!user_id) {
        res.status(400).end("user_id is wrong");
        return;
    }

    try {
        const orders = await User.getUserOrders(user_id);
        res.status(200).json(orders);
    } catch (e) {
        console.log(e);
        res.status(500).end("Internal Error");         
    }
};


const createUserOrder = async (req, res) => {
    if (!req || _.isEmpty(req.body) || _.isEmpty(req.params)) {
        return res.status(400).send('No data');
    }

    const user_id = parseInt(req.params.id);
    if (!user_id) {
        res.status(400).end("Input data is wrong");
        return;
    }

    const items = req.body.items
    if (!items || _.isEmpty(items)) {
        res.status(400).end("Input data is wrong");
        return;
    }

    const status = parseInt(req.body.status);
    const description = String(req.body.description, "");

    const order_number = shortid.generate();
    const order = {
        user_id: user_id,
        status: isNaN(status) ? ORDER_STATUS.SUCCEEDED : status,
        order_number: order_number,
        description: description
    };

    try {
        const new_order = await User.createUserOrder(order, items)
        res.location('api/v1/orders/' + new_order.order_id);
        res.status(201).json(new_order); 
    } catch (e) {
        console.log(e);
        res.status(400).end("Input data is wrong"); 
    }

};

const deleteUserOrders = async (req, res) => {
    user_id = parseInt(req.params.id);

    if (!user_id) {
        res.status(400).end("Input data is wrong");
        return;
    }

    try {
        await User.deleteUserOrders(user_id);
        res.status(204).end(""); 
    } catch (e) {
        console.log(e);
        res.status(500).end("Internal Error");
    }
};

module.exports = {
    getUserOrders,
    createUserOrder,
    deleteUserOrders
}