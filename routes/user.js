const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const verifyToken = require('../middlewares/auth');

router.get('/private', verifyToken, userController.getPrivateData);
router.get('/:id', userController.getById);
router.put('/', verifyToken, userController.edit);

module.exports = router;
