const express = require('express');
const router = express.Router();

// About page route - use root path since '/about' prefix is already defined
router.get('/', (req, res) => {
  res.render('about');
});

module.exports = router;