const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const recordsController = require('../controllers/recordsController');

// Employee Records Page
router.get('/', authMiddleware.isAuthenticated, recordsController.showEmployeeRecordsPage);

// Fetch Employee Details API
router.get('/employee/:employeeId', authMiddleware.isAuthenticated, recordsController.getEmployeeDetails);

module.exports = router;
