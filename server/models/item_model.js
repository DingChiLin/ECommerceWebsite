const moment = require('moment');
const pg = require('./database');

const getItemUserId = async (itemId) => {
    const [item] = await pg('order_items')
        .select('orders.user_id')
        .innerJoin('orders', 'order_items.order_id', 'orders.id')
        .where('order_items.id', itemId);
    if (!item){ return; }
    return item.user_id;
};

const getItem = async (itemId) => {
    const [item] = await pg('order_items')
        .where({id: itemId});
    return item;
};

const updateItem = async (itemId, update) => {
    let now = moment().format();
    update.updated_at = now;

    const item = await pg('order_items')
        .where({id: itemId})
        .update(update)
        .returning('*');

    return item;
};

const deleteItem = async (itemId) => {
    await pg('order_items')
        .where({id: itemId})
        .delete();
    return;
};

module.exports = {
    getItemUserId,
    getItem,
    updateItem,
    deleteItem
};