const { Kafka } = require('kafkajs');
const { TYPE } = require('../models/broker.model');

require('dotenv').config();

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

console.log(process.env.KAFKA_BOOTSTRAP_SERVER, sasl);

const producer = kafka.producer();

const send = async (notificationData) => {
  await producer.connect();
  const res = await producer.send({
    topic: process.env.KAFKA_TOPIC,
    messages: [{ value: Buffer.from(JSON.stringify({ type: TYPE.INSTANT_NOTIFICATION, data: notificationData })) }],
  });
  await producer.disconnect();
  console.log(res);
  return { reply: false, ...res };
};

module.exports = {
  sendToKafka: send,
};
