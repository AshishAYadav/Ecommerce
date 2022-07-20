const amqplib = require('amqplib');
const config = require('../config/config');
const { createUser, updateUser, deleteUser } = require('../controllers/broker.controller');
const { TYPE } = require('../models/broker.model');

let channel = null;
const QUEUE = config.rabbit.queue;

amqplib.connect(config.rabbit.url)
  .then(conn =>conn.createChannel())
  .then(ch => {
    ch.assertQueue(QUEUE)
      .then(() => {
        ch.consume(QUEUE, msg => {
            const { type } = JSON.parse(msg.toString());;

            switch(type){
                case TYPE.CREATE_USER:
                    createUser(msg);
                    break;
                case TYPE.UPDATE_USER:
                    updateUser(msg);
                    break;
                case TYPE.DELETE_USER:
                    deleteUser(msg);
                    break;
                default:
                    ch.ack(msg);
            }
          
            console.log('request: ', msg.properties.correlationId);

        });
      });
  });