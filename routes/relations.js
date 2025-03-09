const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const relationsController = require('../controllers/relationsController.js'); 

// Relations Dashboard
router.get('/', authMiddleware.isAuthenticated, relationsController.getRelationsDashboard);

// Conflict Management Routes
router.get('/conflict-management', authMiddleware.isAuthenticated, relationsController.getConflictManagement);
router.post('/conflict-management', authMiddleware.isAuthenticated, relationsController.createConflict);
router.post('/conflict-management/update-status', authMiddleware.isAuthenticated, relationsController.updateConflictStatus);
router.delete('/conflict-management/:id', authMiddleware.isAuthenticated, relationsController.deleteConflict);

//engagement routes
router.get('/engagement-activities', authMiddleware.isAuthenticated, relationsController.getEngagementActivities);
router.post('/engagement-activities', authMiddleware.isAuthenticated, relationsController.createEngagementActivity);
router.put('/engagement-activities/:id', authMiddleware.isAuthenticated, relationsController.updateEngagementActivity);
router.delete('/engagement-activities/:id', authMiddleware.isAuthenticated, relationsController.deleteEngagementActivity);

// Surveys Routes
router.get('/surveys', authMiddleware.isAuthenticated, relationsController.getSurveys);
router.post('/surveys', authMiddleware.isAuthenticated, relationsController.createSurvey);
router.put('/surveys/:id', authMiddleware.isAuthenticated, relationsController.updateSurvey);
router.delete('/surveys/:id', authMiddleware.isAuthenticated, relationsController.deleteSurvey);

module.exports = router;