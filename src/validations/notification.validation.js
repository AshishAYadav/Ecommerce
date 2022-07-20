const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const sendNotification = {
  body: Joi.object().keys({
    to: Joi.string().required().email(),
    label: Joi.string().required().custom(password),
    data: Joi.string().required(),
    type: Joi.string().valid('instant', 'async', 'schedule'),
    sender: Joi.string(),
    status: Joi.string().required().valid('created', 'send', 'failed')
  }),
};

const getNotifications = {
  query: Joi.object().keys({
    label: Joi.string(),
    to: Joi.string(),
    status: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getNotification = {
  params: Joi.object().keys({
    notificationId: Joi.string().custom(objectId),
  }),
};

const deleteNotification = {
  params: Joi.object().keys({
    notificationId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  sendNotification,
  getNotifications,
  getNotification,
  deleteNotification
};
