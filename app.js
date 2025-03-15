const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const cors = require('cors');
const db = require('./config/db'); 



// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const recruitmentRoutes = require('./routes/recruitment');
const relationsRoutes = require('./routes/relations');
const payrollRoutes = require('./routes/payroll');
const trainingRoutes = require('./routes/training');
const performanceRoutes = require('./routes/performance');
const recordsRoutes = require('./routes/records');
const complianceRoutes = require('./routes/compliance');
const leaveRoutes = require('./routes/leave');
const offboardingRoutes = require('./routes/offboarding');
const aboutRoutes = require('./routes/about');
const teamRoutes = require('./routes/team');

// Initialize app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET || 'smart-hr-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 } // 24 hours
}));

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', authRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/recruitment', recruitmentRoutes);
app.use('/relations', relationsRoutes);
app.use('/payroll', payrollRoutes);
app.use('/training', trainingRoutes);
app.use('/performance', performanceRoutes);
app.use('/records', recordsRoutes);
app.use('/compliance', complianceRoutes);
app.use('/leave', leaveRoutes);
app.use('/offboarding', offboardingRoutes);
app.use('/about', aboutRoutes); 
app.use('/team', teamRoutes); 

// Error handler for 404
app.use((req, res, next) => {
  res.status(404).render('error', {
    title: '404 - Page Not Found',
    message: 'The page you requested could not be found.',
    error: {}
  });
});

// General error handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  const statusCode = err.status || 500;
  res.status(statusCode).render('error', {
    title: `${statusCode} - Error`,
    message: err.message || 'An unexpected error occurred',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// Start server with database connection verification
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
