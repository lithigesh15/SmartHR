const express = require('express');
const router = express.Router();

// About page route - use root path since '/about' prefix is already defined
router.get('/', (req, res) => {
  res.render('team', { 
    title: 'Smart HR - About', 
    user: req.session.user || null  // Pass user if authenticated, else null
  });
});


module.exports = router;