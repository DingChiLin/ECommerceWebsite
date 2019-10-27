const _ = require('lodash');
const moment = require('moment');
const pg = require('knex')({
    client: 'pg',
    connection: process.env.DATABASE_URL
});

const getOrderUserId = async (order_id) => {
    const [order] = await pg("orders")
        .select("user_id")
        .where({id: order_id});
    if (!order){ return };
    return order.user_id;
}

const getOrder = async (order_id) => {
    const [order] = await pg('orders')
        .select()
        .where({
            id: order_id
        })
        .catch(e => {
            console.log(e);
            return [];
        });
    
    if(!order) {
        return null;
    }

    order["link"] = [
        { "rel":"items", "method":"get", "href":`/api/v1/orders/${order_id}/items` }
    ];

    return order;
}

const updateOrder = async (order_id, update, items) => {
    now = moment().format();
    update.updated_at = now;

    return pg.transaction(async (trx) => {
        const [new_order] = await pg('orders')
            .where({id: order_id})
            .update(update)
            .returning('*')
            .catch(e => {
                console.log(e);
                return [];
            });
        
        if (items) {
            await trx('order_items')
                .where({order_id})
                .delete();

            const order_items = items.map(obj => {
                obj.order_id = order_id
                obj.created_at = now;
                obj.updated_at = now;
                return obj;
            });

            await trx('order_items')
                .insert(order_items);
        }
        
        new_order["link"] = [
            { "rel":"items", "method":"get", "href":`/api/v1/orders/${order_id}/items` }
        ];

        return new_order;
    })

}

const deleteOrder = async (order_id) => {
    return pg('orders')
        .where({id: order_id})
        .delete();
}

const getOrderItems = async (order_id) => {
    return pg('order_items')
        .select()
        .where({
            order_id
        })
        .orderBy("id");
}

const createOrderItems = async (order_id, items) => {
    now = moment().format();
    order_items = items.map(item => {
        item.order_id = order_id;
        item.created_at = now;
        item.updated_at = now;
        return item;
    });

    return pg('order_items')
        .insert(order_items)
        .returning('*');
}

module.exports = {
    getOrderUserId,
    getOrder,
    updateOrder,
    deleteOrder,
    getOrderItems,
    createOrderItems,
}