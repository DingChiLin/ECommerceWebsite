require('dotenv').config();
const _ = require('lodash');
const moment = require('moment');
const pg = require('../server/models/database');
const {rawProducts, rawUsers} = require('./fake_data');

let now = moment().format();
const products = _.cloneDeep(rawProducts).map(obj => {
    obj.created_at = now;
    obj.updated_at = now;
    return obj;
});

const users = _.cloneDeep(rawUsers).map(obj => {
    obj.created_at = now;
    obj.updated_at = now;
    return obj;
});

async function createFakeData() {
    await pg.schema
        .raw('TRUNCATE TABLE products RESTART IDENTITY CASCADE')
        .raw('TRUNCATE TABLE users RESTART IDENTITY CASCADE')
        .raw('TRUNCATE TABLE orders RESTART IDENTITY CASCADE')
        .raw('TRUNCATE TABLE order_items RESTART IDENTITY CASCADE');
    await pg('products').insert(products);
    await pg('users').insert(users);
}

async function finishConnection() {
    await pg.destroy();
}

// execute when called directly.
if (require.main === module) {
    pg.schema.raw('SELECT current_database()')
        .then(result => {
            console.log(`Create fake data in db: ${result.rows[0].current_database }`);
        })
        .then(createFakeData)
        .then(finishConnection)
        .catch(console.log);
}

module.exports = {
    finishConnection,
    createFakeData
};