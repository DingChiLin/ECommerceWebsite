const rawProducts = [
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

const rawUsers = [
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

const correctOrder = {
    description: 'correct order',
    status: 0,
    items: [
        {
            'product_id': 1,
            'number': 2,
        },
        {
            'product_id': 2,
            'number': 5,
        }
    ]
};

const orderWithWrongStatus = {
    description: 'order with wrong status',
    status: 'q'
};

const orderWithWrongItems = {
    description: 'order with wrong items',
    items: [
        {
            'product_id': 'a',
            'number': 2,
        }
    ]
};

module.exports = {
    rawProducts,
    rawUsers,
    correctOrder,
    orderWithWrongStatus,
    orderWithWrongItems
};