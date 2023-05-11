const express = require('express');
const router = express.Router();

const notificationController = require("../controllers/notificationController");

router.post('/notification', notificationController.send);

module.exports = router;
