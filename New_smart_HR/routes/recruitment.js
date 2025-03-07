// routes/recruitment.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const recruitmentController = require('../controllers/recruitmentController');

// Main recruitment dashboard
router.get('/', authMiddleware.isAuthenticated, recruitmentController.getRecruitmentDashboard);


// Job Postings
router.get('/job-postings', authMiddleware.isAuthenticated, recruitmentController.getJobPostings);
router.post('/job-postings', authMiddleware.isAuthenticated, recruitmentController.createJobPosting);
router.put('/job-postings/:id', authMiddleware.isAuthenticated, recruitmentController.updateJobPosting);
router.delete('/job-postings/:id', authMiddleware.isAuthenticated, recruitmentController.deleteJobPosting);
router.get('/job-postings/:id', authMiddleware.isAuthenticated, recruitmentController.getJobById);



// Application Tracking
router.get('/application-tracking', authMiddleware.isAuthenticated, recruitmentController.getApplicationTracking);
router.get('/api/applicants', authMiddleware.isAuthenticated, recruitmentController.searchApplicants);


// Interview Scheduling
router.get('/interview-scheduling', authMiddleware.isAuthenticated, recruitmentController.getInterviewScheduling);
router.post('/interview-scheduling', authMiddleware.isAuthenticated, recruitmentController.scheduleInterview);
router.get('/interviews/search', authMiddleware.isAuthenticated, recruitmentController.searchInterviews);




// Onboarding
router.get('/onboarding', authMiddleware.isAuthenticated, recruitmentController.getOnboarding);
router.post('/api/onboard', authMiddleware.isAuthenticated, recruitmentController.onboardEmployee);

module.exports = router;