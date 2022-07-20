const config = require('../config/config');
const { notification } = require('../models');
const amqplib = require('amqplib');
const { TYPE } = require('../models/broker.model');

const NOTIFICATION_QUEUE = config.rabbit.notification;

function randomid() {
  return new Date().getTime().toString() + Math.random().toString() + Math.random().toString();
}

const reply = async (channel) => {
  return new Promise((resolve, reject) => {
    channel.consume('amq.rabbitmq.reply-to', msg => {
      console.log(msg.properties.correlationId, JSON.parse(msg.content.toString()))
      resolve({id: msg.properties.correlationId, data: JSON.parse(msg.content.toString())});
    }, {noAck: true});
  })
}

/**
 * Create a notification
 * @param {Object} notificationBody
 * @returns {Promise<User>}
 */
const createNotification = async (notification) => {

  let id = randomid();

  const connection = await amqplib.connect(config.rabbit.url);
  const channel = await connection.createChannel();

  console.log('sending to queue: ', NOTIFICATION_QUEUE);

  const responsePromise = reply(channel);
  await channel.assertQueue(NOTIFICATION_QUEUE);

  await channel.sendToQueue(NOTIFICATION_QUEUE, Buffer.from(JSON.stringify({
        type: TYPE.INSTANT_NOTIFICATION, 
        data: notification
    })), { 
    correlationId: id,
    replyTo: 'amq.rabbitmq.reply-to'
  });

  const response = await responsePromise;

  return response;
};

module.exports = {
    createNotification
};
