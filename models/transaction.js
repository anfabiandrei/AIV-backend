const { Schema, model } = require('mongoose');

const transaction = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    of: 'user',
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
  clientSecret: {
    type: Schema.Types.String,
    required: true,
  },
});

module.exports = model('transaction', transaction);
