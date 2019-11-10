const {finishConnection} = require('./fake_data_generator');
const {requester, agent1, agent2} = require('./set_up');

after(async () => {
    finishConnection();
    requester.close();
    agent1.close();
    agent2.close();
});