const express = require('express');
const router = express.Router();

const blogController = require('../controllers/blogController');
const verifyToken = require('../middlewares/auth');

router.get('/', verifyToken, blogController.getAll);
router.get('/:id', verifyToken, blogController.getByAuthor);
router.put('/', verifyToken, blogController.edit);
router.post('/', verifyToken, blogController.create);
router.delete('/', verifyToken, blogController.remove);

router.post('/post/', verifyToken, blogController.post.create);
router.put('/post/', verifyToken, blogController.post.edit);
router.delete('/post/', verifyToken, blogController.post.delete);

module.exports = router;
