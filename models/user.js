const { Schema, model } = require('mongoose');

const user = new Schema({
  email: {
    type: Schema.Types.String,
    required: true,
  },
  firstName: {
    type: Schema.Types.String,
    required: true,
  },
  lastName: {
    type: Schema.Types.String,
    required: true,
  },
  nickname: {
    type: Schema.Types.String,
    required: false,
    default: null,
  },
  password: {
    type: Schema.Types.String,
    required: true,
  },
  createdAt: {
    type: Schema.Types.Date,
    required: true,
  },
  approved: {
    type: Schema.Types.Boolean,
    default: false,
  },
  emailSubmits: [
    {
      code: {
        type: Schema.Types.String,
        required: true,
      },
      evt: {
        type: Schema.Types.Date,
        required: true,
      },
    },
  ],
});

module.exports = model('user', user);
