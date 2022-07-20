const amqplib = require('amqplib');
const config = require('../config/config');
const { saveToken } = require('../controllers/broker.controller');
const { TYPE } = require('../models/broker.model');

let channel = null;
const QUEUE = config.rabbit.queue;

function connect(){
  amqplib.connect(config.rabbit.url)
  .then(conn =>conn.createChannel())
  .then(ch => {
    ch.assertQueue(QUEUE)
      .then(() => {
        console.log('connected to rabbit queue: ', QUEUE);
        ch.consume(QUEUE, msg => {
            const { type } = JSON.parse(msg.content.toString());
            console.log(type);
            switch(type){
                case TYPE.SYNC_TOKEN:
                    saveToken(msg, ch);
                    break;
                default:
                    ch.ack(msg);
            }
          
            console.log('request: ', msg.properties.correlationId);

        }).then(out => {
          
        });
      });
  });
}

module.exports = {
  connect
}