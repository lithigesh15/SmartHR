const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const dashboardController = require('../controllers/dashboardControllers'); // Import the dashboard controller

// Route to show dashboard with statistics (protected route)
router.get('/', authMiddleware.isAuthenticated, dashboardController.getDashboard);

module.exports = router;
