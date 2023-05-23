const express = require('express');
const router = express.Router();

const blogController   = require('../controllers/blogController');
const verifyToken      = require('../middleware/auth');

router.get('/get', verifyToken, blogController.getAll);
router.get('/get/:id', verifyToken, blogController.getById);
router.post('/create', verifyToken, blogController.create);
router.delete('/remove', verifyToken, blogController.remove)

module.exports = router;
