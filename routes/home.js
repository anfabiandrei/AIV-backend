const express = require('express');
const router = express.Router();
const payment = require('../middlewares/payments');

const contactController      = require("../controllers/contactController");
const stripeController       = require("../controllers/stripeController");
const notificationController = require("../controllers/notificationController");
const downloadController     = require("../controllers/downloadController");

router.post('/contact', contactController.send);
router.post('/notification', payment.verifyPayment, notificationController.send);
router.post('/create-payment-intent', stripeController.send);
router.post('/update-payment-intent', stripeController.update);
router.get('/download', payment.verifyPayment, downloadController.send);

module.exports = router;
