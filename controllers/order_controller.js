const _ = require('lodash');
const moment = require('moment');
const pg = require('knex')({
    client: 'pg',
    connection: process.env.DATABASE_URL
});

const getOrder = async (req, res) => {
    const order_id = parseInt(req.params.id);
    if (!order_id) {
        res.status(400).end("Input data is wrong");
        return;
    }

    const [order] = await pg('orders')
        .select()
        .where({
            id: order_id
        })
        .catch(e => {
            console.log(e);
            return []
        })
    
    if(!order) {
        res.status(404).end("NOT FOUND");
        return
    }

    order["link"] = [
        { "rel":"items", "method":"get", "href":`/api/v1/orders/${order_id}/items` }
    ];
    res.status(200).json(order)
};

const updateOrder = async (req, res) => {
    if (!req || _.isEmpty(req.body)) {
        return res.status(400).send('No data');
    }

    order_id = parseInt(req.params.id);

    if (!order_id) {
        res.status(400).end("Input data is wrong");
        return;
    }

    status = parseInt(req.body.status);
    description = req.body.description;

    now = moment().format();

    items = req.body.items;

    pg.transaction(async (trx) => {
        const [new_order] = await pg('orders')
            .where({id: order_id})
            .update({
                status: isNaN(status) ? undefined : status,
                description: description,
                updated_at: now
            })
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

        res.location('api/v1/orders/' + order_id);
        return new_order
    })
    .then(new_order => {
        res.status(200).json(new_order);
    })
    .catch(e => {
        console.log(e);
        res.status(400).end("Input data is wrong"); 
        return;
    });
};

const deleteOrder = (req, res) => {
    order_id = parseInt(req.params.id);

    if (!order_id) {
        res.status(400).end("Input data is wrong");
        return;
    }

    pg('orders')
        .where({id: order_id})
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

const getOrderItems = async (req, res) => {
    const order_id = parseInt(req.params.id);
    if (!order_id) {
        res.status(400).end("Input data is wrong");
        return;
    }    

   const order_items = await pg('order_items')
        .select()
        .where({
            order_id
        })
        .orderBy("id")
        .catch(e => {
            console.log(e);
            return []
        })
    
    res.status(200).json(order_items);
};

const createOrderItems = async (req, res) => {
    const order_id = parseInt(req.params.id);
    if (!order_id) {
        res.status(400).end("Input data is wrong");
        return;
    }

    const items = req.body
    if (!items) {
        res.status(400).end("Input data is wrong");
        return;
    }

    now = moment().format();
    items.order_id = order_id
    items.created_at = now;
    items.updated_at = now;

    const order_item = await pg('order_items')
        .insert(items)
        .returning('*')
        .catch(e => {
            console.log(e);
            res.status(400).end("Input data is wrong"); 
            return;
        });
    
    if(order_item) {
        res.status(201).json(order_item);
    }
};

module.exports = {
    getOrder,
    updateOrder,
    deleteOrder,
    getOrderItems,
    createOrderItems,
}