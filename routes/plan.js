const express = require('express');
const router  = express.Router();

const planController  = require('../controllers/planController');

router.get('/get', planController.get);
router.post('/create', planController.create);
router.put('/change_fields', planController.changeFields);

module.exports = router;
