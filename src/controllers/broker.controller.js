const catchAsync = require('../utils/catchAsync');
const { userService } = require('../services');

const createUser = catchAsync(async (msg) => {
  const { data } = msg;
  const user = await userService.createUser(data);
  ch.sendToQueue(msg.properties.replyTo, out, {
    correlationId: msg.properties.correlationId
  });
  ch.ack();
});

const updateUser = catchAsync(async (msg) => {
  const { data } = msg;
  const user = await userService.updateUserById(data.userId, data.body);
  ch.sendToQueue(msg.properties.replyTo, out, {
    correlationId: msg.properties.correlationId
  });
  ch.ack();
});

const deleteUser = catchAsync(async (msg) => {
  const { data } = msg;
  await userService.deleteUserById(data.userId);
  ch.sendToQueue(msg.properties.replyTo, out, {
    correlationId: msg.properties.correlationId
  });
  ch.ack();
});

module.exports = {
    createUser,
    updateUser,
    deleteUser,
};