const {
  PubSub
} = require('@google-cloud/pubsub');
const pubsub = require('@google-cloud/pubsub');

const client = new pubsub.v1.SubscriberClient();


const projectId = 'speedy-baton-229407';


createSubscription = async (topicName, subscriptionName) => {
  console.log('createSubscription');
  const pubsub = new PubSub({
    projectId: projectId,

  });
  // Creates a new subscription
  await pubsub.topic(topicName).createSubscription(subscriptionName);
  console.log(`Subscription ${subscriptionName} created.`);
}

synchronousPullMessage = async (projectName, subscriptionName) => {

  pollMessage(projectName, subscriptionName);

  // const formattedSubscription = client.subscriptionPath(
  //   projectName,
  //   subscriptionName
  // );
  // const maxMessages = 1;
  // const newAckDeadlineSeconds = 30;
  // const request = {
  //   subscription: formattedSubscription,
  //   maxMessages: maxMessages,
  // };

  // let isProcessed = false;

  // const [response] = await client.pull(request);

  // const message = response.receivedMessages[0];

  // worker(message);

  // let waiting = true;
  // while (waiting) {
  //   await new Promise(r => setTimeout(r, 10000));
  //   // If the message has been processed..
  //   if (isProcessed) {
  //     const ackRequest = {
  //       subscription: formattedSubscription,
  //       ackIds: [message.ackId],
  //     };

  //     //..acknowledges the message.
  //     await client.acknowledge(ackRequest);
  //     console.log(`Acknowledged: "${message.message.data}".`);
  //     // Exit after the message is acknowledged.
  //     waiting = false;
  //     console.log(`Done.`);
  //   } else {
  //     // If the message is not yet processed..
  //     const modifyAckRequest = {
  //       subscription: formattedSubscription,
  //       ackIds: [message.ackId],
  //       ackDeadlineSeconds: newAckDeadlineSeconds,
  //     };

  //     //..reset its ack deadline.
  //     await client.modifyAckDeadline(modifyAckRequest);

  //     console.log(
  //       `Reset ack deadline for "${
  //           message.message.data
  //         }" for ${newAckDeadlineSeconds}s.`
  //     );
  //   }
  // }

}

pollMessage = async (projectName, subscriptionName) => {
  const formattedSubscription = client.subscriptionPath(
    projectName,
    subscriptionName
  );
  const maxMessages = 1;
  const newAckDeadlineSeconds = 30;
  const request = {
    subscription: formattedSubscription,
    maxMessages: maxMessages,
  };

  let isProcessed = false;

  const [response] = await client.pull(request);

  const message = response.receivedMessages[0];

  worker(message);
}

worker = (message) => {
  console.log(`Processing "${message.message.data}"...`);

  setTimeout(() => {
    console.log(`Finished procesing "${message.message.data}".`);
    pollMessage('speedy-baton-229407','sub_1');
  }, 30000);
}



module.exports = {
  createSubscription,
  synchronousPullMessage
}