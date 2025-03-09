const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const payrollController = require('../controllers/payrollController');

// 📌 Payroll Dashboard
router.get('/', authMiddleware.isAuthenticated, payrollController.showPayrollHome);

// 📌 Salary Management
router.get('/salary', authMiddleware.isAuthenticated, payrollController.showSalaryPage);
router.get('/api/employee/:employeeId', authMiddleware.isAuthenticated, payrollController.getEmployeeDetails);
router.post('/api/calculate-salary', authMiddleware.isAuthenticated, payrollController.calculateSalary);
router.post('/api/update-payslip', authMiddleware.isAuthenticated, payrollController.updatePayslip);

// 📌 Pay Slip Management
router.get('/payslip', authMiddleware.isAuthenticated, payrollController.showPaySlipPage);

// 📌 Bonus Update (✅ FIXED: Added this route to load the page)
router.get('/bonus', authMiddleware.isAuthenticated, payrollController.showBonusPage);

// 📌 Update Bonus in Payroll Table (✅ FIXED: Matches frontend request)
router.post('/api/update-bonus', authMiddleware.isAuthenticated, payrollController.updateBonus);

router.get('/tax', authMiddleware.isAuthenticated, payrollController.showTaxPage);

module.exports = router;
