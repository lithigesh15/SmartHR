// routes/compliance.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware.isAuthenticated, (req, res) => {
  res.render('modules/compliance', {
    title: 'Compliance - Smart HR',
    user: req.session.user
  });
});

module.exports = router;