require('dotenv').config();

module.exports = {
    development: {
        client: 'postgresql',
        connection: process.env.DATABASE_URL
    },
    test: {
        client: 'postgresql',
        connection: process.env.DATABASE_TEST_URL
    }
};