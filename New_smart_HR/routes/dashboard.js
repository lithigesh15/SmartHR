const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

// Route to show dashboard (protected route)
router.get('/', authMiddleware.isAuthenticated, (req, res) => {
  res.render('dashboard', { 
    title: 'Dashboard - Smart HR',
    user: req.session.user
  });
});

module.exports = router;