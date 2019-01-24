var pubsubInstance = require('./pubSubHandle');

const projectId = 'speedy-baton-229407';

const topicName = 'ASIANCUP';


// pubsubInstance.createSubscription(topicName, 'sub_1').then(()=> {
    
// });

pubsubInstance.synchronousPullMessage(projectId, 'sub_1').then(()=> {

});