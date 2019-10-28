const pg = require('knex')({
    client: 'pg',
    connection: process.env.DATABASE_URL
});

const getProduct = async (product_id) => {
    return pg('products')
        .select(['id', 'name', 'price', 'description', 'image_url'])
        .where({
            id: product_id
        });
};

const getProducts = async (ids) => {
	if (ids){
		return pg('products')
			.whereIn('id', ids)
			.select(['id', 'name', 'price', 'small_image_url']);
	} else {
	    return pg('products')
			.select(['id', 'name', 'price', 'small_image_url']);
	}
};

module.exports = {
    getProduct,
    getProducts
};