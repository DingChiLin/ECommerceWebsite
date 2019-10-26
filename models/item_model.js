const moment = require('moment');
const pg = require('knex')({
    client: 'pg',
    connection: process.env.DATABASE_URL
});

const getItem = async (item_id) => {
    const [item] = await pg('order_items')
        .where({id: item_id})
    return item
}

const updateItem = async (item_id, update) => {
    now = moment().format();
    update.updated_at = now;

    const item = await pg('order_items')
        .where({id: item_id})
        .update(update)
        .returning('*')

    return item
}

const deleteItem = async (item_id) => {
    await pg('order_items')
        .where({id: item_id})
        .delete()
    return
}

module.exports = {
    getItem,
    updateItem,
    deleteItem
}