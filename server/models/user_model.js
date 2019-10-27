const _ = require('lodash');
const moment = require('moment');
const pg = require('knex')({
    client: 'pg',
    connection: process.env.DATABASE_URL
});

const getUserOrders = async (user_id) => {
    const orders = await pg('orders')
        .select()
        .where({
            user_id: user_id
        })
        .orderBy("id")
        .catch(e => {
            console.log(e);
            return []
        });

    orders_with_items_link = orders.map(order => {
        order["link"] = [
            { "rel":"items", "method":"get", "href":`/api/v1/orders/${order.id}/items` }
        ];
        return order;
    })

    return orders_with_items_link;
}

const createUserOrder = async (order, items) => {
    now = moment().format();
    order.created_at = now;
    order.updated_at = now;

    return await pg.transaction(async (trx) => {
        const [new_order] = await trx('orders')
            .insert(order)
            .returning('*');

        if (items) {
            const order_items = items.map(obj => {
                obj.order_id = new_order.id
                obj.created_at = now;
                obj.updated_at = now;
                return obj;
            });

            await trx('order_items')
                .insert(order_items);
        }
        new_order["link"] = [
            { "rel":"items", "method":"get", "href":`/api/v1/orders/${new_order.id}/items` }
        ];

        return new_order;
    })
}

const deleteUserOrders = async (user_id) => {
    await pg('orders')
        .where({user_id})
        .delete();

    return;
}

module.exports = {
    getUserOrders,
    createUserOrder,
    deleteUserOrders
}