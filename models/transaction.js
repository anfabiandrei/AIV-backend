const { Schema, model } = require('mongoose');

const transaction = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  plans: {
    type: [Schema.Types.String],
    default: [],
  },
  amount: {
    type: Schema.Types.Number,
    required: true,
  },
  currency: {
    type: Schema.Types.String,
    required: true,
  },
  purchaseTime: {
    type: Schema.Types.Date,
    default: new Date(),
  },
  stripeId: {
    type: Schema.Types.String,
    required: true,
  },
  clientSecret: {
    type: Schema.Types.String,
    required: true,
  },
  couponId: {
    type: Schema.Types.ObjectId,
    ref: 'coupon',
    default: null,
  },
  amountWithoutDiscount: {
    type: Schema.Types.Number,
    default: false,
  },
});

module.exports = model('transaction', transaction);
