const express = require('express');
const router = express.Router();

const contactController      = require("../controllers/contactController");
const stripeController       = require("../controllers/stripeController");
const notificationController = require("../controllers/notificationController");
const downloadController = require("../controllers/downloadController");

router.post('/contact', contactController.send);
router.post('/notification', notificationController.send);
router.post('/create-payment-intent', stripeController.send);
router.get('/download', downloadController.send);

module.exports = router;
