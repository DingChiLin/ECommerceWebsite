const moment = require('moment');
const pg = require('./database');

const getUserByKey = async (key, value) => {
    const [user] = await pg('users')
        .where({[key]: value})
        .catch(e => {
            console.log(e);
            return [];
        });
    return user;
};

const getUserOrders = async (userId) => {
    const orders = await pg('orders')
        .select()
        .where({
            user_id: userId
        })
        .orderBy('id')
        .catch(e => {
            console.log(e);
            return [];
        });

    const ordersWithItemsLink = orders.map(order => {
        order['link'] = [
            { 'rel':'items', 'method':'get', 'href':`/api/v1/orders/${order.id}/items` }
        ];
        return order;
    });

    return ordersWithItemsLink;
};

const createUserOrder = async (order, items) => {
    const now = moment().format();
    order.created_at = now;
    order.updated_at = now;

    return await pg.transaction(async (trx) => {
        const [newOrder] = await trx('orders')
            .insert(order)
            .returning('*');

        if (items) {
            const orderItems = items.map(obj => {
                obj.order_id = newOrder.id;
                obj.created_at = now;
                obj.updated_at = now;
                return obj;
            });

            await trx('order_items')
                .insert(orderItems);
        }
        newOrder['link'] = [
            { 'rel':'items', 'method':'get', 'href':`/api/v1/orders/${newOrder.id}/items` }
        ];

        return newOrder;
    });
};

const deleteUserOrders = async (userId) => {
    await pg('orders')
        .where({user_id: userId})
        .delete();

    return;
};

module.exports = {
    getUserByKey,
    getUserOrders,
    createUserOrder,
    deleteUserOrders
};