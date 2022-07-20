const amqplib = require('amqplib');
const config = require('../config/config');
const { TYPE } = require('../models/broker.model');

const QUEUE = config.rabbit.queue;

async function connect(){
  
  const connection = await amqplib.connect(config.rabbit.url);
  const channel = await connection.createChannel();

  await channel.assertQueue(QUEUE);

  console.log('connected to rabbit queue: ', QUEUE);

  const response = await channel.consume(QUEUE, msg => {
    const { type } = JSON.parse(msg.content.toString());
    console.log(type);
    switch(type){
        default:
            ch.ack(msg);
    }
    console.log('request: ', msg.properties.correlationId);
  })
}

module.exports = {
  connect
}