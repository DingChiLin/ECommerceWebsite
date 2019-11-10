const moment = require('moment');
const pg = require('./database');

const getOrderUserId = async (orderId) => {
    const [order] = await pg('orders')
        .select('user_id')
        .where({id: orderId});
    if (!order){ return; }
    return order.user_id;
};

const getOrder = async (orderId) => {
    const [order] = await pg('orders')
        .select()
        .where({
            id: orderId
        })
        .catch(e => {
            console.log(e);
            return [];
        });

    if(!order) {
        return null;
    }

    order['link'] = [
        { 'rel':'items', 'method':'get', 'href':`/api/v1/orders/${orderId}/items` }
    ];

    return order;
};

const updateOrder = async (orderId, update, items) => {
    const now = moment().format();
    update.updated_at = now;

    return pg.transaction(async (trx) => {
        const [newOrder] = await pg('orders')
            .where({id: orderId})
            .update(update)
            .returning('*')
            .catch(e => {
                console.log(e);
                return [];
            });

        if (items) {
            await trx('order_items')
                .where({orderId})
                .delete();

            const orderItems = items.map(obj => {
                obj.order_id = orderId;
                obj.created_at = now;
                obj.updated_at = now;
                return obj;
            });

            await trx('order_items')
                .insert(orderItems);
        }

        newOrder['link'] = [
            { 'rel':'items', 'method':'get', 'href':`/api/v1/orders/${orderId}/items` }
        ];

        return newOrder;
    });
};

const deleteOrder = async (orderId) => {
    return pg('orders')
        .where({id: orderId})
        .delete();
};

const getOrderItems = async (orderId) => {
    return pg('order_items')
        .select()
        .where({
            order_id: orderId
        })
        .orderBy('id');
};

const createOrderItems = async (orderId, items) => {
    const now = moment().format();
    const orderItems = items.map(item => {
        item.order_id = orderId;
        item.created_at = now;
        item.updated_at = now;
        return item;
    });

    return pg('order_items')
        .insert(orderItems)
        .returning('*');
};

module.exports = {
    getOrderUserId,
    getOrder,
    updateOrder,
    deleteOrder,
    getOrderItems,
    createOrderItems,
};