const express = require('express');
const router = express.Router();

const planController = require('../controllers/planController');

router.get('/', planController.get);
router.post('/', planController.create);
router.put('/', planController.changeFields);

module.exports = router;
