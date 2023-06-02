const express = require('express');
const router = express.Router();

const couponController = require('../controllers/couponController');
const verifyToken = require('../middlewares/auth');

router.get('/', verifyToken, couponController.get);
router.post('/', verifyToken, couponController.create);
router.put('/', verifyToken, couponController.edit);
router.delete('/', verifyToken, couponController.delete);

module.exports = router;
