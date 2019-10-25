require("dotenv").config();
const _ = require('lodash');
const express = require('express');
const moment = require('moment');

const port = process.env.PORT || 8000;
const pg = require('knex')({
    client: 'pg',
    connection: process.env.DATABASE_URL
});
const STATUS = {
    "SUCCEEDED": 0,
    "PAID": 1,
    "FAILED": 2
}

const app = express();
app.use(express.urlencoded({
    extended: true
}));
app.use(express.static('resources'));
app.use(express.json());

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

/*
INPUT FORMAT
{
	"user_id": 1,
	"products": 2
	[
		{
			"product_id": 2,
			"number": 5
        }
	]
}
*/



// app.post(`/api/v1/products`, (req, res) => {
//     if (!req || _.isEmpty(req.body)) {
//         return res.status(400).send('Products are required');
//     }

//     now = moment().format();
//     const products = req.body.map(obj => {
//         obj.created_at = now;
//         obj.updated_at = now;
//         return obj;
//     });

//     pg('products')
//         .insert(products)
//         .then(result => {
//             res.status(200).send(`Insert ${result.rowCount} products succeeded!`);
//         })
//         .catch(e => {
//             console.log(e);
//             res.status(400).end("Input data is wrong");
//             return           
//         });
    
// });

