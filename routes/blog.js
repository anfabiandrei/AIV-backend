const express = require('express');
const router = express.Router();

const blogController = require('../controllers/blogController');
const verifyToken = require('../middlewares/auth');

router.get('/get', verifyToken, blogController.getAll);
router.get('/get/:id', verifyToken, blogController.getById);
router.put('/edit', verifyToken, blogController.edit);
router.post('/create', verifyToken, blogController.create);
router.delete('/remove', verifyToken, blogController.remove);

router.post('/post/create', verifyToken, blogController.post.create);
router.put('/post/edit', verifyToken, blogController.post.edit);
router.delete('/post/delete', verifyToken, blogController.post.delete);

module.exports = router;
