const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const offboardingController = require('../controllers/offboardingController');

// 📌 Get Offboarding Page
router.get('/', authMiddleware.isAuthenticated, offboardingController.getOffboardingPage);

// 📌 Add Offboarding Record
router.post('/add', authMiddleware.isAuthenticated, offboardingController.addOffboarding);

// 📌 Search Offboarded Employees
router.get('/search', authMiddleware.isAuthenticated, offboardingController.searchOffboarding);

module.exports = router;
