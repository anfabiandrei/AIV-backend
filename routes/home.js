const express = require('express');
const router = express.Router();
const path = require('path');
const payment = require('../middlewares/payments');

const teamRouter = require('./team');
const blogRouter = require('./blog');
const authRouter = require('./auth');
const transactionRouter = require('./transaction');
const planRouter = require('./plan');
const userRouter = require('./user');
const couponRouter = require('./coupon');

const verifyToken = require('../middlewares/auth');
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
router.use('/coupon', couponRouter);

router.post('/contact', verifyToken, contactController.send);
router.post('/notification', verifyToken, transactionController.create, notificationController.send);
router.post('/create-payment-intent', stripeController.send);
router.post('/update-payment-intent', stripeController.update);
router.get('/download', payment.verifyPayment, downloadController.send);
router.get('/', (req, res) => res.sendFile(path.join(__dirname, '..', 'public', 'docs.html')));

module.exports = router;
