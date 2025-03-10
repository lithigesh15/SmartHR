const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const performanceController = require('../controllers/performanceController'); 

// Performance Home Page
router.get('/', authMiddleware.isAuthenticated, performanceController.showPerformanceHome);

// Goal Management Routes
router.get('/goals', authMiddleware.isAuthenticated, performanceController.showGoalPage);
router.post('/goals', authMiddleware.isAuthenticated, performanceController.saveGoal);
router.get('/goals/all', authMiddleware.isAuthenticated, performanceController.getGoals);
router.put('/goals/status', authMiddleware.isAuthenticated, performanceController.updateGoalStatus);
router.delete('/goals/:goalId', authMiddleware.isAuthenticated, performanceController.deleteGoal);

// Goal Tracking
router.get('/goals/tracking', authMiddleware.isAuthenticated, performanceController.showGoalTrackingPage);

//Aprraisal
router.get('/appraisal', authMiddleware.isAuthenticated, performanceController.showAppraisalPage);
router.post('/appraisal', authMiddleware.isAuthenticated, performanceController.saveAppraisal);
router.get('/appraisal/all', authMiddleware.isAuthenticated, performanceController.getAppraisals);

//Appraisal Tracking
router.get('/appraisal_tracking', authMiddleware.isAuthenticated, performanceController.showAppraisalManagerPage);

module.exports = router;
