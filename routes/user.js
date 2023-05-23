const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');

router.get('/get/:id', userController.getById);
router.put('/edit', userController.edit);

module.exports = router;
