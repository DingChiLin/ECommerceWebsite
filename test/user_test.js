const assert = require('assert');
const {expect} = require('chai');
const {
    requester,
    agent1
} = require('./set_up');
const {
    correctOrder,
    orderWithWrongStatus,
    orderWithWrongItems
} = require('./fake_data');

describe('User', async () => {
    it('Create orders before login', async () => {
        const res = await requester
            .post('/api/v1/users/1/orders')
            .send(correctOrder);
        expect(res).to.have.status(401);
    });

    it('Create orders with wrong input', async () => {
        const res1 = await agent1
            .post('/api/v1/users/1/orders')
            .send(orderWithWrongStatus);
        const res2 = await agent1
            .post('/api/v1/users/1/orders')
            .send(orderWithWrongItems);

        expect(res1).to.have.status(400);
        expect(res2).to.have.status(500);
    });

    it('Create orders, get orders and delete orders',async () => {
        // Create orders
        const newOrderRes = await agent1
            .post('/api/v1/users/1/orders')
            .send(correctOrder);
        const newOrder = newOrderRes.body;
        assert.strictEqual(newOrder.description, correctOrder.description);

        // Get orders after creating
        const getOrderRes = await agent1
            .get('/api/v1/users/1/orders');
        const orders = getOrderRes.body;

        const findOrder = orders.find((order) => {
            return order.id == newOrder.id;
        });
        assert.deepStrictEqual(findOrder, newOrder);

        // Delete orders
        const deleteOrderRes = await agent1
            .delete('/api/v1/users/1/orders');
        assert.strictEqual(deleteOrderRes.statusCode, 204);

        // Get orders after deleting
        const getOrderAgainRes = await agent1
            .get('/api/v1/users/1/orders');
        const ordersAfterDeleting = getOrderAgainRes.body;
        assert.strictEqual(ordersAfterDeleting.length, 0);
    });
});