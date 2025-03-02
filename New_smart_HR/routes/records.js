
// routes/records.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware.isAuthenticated, (req, res) => {
  res.render('modules/records', {
    title: 'Employee Records - Smart HR',
    user: req.session.user
  });
});

module.exports = router;