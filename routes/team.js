const express = require('express');
const router = express.Router();

const teamController = require('../controllers/teamController');
const verifyToken = require('../middlewares/auth');

router.get('/get', teamController.get);
router.post('/create', verifyToken, teamController.create);
router.put('/add_member', verifyToken, teamController.addMember);
router.put('/change_roles', verifyToken, teamController.changeRoles);
router.delete('/remove_member', verifyToken, teamController.removeMember);

module.exports = router;
