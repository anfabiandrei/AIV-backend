const express = require('express');
const router = express.Router();

const transactionController = require('../controllers/transactionController');

router.get('/:id', transactionController.getByUser);
router.get('/', transactionController.getByFilter);

module.exports = router;
