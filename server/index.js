require("dotenv").config();
const _ = require('lodash');
const express = require('express');
const fs = require('fs');
const moment = require('moment');
const morgan = require('morgan');
const path = require('path');
const port = process.env.PORT || 8000;
const pg = require('knex')({
    client: 'pg',
    connection: process.env.DATABASE_URL
});

const app = express();
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use(express.static('resources'));
app.use(morgan('default'));

console.log(__dirname)

app.set('json spaces', 2);

app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});

// TODO
// 1. use route, controller and model
// 2. use logger

// app.get('/',(req, res) => {
//     res.send('Hello World!!! YOYO');
// });

app.use('/api/v1', [
    require('./routes/product_routes'),
    require('./routes/user_routes'),
    require('./routes/order_routes'),
    require('./routes/item_routes')
])