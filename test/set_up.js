const {app} = require('../server');
const chai = require('chai');
const chaiHttp = require('chai-http');
const {createFakeData} = require('./fake_data_generator');

chai.use(chaiHttp);

const requester = chai.request(app).keepOpen(); // non-login user
const agent1 = chai.request.agent(app); // login as user1
const agent2 = chai.request.agent(app); // login as user2

before(async () => {
    await createFakeData();
    await agent1.post('/login')
        .send({'email': 'user1@gmail.com', 'password': 'user1password'});
    await agent2.post('/login')
        .send({'email': 'user2@gmail.com', 'password': 'user2password'});
});

module.exports = {
    requester,
    agent1,
    agent2
};

