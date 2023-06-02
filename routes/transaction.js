const express = require('express');
const router = express.Router();

const transactionController = require('../controllers/transactionController');

router.get('/get_by_id', transactionController.getByUser);
router.get('/get', transactionController.getByFilter);

module.exports = router;
