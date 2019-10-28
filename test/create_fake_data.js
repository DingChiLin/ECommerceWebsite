require('dotenv').config();
const moment = require('moment');

var pg = require('knex')({
    client: 'pg',
    connection: process.env.DATABASE_URL
});

let raw_products = [
    {
        'name': 'google pixel 4',
        'price': 800,
        'description': 'Google Pixel',
        'image_url': 'images/google_pixel_4.jpeg',
        'small_image_url': 'small_images/google_pixel_4.jpeg',
    },
    {
        'name': 'iphone 11',
        'price': 880,
        'description': 'iPhone',
        'image_url': 'images/iphone_11.jpg',
        'small_image_url': 'small_images/iphone_11.jpg',
    },
    {
        'name': 'nokia 3310',
        'price': 150,
        'description': 'Nokia',
        'image_url': 'images/nokia_3310.jpg',
        'small_image_url': 'small_images/nokia_3310.jpg',
    },
    {
        'name': 'samsung galaxy s9',
        'price': 540,
        'description': 'Samsung galaxy',
        'image_url': 'images/samsung_galaxy_s9.jpg',
        'small_image_url': 'small_images/samsung_galaxy_s9.jpg',
    }
];

let raw_users = [
    {
        'name': 'user1',
        'email': 'user1@gmail.com',
        'password': '$2a$10$SCxYN7Je2pwVM7DcOippiObQ2nzUdjQCm3r2DiMAiEfyQU70SHcQu', //"user1password",
        'confirmed': true,
    },
    {
        'name': 'user2',
        'email': 'user2@gmail.com',
        'password': '$2a$10$hTO0NM4n4F1y5DKbl1C2s.JuBGommoQCA1nJlPu6QXCZ5loNLRjhu', //"user2password",
        'confirmed': true,
    },
    {
        'name': 'user3',
        'email': 'user3@gmail.com',
        'password': '$2a$10$6cz.Gvd4nP/CD0fXfdQ0/.Pkq7UDsOgYzRZoOVU4z4Zr/yd70sqV.', //"user3password",
        'confirmed': true,
    },
];

let now = moment().format();
const products = raw_products.map(obj => {
    obj.created_at = now;
    obj.updated_at = now;
    return obj;
});

const users = raw_users.map(obj => {
    obj.created_at = now;
    obj.updated_at = now;
    return obj;
});

async function createFakeData() {
    try {
        await pg.schema
            .raw('TRUNCATE TABLE products RESTART IDENTITY CASCADE')
            .raw('TRUNCATE TABLE users RESTART IDENTITY CASCADE');
        await pg('products').insert(products);
        await pg('users').insert(users);

    } catch (e) {
        console.log(e);
    } finally {
        pg.destroy();
    }
}

createFakeData().catch(console.log);