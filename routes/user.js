const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const verifyToken = require('../middlewares/auth');

router.get('/get/:id', userController.getById);
router.put('/edit', verifyToken, userController.edit);

module.exports = router;
