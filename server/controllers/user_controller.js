const _ = require('lodash');
const User = require('../models/user_model');
const shortid = require('shortid');

const ORDER_STATUS = {
    'SUCCEEDED': 0,
    'PAID': 1,
    'FAILED': 2
};

const authenticate = async (req) => {
    let user_id = parseInt(req.params.id);
    let status_code = 200;
    let message = '';

    if (!req.isAuthenticated()) {
        status_code = 401;
        message = 'Not logged-in';
    } else if (!user_id) {
        status_code = 400;
        message = 'user_id is wrong';
    } else if (user_id != req.user.id) {
        status_code = 403;
        message = 'Not allowed';
    }

    return {
        user_id,
        status_code,
        message,
    };
};

const getUserOrders = async (req, res) => {
    const { user_id, status_code, message } = await authenticate(req);
    if (status_code != 200) {
        res.status(status_code).json(message);
        return;
    }

    try {
        const orders = await User.getUserOrders(user_id);
        res.status(200).json(orders);
    } catch (e) {
        console.log(e);
        res.status(500).end('Internal Error');
    }
};


const createUserOrder = async (req, res) => {
    const { user_id, status_code, message } = await authenticate(req);
    if (status_code != 200) {
        res.status(status_code).json(message);
        return;
    }

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

const deleteUserOrders = async (req, res) => {
    const { user_id, status_code, message } = await authenticate(req);
    if (status_code != 200) {
        res.status(status_code).json(message);
        return;
    }

    try {
        await User.deleteUserOrders(user_id);
        res.status(204).end('');
    } catch (e) {
        console.log(e);
        res.status(500).end('Internal Error');
    }
};

module.exports = {
    getUserOrders,
    createUserOrder,
    deleteUserOrders
};