const Item = require('../models/item_model');

const getItem = async (req, res) => {
    item_id = parseInt(req.params.id);
    if (!item_id) {
        res.status(400).end("Input data is wrong");
        return;
    }

    try {
        const item = Item.getItem(item_id);
        res.status(200).json(item);
    } catch(e) {
        console.log(e);
        res.status(400).end("Input data is wrong");
        return;
    };
}

const updateItem = async (req, res) => {
    const item_id = parseInt(req.params.id);
    if (!item_id) {
        res.status(400).end("Input data is wrong");
        return;
    }

    const update = req.body;
    if (!update) {
        res.status(400).end("Input data is wrong");
        return;
    }

    try {
        const new_item = await Item.updateItem(item_id, update);
        res.status(200).json(new_item);
    } catch(e) {
        console.log(e);
        res.status(400).end("Input data is wrong"); 
        return;
    };
};

const deleteItem = async (req, res) => {
    item_id = parseInt(req.params.id);
    if (!item_id) {
        res.status(400).end("Input data is wrong");
        return;
    }

    try {
        await Item.deleteItem(item_id);
        res.status(204).end(""); 
    } catch {
        console.log(e);
        res.status(400).end("Input data is wrong"); 
        return;
    }
};

module.exports = {
    getItem,
    updateItem,
    deleteItem,
}