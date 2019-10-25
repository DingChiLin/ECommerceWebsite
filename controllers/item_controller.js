const _ = require('lodash');
const moment = require('moment');
const pg = require('knex')({
    client: 'pg',
    connection: process.env.DATABASE_URL
});

const getItem = (req, res) => {
    item_id = parseInt(req.params.id);
    if (!item_id) {
        res.status(400).end("Input data is wrong");
        return;
    }
    pg('order_items')
        .where({id: item_id})
        .then(([order_item]) => {
            res.status(200).json(order_item);
        })
        .catch(e => {
            console.log(e);
            res.status(400).end("Input data is wrong");
            return;
        });
}

const updateItem = async (req, res) => {
    const item_id = parseInt(req.params.id);
    if (!item_id) {
        res.status(400).end("Input data is wrong");
        return;
    }

    const item = req.body;
    if (!item) {
        res.status(400).end("Input data is wrong");
        return;
    }

    now = moment().format();
    item.updated_at = now;

    const order_item = await pg('order_items')
        .where({id: item_id})
        .update(item)
        .returning('*')
        .catch(e => {
            console.log(e);
            res.status(400).end("Input data is wrong"); 
            return;
        });
    
    if(order_item) {
        res.status(200).json(order_item);
    }
};

const deleteItem = (req, res) => {
    item_id = parseInt(req.params.id);
    if (!item_id) {
        res.status(400).end("Input data is wrong");
        return;
    }

    pg('order_items')
        .where({id: item_id})
        .delete()
        .then(() => {
            res.status(204).end(""); 
        })
        .catch(e => {
            console.log(e);
            res.status(400).end("Input data is wrong"); 
            return;
        });
};

module.exports = {
    getItem,
    updateItem,
    deleteItem,
}