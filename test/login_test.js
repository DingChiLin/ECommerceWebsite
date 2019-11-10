const {expect} = require('chai');
const {requester} = require('./set_up');

describe('Home Page & Login', async () => {
    it('Can get home page', async () => {
        const res = await requester.get('/');
        expect(res).to.have.status(200);
    });

    it('Login with wrong password',async () => {
        const res = await requester
            .post('/login')
            .send({
                email: 'user1@gmail.com',
                password: 'wrong_password'
            });

        expect(res).to.have.status(401);
    });

    it('Login with correct password',async () => {
        // note: requester will not save the session after login success.
        const res = await requester
            .post('/login')
            .send({
                email: 'user1@gmail.com',
                password: 'user1password'
            });
        expect(res).to.have.status(200);
    });
});
