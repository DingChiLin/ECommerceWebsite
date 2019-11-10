const assert = require('assert');
const {expect} = require('chai');
const {rawProducts} = require('./fake_data');

const {
    requester,
    agent1
} = require('./set_up');

describe('Product', async () => {
    it('Get products before login', async () => {
        const res = await requester.get('/api/v1/products');
        expect(res).to.have.status(401);
    });

    it('Get products after login', async () => {
        const res = await agent1.get('/api/v1/products');
        assert.strictEqual(res.body.length, rawProducts.length);
        assert.strictEqual(res.body[0].name, rawProducts[0].name);
    });

    it('Get one product by id',async () => {
        const productId = 2;
        const res = await agent1.get(`/api/v1/products/${productId}`);
        assert.strictEqual(res.body.name, rawProducts[productId-1].name);
    });
});