const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const leaveController = require('../controllers/leaveController');

router.get('/', authMiddleware.isAuthenticated, leaveController.showLeavePage);

// 📌 Approval & Rejection
router.post('/requests/approve/:id', authMiddleware.isAuthenticated, leaveController.approveLeave);
router.post('/requests/reject/:id', authMiddleware.isAuthenticated, leaveController.rejectLeave);



module.exports = router;
