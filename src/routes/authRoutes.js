const express = require('express');
const { userController } = require('../controllers');

const router = express.Router();

// Public routes
router.post('/register', userController.register);
router.post('/register-agent', userController.registerAgent);
router.post('/login', userController.login);
router.post('/admin-login', userController.adminLogin);
router.post('/request-otp', userController.requestOTP);
router.post('/verify-otp', userController.verifyOTP);

module.exports = router;
