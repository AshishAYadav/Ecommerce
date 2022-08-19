const { Kafka } = require('kafkajs');
const config = require('../config/config');

const { createNotification } = require('../controllers/broker.controller');
const { TYPE } = require('../models/broker.model');

async function connect() {
  // console.log(process.env.host);

  const { KAFKA_USERNAME: username, KAFKA_PASSWORD: password } = process.env;
  const sasl = username && password ? { username, password, mechanism: 'plain' } : null;
  const ssl = !!sasl;

  // This creates a client instance that is configured to connect to the Kafka broker provided by
  // the environment variable KAFKA_BOOTSTRAP_SERVER
  const kafka = new Kafka({
    clientId: process.env.KAFKA_CLIENT_ID,
    brokers: [process.env.KAFKA_BOOTSTRAP_SERVER],
    ssl,
    sasl,
  });

  const consumer = kafka.consumer({ groupId: process.env.KAFKA_GROUP_ID });

  await consumer.connect();

  await consumer.subscribe({ topic: process.env.KAFKA_TOPIC, fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const { type } = message.value.toString();
      //   console.log('recevied message: ', message.value.toString());
      const msg = { content: message.value };
      switch (type) {
        case TYPE.ASYNC_NOTIFICATION:
          createNotification(msg, null);
          break;
        default:
          createNotification(msg, null);
      }
      // console.log('request: ', message.properties.correlationId);
      //   console.log(msg);
    },
  });
}

module.exports = {
  connectKafka: connect,
};
