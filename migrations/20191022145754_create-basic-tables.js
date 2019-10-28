
exports.up = function(knex) {
    return knex.schema
        .createTable('users', function(table) {
            table.increments('id').primary();
            table.string('name').notNullable();
            table.string('email').notNullable();
            table.string('password').notNullable();
            table.boolean('confirmed');
            table.timestamp('created_at').notNullable();
            table.timestamp('updated_at').notNullable();
            table.index('email');
        })
        .createTable('products', function (table) {
            table.increments('id');
            table.string('name', 255).notNullable();
            table.integer('price').notNullable();
            table.string('description');
            table.string('image_url');
            table.string('small_image_url');
            table.timestamp('created_at').notNullable();
            table.timestamp('updated_at').notNullable();
            table.index('name');
        })
        .createTable('orders', function(table) {
            table.increments('id').primary();
            table.integer('user_id').references('id').inTable('users').notNull().onDelete('cascade');
            table.integer('status').notNullable();
            table.string('order_number').notNullable();
            table.string('description');
            table.timestamp('created_at').notNullable();
            table.timestamp('updated_at').notNullable();
            table.index('user_id');
        })
        .createTable('order_items', function(table) {
            table.increments('id').primary();
            table.integer('order_id').references('id').inTable('orders').notNull().onDelete('cascade');
            table.integer('product_id').references('id').inTable('products').notNull().onDelete('cascade');
            table.integer('number').notNullable();
            table.timestamp('created_at').notNullable();
            table.timestamp('updated_at').notNullable();
            table.index('order_id');
            table.index('product_id');
        });
};

exports.down = function(knex) {
    return knex.schema
        .dropTable('order_items')
        .dropTable('orders')
        .dropTable('products')
        .dropTable('users');
};