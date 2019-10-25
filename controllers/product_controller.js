const pg = require('knex')({
    client: 'pg',
    connection: process.env.DATABASE_URL
});

const getProducts = (req, res) => {
    pg('products')
        .select(["id", "name", "price", "small_image_url"])
        .then((products) => {
            res.status(200).json(products)
        })
        .catch(e => {
            console.log(e);
            res.status(404).end("NOT FOUND");
            return
        })
};

const getProduct = (req, res) => {
    product_id = parseInt(req.params.id);
    if (!product_id) {
        res.status(400).end("id should be integer");
        return;
    }
    pg('products')
        .select(["id", "name", "price", "description", "image_url"])
        .where({
            id: product_id
        })
        .then((product) => {
            res.status(200).json(product);
        })
        .catch(e => {
            console.log(e);
            res.status(404).end("NOT FOUND");
            return;
        });
};

module.exports = {
    getProducts,
    getProduct
}