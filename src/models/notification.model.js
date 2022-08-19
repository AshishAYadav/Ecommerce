const mongoose = require('mongoose');
const validator = require('validator');
const { toJSON, paginate } = require('./plugins');
const { roles } = require('../config/roles');
const config = require('../config/config');

const notificationTypes = ['instant', 'scheduled', 'async'];

const notificationSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: false,
      trim: true,
    },
    to: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      },
    },
    data: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      validate(value) {
        if (value.length > 1024) {
          throw new Error('Data must not be greater than 1024 chars');
        }
      },
    },
    type: {
      type: String,
      enum: notificationTypes,
      default: 'instant',
    },
    sender: {
      type: String,
      default: config.email.sender,
    },
    status: {
      type: String,
      default: 'created',
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
notificationSchema.plugin(toJSON);
notificationSchema.plugin(paginate);

/**
 * @typedef Notification
 */
const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
