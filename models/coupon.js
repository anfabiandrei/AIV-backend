const { Schema, model } = require('mongoose');

const coupon = new Schema({
  code: {
    type: Schema.Types.String,
    required: true,
  },
  discount: {
    type: Schema.Types.Number,
    required: true,
  },
  isActive: {
    type: Schema.Types.Boolean,
    default: true,
  },
});

module.exports = model('coupon', coupon);
