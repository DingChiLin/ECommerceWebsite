const assert = require('assert');
const {expect} = require('chai');
const {rawProducts} = require('./fake_data');
const {
    requester,
    agent1,
    agent2
} = require('./set_up');
const {correctOrder} = require('./fake_data');

let testOrderId;

describe('Order', async () => {

    before(async () => {
        const res = await agent1
            .post('/api/v1/users/1/orders')
            .send(correctOrder);
        testOrderId = res.body.id;
    });

    it('Get order before login', async () => {
        const res = await requester
            .get(`/api/v1/orders/${testOrderId}`);
        expect(res).to.have.status(401);
    });

    it('Get order after login', async () => {
        const getOrderRes = await agent1
            .get(`/api/v1/orders/${testOrderId}`);
        const order = getOrderRes.body;

        assert.strictEqual(order.description, correctOrder.description);
    });

    it('Get order after login with wrong user', async () => {
        const res = await agent2
            .get(`/api/v1/orders/${testOrderId}`);
        expect(res).to.have.status(403);
    });

    it('Update order', async () => {
        // Get order
        const getOrderRes = await agent1
            .get(`/api/v1/orders/${testOrderId}`);
        const order = getOrderRes.body;

        assert.strictEqual(order.status, 0);

        // Update order
        await agent1
            .patch(`/api/v1/orders/${testOrderId}`)
            .send({
                status: 1,
            });

        // Get order again
        const getUpdatedOrderRes = await agent1
            .get(`/api/v1/orders/${testOrderId}`);
        const updatedOrder = getUpdatedOrderRes.body;
        assert.strictEqual(updatedOrder.status, 1);
    });

    it('Get order items', async () => {
        const getOrderItemsRes = await agent1
            .get(`/api/v1/orders/${testOrderId}/items`);
        const orderItems = getOrderItemsRes.body;

        assert.strictEqual(orderItems.length, 2);
        assert.strictEqual(orderItems[0].product.name, rawProducts[0].name);
    });

    it('Create order items', async () => {
        // Get order items
        const getOrderItemsRes = await agent1
            .get(`/api/v1/orders/${testOrderId}/items`);
        const orderItems = getOrderItemsRes.body;

        assert.strictEqual(orderItems.length, 2);

        // Create one more item
        const newItems = [{
            product_id: 3,
            number: 99
        }];
        const res = await agent1
            .post(`/api/v1/orders/${testOrderId}/items`)
            .send(newItems);

        assert.strictEqual(res.body.product_id, newItems.product_id);

        // Get order items again
        const getNewOrderItemsRes = await agent1
            .get(`/api/v1/orders/${testOrderId}/items`);
        const newOrderItems = getNewOrderItemsRes.body;

        assert.strictEqual(newOrderItems.length, 3);
        assert.strictEqual(newOrderItems[2].product_id, newItems[0].product_id);
        assert.strictEqual(newOrderItems[2].number, newItems[0].number);
    });

    it('Delete order', async () => {
        // Get order
        const getOrderRes = await agent1
            .get(`/api/v1/orders/${testOrderId}`);
        expect(getOrderRes).to.have.status(200);

        // Delete order
        const deleteOrderRes = await agent1
            .delete(`/api/v1/orders/${testOrderId}`);
        expect(deleteOrderRes).to.have.status(204);

        // Get order after deleting
        const getOrderAfterDeletingRes = await agent1
            .get(`/api/v1/orders/${testOrderId}`);
        expect(getOrderAfterDeletingRes).to.have.status(400);
    });

    after(async () => {
        await agent1.delete('/api/v1/users/1/orders');
    });
});

