const pg = require('./database');

const getProduct = async (productId) => {
    const [product] = await pg('products')
        .select(['id', 'name', 'price', 'description', 'image_url'])
        .where({
            id: productId
        });
    return product;
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