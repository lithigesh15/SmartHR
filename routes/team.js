const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('team', { 
    title: 'Smart HR - About', 
    user: req.session.user || null  // Pass user if authenticated, else null
  });
});


module.exports = router;