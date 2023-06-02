const { Schema, model } = require('mongoose');

const cart = new Schema({});

module.exports = model('cart', cart);
