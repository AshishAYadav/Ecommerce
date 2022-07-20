const config = require('../config/config');
const { User } = require('../models');
const amqplib = require('amqplib');
const { TYPE } = require('../models/broker.model');

let channel = null;
const QUEUES = config.rabbit.queue_list;

function randomid() {
  return new Date().getTime().toString() + Math.random().toString() + Math.random().toString();
}

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const syncToken = async (user) => {

  let id = randomid();

  channel = await amqplib.connect(config.rabbit.url)
  .then(conn => conn.createChannel());

  QUEUES.forEach(QUEUE => {
    channel.assertQueue(QUEUE)
    .then(() => channel.sendToQueue(QUEUE, Buffer.from(JSON.stringify({
         type: TYPE.CREATE_USER, 
         data: user
      })), { 
      correlationId: id,
      replyTo: 'amq.rabbitmq.reply-to'}));
  });
  
};

module.exports = {
    syncToken
};
