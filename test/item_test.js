const assert = require('assert');
const {expect} = require('chai');
const {
    requester,
    agent1,
    agent2
} = require('./set_up');
const {
    correctOrder
} = require('./fake_data');

let testItemId;

describe('Item', async () => {
    before(async () => {
        const orderRes = await agent1
            .post('/api/v1/users/1/orders')
            .send(correctOrder);
        const testOrderId = orderRes.body.id;
        const itemRes = await agent1
            .get(`/api/v1/orders/${testOrderId}/items`);
        testItemId = itemRes.body[0].id;
    });

    it('Get items before login', async () => {
        const res = await requester
            .get(`/api/v1/items/${testItemId}`);
        expect(res).to.have.status(401);
    });

    it('Get items after login', async () => {
        const res = await agent1
            .get(`/api/v1/items/${testItemId}`);
        expect(res).to.have.status(200);
        assert.strictEqual(res.body.product_id, correctOrder.items[0].product_id);
    });

    it('Get items after login with wrong user', async () => {
        const res = await agent2
            .get(`/api/v1/items/${testItemId}`);
        expect(res).to.have.status(403);
    });

    it('Update items', async () => {
        // Get item
        const getItemRes = await agent1
            .get(`/api/v1/items/${testItemId}`);
        const item = getItemRes.body;
        assert.strictEqual(item.number, correctOrder.items[0].number);

        // Update item
        const updateItemRes = await agent1
            .patch(`/api/v1/items/${testItemId}`)
            .send({
                number: 100,
            });
        expect(updateItemRes).to.have.status(200);

        // Get item after updating
        const getItemAfterUpdatingRes = await agent1
            .get(`/api/v1/items/${testItemId}`);
        const itemAfterUpdating = getItemAfterUpdatingRes.body;
        assert.strictEqual(itemAfterUpdating.number, 100);
    });

    it('Delete items',async () => {
        // Get item
        const getItemRes = await agent1
            .get(`/api/v1/items/${testItemId}`);
        expect(getItemRes).to.have.status(200);

        // Delete item
        const deleteItemRes = await agent1
            .delete(`/api/v1/items/${testItemId}`);
        expect(deleteItemRes).to.have.status(204);

        // Get item after deleting
        const getItemAfterDeletingRes = await agent1
            .get(`/api/v1/items/${testItemId}`);
        expect(getItemAfterDeletingRes).to.have.status(400);
    });

    after(async () => {
        await agent1.delete('/api/v1/users/1/orders');
    });
});