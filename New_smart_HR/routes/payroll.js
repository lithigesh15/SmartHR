const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const payrollController = require('../controllers/payrollController');

// 📌 Main Payroll Dashboard
router.get('/', authMiddleware.isAuthenticated, payrollController.showPayrollHome);

// 📌 Salary Management
router.get('/salary', authMiddleware.isAuthenticated, payrollController.showSalaryPage);
router.get('/api/employee/:employeeId', authMiddleware.isAuthenticated, payrollController.getEmployeeDetails);
router.post('/api/calculate-salary', authMiddleware.isAuthenticated, payrollController.calculateSalary);
router.post('/api/update-payslip', authMiddleware.isAuthenticated, payrollController.updatePayslip);

// 📌 Pay Slip Management
router.get('/payslip', authMiddleware.isAuthenticated, payrollController.showPaySlipPage);

// Note: Removed some routes that were not implemented in the current controller

module.exports = router;