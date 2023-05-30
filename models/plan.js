const { Schema, model } = require('mongoose');

const plan = new Schema({
  title: {
    type: Schema.Types.String,
    required: true,
  },
  description: {
    type: Schema.Types.String,
    default: null
  },
  discount: {
    type: Schema.Types.Number,
    required: true,
  },
});

module.exports = model('plan', plan);
