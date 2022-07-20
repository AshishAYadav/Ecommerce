const catchAsync = require('../utils/catchAsync');
const { notificationService } = require('../services');

const createNotification = async (msg, ch) => {
  const { data } = JSON.parse(msg.content.toString());
  const notification = await notificationService.createNotification(data);
  ch.sendToQueue(msg.properties.replyTo, Buffer.from(JSON.stringify(notification)), {
    correlationId: msg.properties.correlationId
  });
  ch.ack(msg);
};

module.exports = {
  createNotification
};