const amqplib = require('amqplib');
const config = require('../config/config');
const { User } = require('../models');
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
  const id = randomid();

  amqplib
    .connect(config.rabbit.url)
    .then((conn) => conn.createChannel())
    .then((ch) => {
      channel = ch;

      // this queue is a "Direct reply-to" read more at the docs
      // When some msg comes in, we "emit" a message to the proper "correlationId" listener
      ch.consume('amq.rabbitmq.reply-to', (msg) => console.log(msg.properties.correlationId, msg.content), { noAck: true });

      QUEUES.forEach((QUEUE) => {
        channel.assertQueue(QUEUE).then(() => {
          console.log('pushing message to queue: ', QUEUE);
          channel.sendToQueue(
            QUEUE,
            Buffer.from(
              JSON.stringify({
                type: TYPE.SYNC_TOKEN,
                data: user,
              })
            ),
            {
              correlationId: id,
              replyTo: 'amq.rabbitmq.reply-to',
            }
          );
        });
      });
    });
};

module.exports = {
  syncToken,
};
