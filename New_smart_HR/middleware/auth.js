// Middleware to check if user is authenticated
exports.isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    return next();
  }
  
  req.session.error = 'Please log in to access this page';
  res.redirect('/');
};

// Middleware to redirect to dashboard if user is already authenticated
exports.redirectIfAuthenticated = (req, res, next) => {
  if (req.session.user) {
    return res.redirect('/dashboard');
  }
  
  next();
};