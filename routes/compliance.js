const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const complianceController = require('../controllers/complianceController'); 

// 📌 Compliance Dashboard
router.get('/', authMiddleware.isAuthenticated, complianceController.getCompliancePage);

// 📌 Policy Repository Routes
router.get('/policy', authMiddleware.isAuthenticated, complianceController.getPolicyPage);
router.post('/policy', authMiddleware.isAuthenticated, complianceController.createPolicy);
router.delete('/policy/:id', authMiddleware.isAuthenticated, complianceController.deletePolicy);

// 📌 Compliance Notifications & Tracking
router.get('/notification', authMiddleware.isAuthenticated, complianceController.getNotificationsPage);
router.post('/notification/save', authMiddleware.isAuthenticated, complianceController.saveNotificationToTracking);
router.delete('/notification/:id', authMiddleware.isAuthenticated, complianceController.deleteNotification);

// ✅ Fix: Only ONE route for tracking update
router.post('/notification/update', authMiddleware.isAuthenticated, complianceController.updateTrackingStatus);

module.exports = router;
