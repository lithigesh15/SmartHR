const User = require('../models/user');

exports.showLoginPage = (req, res) => {
  res.render('login', { 
    title: 'Login - Smart HR',
    error: req.session.error || null
  });
  delete req.session.error;
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Validate input
    if (!username || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide username and password' 
      });
    }
    
    // Authenticate user
    const result = await User.authenticate(username, password);
    
    if (result.success) {
      // Store user in session
      req.session.user = result.user;
      return res.json({ success: true, message: 'Login successful' });
    } else {
      return res.status(401).json({ 
        success: false, 
        message: 'Incorrect username or password' 
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error. Please try again later.' 
    });
  }
};

exports.logout = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ success: false, message: 'Logout failed' });
    }
    res.redirect('/');
  });
};