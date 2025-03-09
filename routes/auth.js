const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

// Route to show login page
router.get('/', authMiddleware.redirectIfAuthenticated, authController.showLoginPage);

// Route to handle login
router.post('/login', authController.login);

// Route to handle logout
router.get('/logout', authMiddleware.isAuthenticated, authController.logout);

module.exports = router;