const _ = require('lodash');
const moment = require('moment');
const shortid = require('shortid');
const pg = require('knex')({
    client: 'pg',
    connection: process.env.DATABASE_URL
});

const getUserOrders = async (req, res) => {
    const user_id = parseInt(req.params.id);
    if (!user_id) {
        res.status(400).end("user_id is wrong");
        return;
    }
    const orders = await pg('orders')
        .select()
        .where({
            user_id: user_id
        })
        .orderBy("id")
        .catch(e => {
            console.log(e);
            return []
        })

    orders_with_items_link = orders.map(order => {
        order["link"] = [
            { "rel":"items", "method":"get", "href":`/api/v1/orders/${order.id}/items` }
        ];
        return order;
    })
    res.status(200).json(orders_with_items_link)
};


const createUserOrders = (req, res) => {
    /**
     * Input validation
     */
    if (!req || _.isEmpty(req.body) || _.isEmpty(req.params)) {
        return res.status(400).send('No data');
    }

    const user_id = parseInt(req.params.id);
    if (!user_id) {
        res.status(400).end("Input data is wrong");
        return;
    }

    const items = req.body.items
    if (!items || _.isEmpty(items)) {
        res.status(400).end("Input data is wrong");
        return;
    }

    const status = parseInt(req.body.status);
    const description = String(req.body.description, "");

    const order_number = shortid.generate();
    now = moment().format();
    const order = {
        user_id: user_id,
        status: isNaN(status) ? STATUS.SUCCEEDED : status,
        order_number: order_number,
        description: description,
        created_at: now,
        updated_at: now
    };

    /**
     * Start Transaction
     */
    pg.transaction(async (trx) => {
        const [order_id] = await trx('orders')
            .insert(order)
            .returning('id');

        if (items) {
            const order_items = items.map(obj => {
                obj.order_id = order_id
                obj.created_at = now;
                obj.updated_at = now;
                return obj;
            });

            await trx('order_items')
                .insert(order_items);
        }

        order["link"] = [
            { "rel":"items", "method":"get", "href":`/api/v1/orders/${order_id}/items` }
        ];

        order["id"] = order_id;
        res.location('api/v1/orders/' + order_id);
        return order
    })
    .then(order => {
        res.status(201).json(order);
    })
    .catch(e => {
        console.log(e);
        res.status(400).end("Input data is wrong"); 
        return;
    });
};

const deleteUserOrders = async (req, res) => {
    user_id = parseInt(req.params.id);

    if (!user_id) {
        res.status(400).end("Input data is wrong");
        return;
    }

    pg('orders')
        .where({user_id})
        .delete()
        .then(() => {
            res.status(204).end(""); 
        })
        .catch(e => {
            console.log(e);
            res.status(400).end("Input data is wrong"); 
            return;
        })
};

module.exports = {
    getUserOrders,
    createUserOrders,
    deleteUserOrders
}