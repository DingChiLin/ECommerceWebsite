require("dotenv").config();
const moment = require('moment');
const port = process.env.PORT || 8000;

var pg = require('knex')({
    client: 'pg',
    connection: process.env.DATABASE_URL
});

raw_products = [
    {
        "name": "google pixel 4",
        "price": 800,
        "description": "Google Pixel",
        "image_url": "images/google_pixel_4.jpeg",
        "small_image_url": "small_images/google_pixel_4.jpeg",
    },
    {
        "name": "iphone 11",
        "price": 880,
        "description": "iPhone",
        "image_url": "images/iphone_11.jpg",
        "small_image_url": "small_images/iphone_11.jpg",
    },
    {
        "name": "nokia 3310",
        "price": 150,
        "description": "Nokia",
        "image_url": "images/nokia_3310.jpg",
        "small_image_url": "small_images/nokia_3310.jpg",
    },
    {
        "name": "samsung galaxy s9",
        "price": 540,
        "description": "Samsung galaxy",
        "image_url": "images/samsung_galaxy_s9.jpg",
        "small_image_url": "small_images/samsung_galaxy_s9.jpg",
    }
]

raw_users = [
    {
        "name": "user1",
        "email": "user1@gmail.com",
    },
    {
        "name": "user2",
        "email": "user2@gmail.com",
    },
    {
        "name": "user3",
        "email": "user3@gmail.com",
    },
]

// const request = require('request')
// 
// function createProducts(){
//     return new Promise((resolve, reject) => {
//         request.post(`http://localhost:${port}/api/v1/products`, {
//             json: products
//         }, (error, res, body) => {
//             if (error) {
//                 reject(error)
//             }
//             resolve(body)
//         })
//     })
// }

now = moment().format(); // Can mock this for unit test
const products = raw_products.map(obj => {
    obj.created_at = now;
    obj.updated_at = now;
    return obj;
})

const users = raw_users.map(obj => {
    obj.created_at = now;
    obj.updated_at = now;
    return obj;    
})

async function createFakeData(){
    try {
        const truncate_result = await pg.schema
            .raw('TRUNCATE TABLE products RESTART IDENTITY CASCADE')
            .raw('TRUNCATE TABLE users RESTART IDENTITY CASCADE');
        const insert_product_result = await pg('products').insert(products);
        const insert_user_result = await pg('users').insert(users);

    } catch(e) {
        console.log(e);
    } finally {
        pg.destroy();
    }
}

createFakeData().catch(console.log);