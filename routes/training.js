const express = require('express');
const router = express.Router();
const trainingController = require('../controllers/trainingController');
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware.isAuthenticated, trainingController.getTrainingPrograms);
router.post('/add-course', authMiddleware.isAuthenticated, trainingController.addCourse);
router.delete('/delete-course/:courseId', authMiddleware.isAuthenticated, trainingController.deleteCourse);

module.exports = router;
