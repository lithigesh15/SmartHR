const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const trainingController = require('../controllers/trainingController');

// Main training programs page
router.get('/', authMiddleware.isAuthenticated, trainingController.getTrainingPrograms);

// Route to add a new course (protected by authentication)
router.post('/add-course', 
    authMiddleware.isAuthenticated, 
    trainingController.addCourse
);

// Route to enroll in a course (protected by authentication)
router.post('/enroll-course', 
    authMiddleware.isAuthenticated, 
    trainingController.enrollCourse
);

module.exports = router;