const moment = require('moment');
const pg = require('./database');

const getItemUserId = async (item_id) => {
    const [item] = await pg('order_items')
        .select('orders.user_id')
        .innerJoin('orders', 'order_items.order_id', 'orders.id')
        .where('order_items.id', item_id);
    if (!item){ return; }
    return item.user_id;
};

const getItem = async (item_id) => {
    const [item] = await pg('order_items')
        .where({id: item_id});
    return item;
};

const updateItem = async (item_id, update) => {
    let now = moment().format();
    update.updated_at = now;

    const item = await pg('order_items')
        .where({id: item_id})
        .update(update)
        .returning('*');

    return item;
};

const deleteItem = async (item_id) => {
    await pg('order_items')
        .where({id: item_id})
        .delete();
    return;
};

module.exports = {
    getItemUserId,
    getItem,
    updateItem,
    deleteItem
};