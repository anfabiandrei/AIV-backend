const { Schema, model } = require('mongoose');

const team = new Schema({
  name: {
    type: Schema.Types.String,
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'user',
  },
  members: [
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true,
      },
      role: [Schema.Types.String],
      inviteTime: {
        type: Schema.Types.Date,
        default: new Date(),
      },
    },
  ],
  created_at: {
    type: Schema.Types.Date,
    default: new Date(),
  },
});

module.exports = model('team', team);
