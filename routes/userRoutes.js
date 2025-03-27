const express = require('express');
const { registerUser, loginUser, getUserProfile, updateUserRole, getUserDetails, getUsersByRole } = require('../controllers/userController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/update-role', protect, authorize(['super_admin', 'enterprise_admin']), updateUserRole);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);
router.get('/user-details/:userId', protect, getUserDetails);
router.get('/users-by-role/:roleId', protect, getUsersByRole);

module.exports = router;
