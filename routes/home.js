const express = require('express');
const router = express.Router();

const teamRouter = require('./team');
const blogRouter = require('./blog');
const authRouter = require('./auth');
const transactionRouter = require('./transaction');
const planRouter = require('./plan');
const userRouter = require('./user');

const verifyToken = require('../middleware/auth');
const contactController = require('../controllers/contactController');
const stripeController = require('../controllers/stripeController');
const notificationController = require('../controllers/notificationController');
const downloadController = require('../controllers/downloadController');
const transactionController = require('../controllers/transactionController');

// inner routes
router.use('/team', teamRouter);
router.use('/blog', blogRouter);
router.use('/auth', authRouter);
router.use('/transaction', verifyToken, transactionRouter);
router.use('/plan', verifyToken, planRouter);
router.use('/user', userRouter);

router.post('/contact', verifyToken, contactController.send);
router.post('/notification', verifyToken, notificationController.send);
router.post('/create-payment-intent', verifyToken, stripeController.send, transactionController.create);
router.get('/download', verifyToken, downloadController.send);

module.exports = router;
