const { tokenService } = require('../services');

const saveToken = async (msg, ch) => {
  const { data } = JSON.parse(msg.content.toString());;
  console.log(data);
  const { token, user, expires, type, blacklisted } = data;
  const id = await tokenService.saveToken(token, user, expires, type, blacklisted);
  ch.sendToQueue(msg.properties.replyTo, Buffer.from("ok"), {
    correlationId: msg.properties.correlationId
  });
  ch.ack(msg);
};

module.exports = {
    saveToken
};