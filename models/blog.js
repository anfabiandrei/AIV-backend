const { Schema, model } = require('mongoose');

const blog = new Schema({
  title: {
    type: Schema.Types.String,
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  description: {
    type: Schema.Types.String,
    default: null,
  },
  image: {
    type: Schema.Types.String,
    default: null,
  },
  approved: {
    type: Schema.Types.Boolean,
    default: false,
  },
  createdAt: {
    type: Schema.Types.Date,
    default: new Date(),
  },
  updatedAt: {
    type: Schema.Types.Date,
    default: new Date(),
  },
});

module.exports = model('blog', blog);
