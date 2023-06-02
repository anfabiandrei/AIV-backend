const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const verifyToken = require('../middlewares/auth');

router.post('/login', authController.login);
router.post('/register', authController.register, authController.login);
// change on put request
router.get('/email_submit', authController.submitEmail);
router.put('/email_request', verifyToken, authController.repeatEmailRequest);

module.exports = router;
