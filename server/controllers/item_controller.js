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