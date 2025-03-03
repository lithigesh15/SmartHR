const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const payrollController = require('../controllers/payrollController');

// Main payroll dashboard
router.get('/', authMiddleware.isAuthenticated, payrollController.showPayrollHome);

// Salary Management
router.get('/salary', authMiddleware.isAuthenticated, payrollController.showSalaryPage);
router.post('/api/calculate-salary', authMiddleware.isAuthenticated, payrollController.calculateSalary);

// Tax Management
router.get('/tax', authMiddleware.isAuthenticated, payrollController.showTaxPage);
router.post('/api/calculate-tax', authMiddleware.isAuthenticated, payrollController.calculateTax);

// Bonus & Incentives
router.get('/bonus', authMiddleware.isAuthenticated, payrollController.showBonusPage);
router.post('/api/calculate-bonus', authMiddleware.isAuthenticated, payrollController.calculateBonus);

// Pay Slip
router.get('/payslip', authMiddleware.isAuthenticated, payrollController.showPaySlipPage);
router.get('/api/payslips', authMiddleware.isAuthenticated, payrollController.getPayslipData);

// Payroll Management APIs
router.put('/api/payroll', authMiddleware.isAuthenticated, payrollController.updatePayroll);
router.delete('/api/payroll/:id', authMiddleware.isAuthenticated, payrollController.deletePayroll);

// Payroll Reports
router.get('/api/reports', authMiddleware.isAuthenticated, payrollController.generatePayrollReport);

module.exports = router;