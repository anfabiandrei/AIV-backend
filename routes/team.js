const express = require('express');
const router = express.Router();

const teamController = require('../controllers/teamController');
const verifyToken = require('../middlewares/auth');

router.get('/', teamController.get);
router.post('/', verifyToken, teamController.create);
router.post('/members', verifyToken, teamController.addMember);
router.put('/members', verifyToken, teamController.changeRoles);
router.delete('/members', verifyToken, teamController.removeMember);
router.delete('/', verifyToken, teamController.delete);

module.exports = router;
