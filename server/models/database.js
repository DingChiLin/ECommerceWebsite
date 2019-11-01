const env = process.env.NODE_ENV || 'development';
const knexfile = require('../../knexfile');
const pg = require('knex')(knexfile[env]);

module.exports = pg;