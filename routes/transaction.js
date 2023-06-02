const express = require('express');
const router = express.Router();

const transactionController  = require('../controllers/transactionController');

router.get('/get', transactionController.getByUser);

module.exports = router;
