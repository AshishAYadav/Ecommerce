const config = require('../config/config');
const { sendToRabbitMQ } = require('./rabbit.service');
const { sendToKafka } = require('./kafka.service');

let createNotification = sendToRabbitMQ;

if (config.broker === 'kafka') {
  createNotification = sendToKafka;
}

module.exports = {
  createNotification,
};
