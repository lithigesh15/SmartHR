const db = require('../config/db');

// Display payroll home page
exports.showPayrollHome = (req, res) => {
    res.render('modules/payroll/index', {
        title: 'Payroll Management - Smart HR',
        user: req.session.user
    });
};

// Display salary page
exports.showSalaryPage = async (req, res) => {
    try {
        // Fetch employees for salary management
        const [employees] = await db.query(`
            SELECT 
                e.Employee_ID, 
                a.Name, 
                d.Department_Name, 
                e.Hired_Salary,
                e.Joining_Date
            FROM 
                Employee e
            JOIN 
                Applicant a ON e.Applicant_ID = a.Applicant_ID
            JOIN 
                Department d ON e.Department_ID = d.Department_ID
            ORDER BY 
                e.Employee_ID ASC
        `);
        
        // Define hardcoded salary components since there's no SalaryComponents table
        const salaryComponents = [
            {
                id: 1,
                name: 'Basic Salary',
                type: 'EARNING',
                defaultValue: 100,
                calculationMethod: 'PERCENTAGE'
            },
            {
                id: 2,
                name: 'House Rent Allowance',
                type: 'EARNING',
                defaultValue: 40,
                calculationMethod: 'PERCENTAGE'
            },
            {
                id: 3,
                name: 'Medical Allowance',
                type: 'EARNING',
                defaultValue: 1500,
                calculationMethod: 'FIXED'
            },
            {
                id: 4,
                name: 'Provident Fund',
                type: 'DEDUCTION',
                defaultValue: 12,
                calculationMethod: 'PERCENTAGE'
            },
            {
                id: 5,
                name: 'Income Tax',
                type: 'DEDUCTION',
                defaultValue: 10,
                calculationMethod: 'PERCENTAGE'
            }
        ];
        
        res.render('modules/payroll/salary', {
            title: 'Salary Management - Smart HR',
            user: req.session.user,
            employees,
            salaryComponents
        });
    } catch (error) {
        console.error('Error fetching data for salary page:', error);
        res.status(500).render('error', {
            title: 'Error',
            message: 'Failed to load salary management page',
            error: {}
        });
    }
};

// Display tax page
exports.showTaxPage = async (req, res) => {
    try {
        // Fetch employees with their tax information
        const [employees] = await db.query(`
            SELECT 
                e.Employee_ID, 
                a.Name, 
                d.Department_Name, 
                e.Hired_Salary,
                p.Tax_Deductions
            FROM 
                Employee e
            JOIN 
                Applicant a ON e.Applicant_ID = a.Applicant_ID
            JOIN 
                Department d ON e.Department_ID = d.Department_ID
            LEFT JOIN
                Payroll p ON e.Employee_ID = p.Employee_ID AND p.Pay_Date = (
                    SELECT MAX(Pay_Date) FROM Payroll WHERE Employee_ID = e.Employee_ID
                )
            ORDER BY 
                e.Employee_ID ASC
        `);
        
        res.render('modules/payroll/tax', {
            title: 'Tax Management - Smart HR',
            user: req.session.user,
            employees
        });
    } catch (error) {
        console.error('Error fetching tax information:', error);
        res.status(500).render('error', {
            title: 'Error',
            message: 'Failed to load tax management page',
            error: {}
        });
    }
};

// Display bonus page
exports.showBonusPage = async (req, res) => {
    try {
        // Fetch employees with their bonus information and performance data
        const [employees] = await db.query(`
            SELECT 
                e.Employee_ID, 
                a.Name, 
                d.Department_Name, 
                e.Hired_Salary,
                p.Total_Bonus,
                perf.Appraisal
            FROM 
                Employee e
            JOIN 
                Applicant a ON e.Applicant_ID = a.Applicant_ID
            JOIN 
                Department d ON e.Department_ID = d.Department_ID
            LEFT JOIN
                Payroll p ON e.Employee_ID = p.Employee_ID AND p.Pay_Date = (
                    SELECT MAX(Pay_Date) FROM Payroll WHERE Employee_ID = e.Employee_ID
                )
            LEFT JOIN
                Performance perf ON e.Employee_ID = perf.Employee_ID AND perf.Review_Date = (
                    SELECT MAX(Review_Date) FROM Performance WHERE Employee_ID = e.Employee_ID
                )
            ORDER BY 
                e.Employee_ID ASC
        `);
        
        res.render('modules/payroll/bonus', {
            title: 'Bonus Management - Smart HR',
            user: req.session.user,
            employees
        });
    } catch (error) {
        console.error('Error fetching bonus information:', error);
        res.status(500).render('error', {
            title: 'Error',
            message: 'Failed to load bonus management page',
            error: {}
        });
    }
};

// Display payslip page
exports.showPaySlipPage = async (req, res) => {
    try {
        // Fetch payslip data
        const [payslips] = await db.query(`
            SELECT 
                p.Payroll_ID,
                e.Employee_ID,
                a.Name AS Employee_Name,
                d.Department_Name,
                p.Basic_Pay,
                p.Allowances,
                p.Total_Bonus,
                p.PF_Deductions,
                p.Tax_Deductions,
                (p.Basic_Pay + p.Allowances + p.Total_Bonus - p.PF_Deductions - p.Tax_Deductions) AS Net_Salary,
                p.Pay_Date,
                e.Joining_Date
            FROM 
                Payroll p
            JOIN 
                Employee e ON p.Employee_ID = e.Employee_ID
            JOIN 
                Applicant a ON e.Applicant_ID = a.Applicant_ID
            JOIN 
                Department d ON e.Department_ID = d.Department_ID
            ORDER BY 
                p.Pay_Date DESC, e.Employee_ID ASC
        `);
        
        res.render('modules/payroll/payslip', {
            title: 'Pay Slip - Smart HR',
            user: req.session.user,
            payslips
        });
    } catch (error) {
        console.error('Error fetching payslip data:', error);
        res.status(500).render('error', {
            title: 'Error',
            message: 'Failed to load payslip data',
            error: {}
        });
    }
};

// API endpoint to get payslip data
exports.getPayslipData = async (req, res) => {
    try {
        // Get parameters for filtering
        const { employeeId, payDate, departmentId } = req.query;
        
        let sqlQuery = `
            SELECT 
                p.Payroll_ID,
                e.Employee_ID,
                a.Name AS Employee_Name,
                d.Department_Name,
                p.Basic_Pay,
                p.Allowances,
                p.Total_Bonus,
                p.PF_Deductions,
                p.Tax_Deductions,
                (p.Basic_Pay + p.Allowances + p.Total_Bonus - p.PF_Deductions - p.Tax_Deductions) AS Net_Salary,
                p.Pay_Date,
                e.Joining_Date
            FROM 
                Payroll p
            JOIN 
                Employee e ON p.Employee_ID = e.Employee_ID
            JOIN 
                Applicant a ON e.Applicant_ID = a.Applicant_ID
            JOIN 
                Department d ON e.Department_ID = d.Department_ID
            WHERE 1=1
        `;
        
        const params = [];
        
        if (employeeId) {
            sqlQuery += ' AND e.Employee_ID = ?';
            params.push(employeeId);
        }
        
        if (payDate) {
            sqlQuery += ' AND p.Pay_Date = ?';
            params.push(payDate);
        }
        
        if (departmentId) {
            sqlQuery += ' AND d.Department_ID = ?';
            params.push(departmentId);
        }
        
        sqlQuery += ' ORDER BY p.Pay_Date DESC, e.Employee_ID ASC';
        
        const [payslips] = await db.query(sqlQuery, params);
        
        res.json(payslips);
    } catch (error) {
        console.error('Error fetching payslip data:', error);
        res.status(500).json({ message: 'Failed to load payslip data' });
    }
};

// API endpoint to calculate salary
exports.calculateSalary = async (req, res) => {
    try {
        const { employeeId, hra, medical, pf, tax } = req.body;
        
        // Fetch employee data
        const [employees] = await db.query(
            'SELECT e.*, a.Name FROM Employee e JOIN Applicant a ON e.Applicant_ID = a.Applicant_ID WHERE e.Employee_ID = ?', 
            [employeeId]
        );
        
        if (!employees || employees.length === 0) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        
        const employee = employees[0];
        const baseSalary = employee.Hired_Salary || 50000; // Default if not set
        
        // Calculate components
        const hraAmount = (baseSalary * hra) / 100;
        const medicalAmount = parseFloat(medical);
        const pfDeduction = (baseSalary * pf) / 100;
        const taxDeduction = (baseSalary * tax) / 100;
        
        // Calculate net salary
        const netSalary = baseSalary + hraAmount + medicalAmount - pfDeduction - taxDeduction;
        
        // Check if payroll record already exists for this employee and month
        const currentDate = new Date();
        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        
        const [existingPayroll] = await db.query(`
            SELECT * FROM Payroll 
            WHERE Employee_ID = ? 
            AND Pay_Date BETWEEN ? AND ?
        `, [
            employeeId, 
            firstDayOfMonth.toISOString().split('T')[0], 
            lastDayOfMonth.toISOString().split('T')[0]
        ]);
        
        if (existingPayroll && existingPayroll.length > 0) {
            // Update existing record
            await db.query(`
                UPDATE Payroll
                SET
                    Basic_Pay = ?,
                    Allowances = ?,
                    PF_Deductions = ?,
                    Tax_Deductions = ?,
                    Pay_Date = CURDATE()
                WHERE Payroll_ID = ?
            `, [
                baseSalary,
                hraAmount + medicalAmount,
                pfDeduction,
                taxDeduction,
                existingPayroll[0].Payroll_ID
            ]);
        } else {
            // Create new record
            await db.query(`
                INSERT INTO Payroll (
                    Employee_ID,
                    Basic_Pay,
                    Allowances,
                    PF_Deductions,
                    Tax_Deductions,
                    Total_Bonus,
                    Pay_Date
                ) VALUES (?, ?, ?, ?, ?, 0, CURDATE())
            `, [
                employeeId,
                baseSalary,
                hraAmount + medicalAmount,
                pfDeduction,
                taxDeduction
            ]);
        }
        
        res.json({
            success: true,
            salary: {
                employeeId,
                employeeName: employee.Name,
                baseSalary,
                hra: hraAmount,
                medical: medicalAmount,
                pfDeduction,
                taxDeduction,
                netSalary: netSalary.toFixed(2)
            }
        });
    } catch (error) {
        console.error('Error calculating salary:', error);
        res.status(500).json({ message: 'Failed to calculate salary' });
    }
};

// API endpoint to calculate bonus
exports.calculateBonus = async (req, res) => {
    try {
        const { employeeId, performanceRating, bonusPercentage, additionalBonus } = req.body;
        
        // Fetch employee data
        const [employees] = await db.query(
            'SELECT e.*, a.Name FROM Employee e JOIN Applicant a ON e.Applicant_ID = a.Applicant_ID WHERE e.Employee_ID = ?', 
            [employeeId]
        );
        
        if (!employees || employees.length === 0) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        
        const employee = employees[0];
        const baseSalary = employee.Hired_Salary || 50000; // Default if not set
        
        // Calculate bonus based on performance rating and bonus percentage
        let performanceMultiplier = 1.0;
        if (performanceRating > 4) {
            performanceMultiplier = 1.2;
        } else if (performanceRating > 3) {
            performanceMultiplier = 1.0;
        } else if (performanceRating > 2) {
            performanceMultiplier = 0.8;
        } else {
            performanceMultiplier = 0.5;
        }
        
        const bonusAmount = (baseSalary * bonusPercentage / 100) * performanceMultiplier;
        const additionalBonusAmount = parseFloat(additionalBonus || 0);
        const totalBonus = bonusAmount + additionalBonusAmount;
        
        // Find latest payroll record for this employee
        const [existingPayroll] = await db.query(`
            SELECT * FROM Payroll 
            WHERE Employee_ID = ? 
            ORDER BY Pay_Date DESC LIMIT 1
        `, [employeeId]);
        
        if (existingPayroll && existingPayroll.length > 0) {
            // Update existing record
            await db.query(`
                UPDATE Payroll
                SET
                    Total_Bonus = ?,
                    Pay_Date = CURDATE()
                WHERE Payroll_ID = ?
            `, [
                totalBonus,
                existingPayroll[0].Payroll_ID
            ]);
        } else {
            // Create new record with default values
            await db.query(`
                INSERT INTO Payroll (
                    Employee_ID,
                    Basic_Pay,
                    Allowances,
                    PF_Deductions,
                    Tax_Deductions,
                    Total_Bonus,
                    Pay_Date
                ) VALUES (?, ?, 0, 0, 0, ?, CURDATE())
            `, [
                employeeId,
                baseSalary,
                totalBonus
            ]);
        }
        
        // Update Performance table
        const currentDate = new Date();
        
        await db.query(`
            INSERT INTO Performance (
                Employee_ID,
                KPIs,
                Review_Date,
                Appraisal,
                Comments
            ) VALUES (?, ?, CURDATE(), ?, ?)
        `, [
            employeeId,
            `Performance Rating: ${performanceRating}/5`,
            performanceRating,
            `Bonus awarded: ${totalBonus.toFixed(2)}`
        ]);
        
        res.json({
            success: true,
            bonus: {
                employeeId,
                employeeName: employee.Name,
                performanceRating,
                bonusPercentage,
                bonusAmount: bonusAmount.toFixed(2),
                additionalBonus: additionalBonusAmount.toFixed(2),
                totalBonus: totalBonus.toFixed(2)
            }
        });
    } catch (error) {
        console.error('Error calculating bonus:', error);
        res.status(500).json({ message: 'Failed to calculate bonus' });
    }
};

// API endpoint to calculate tax
exports.calculateTax = async (req, res) => {
    try {
        const { employeeId, annualSalary, taxRate } = req.body;
        
        // Simple tax calculation based on annual salary and tax rate
        const taxAmount = (annualSalary * taxRate) / 100;
        
        // Update tax information in the payroll table if employee ID is provided
        if (employeeId) {
            // Find latest payroll record for this employee
            const [existingPayroll] = await db.query(`
                SELECT * FROM Payroll 
                WHERE Employee_ID = ? 
                ORDER BY Pay_Date DESC LIMIT 1
            `, [employeeId]);
            
            if (existingPayroll && existingPayroll.length > 0) {
                // Update existing record
                await db.query(`
                    UPDATE Payroll
                    SET
                        Tax_Deductions = ?,
                        Pay_Date = CURDATE()
                    WHERE Payroll_ID = ?
                `, [
                    taxAmount,
                    existingPayroll[0].Payroll_ID
                ]);
            } else {
                // Get employee base salary
                const [employee] = await db.query('SELECT Hired_Salary FROM Employee WHERE Employee_ID = ?', [employeeId]);
                const baseSalary = employee[0]?.Hired_Salary || 50000;
                
                // Create new record with default values
                await db.query(`
                    INSERT INTO Payroll (
                        Employee_ID,
                        Basic_Pay,
                        Allowances,
                        PF_Deductions,
                        Tax_Deductions,
                        Total_Bonus,
                        Pay_Date
                    ) VALUES (?, ?, 0, 0, ?, 0, CURDATE())
                `, [
                    employeeId,
                    baseSalary,
                    taxAmount
                ]);
            }
        }
        
        res.json({
            success: true,
            tax: {
                employeeId,
                annualSalary,
                taxRate,
                taxAmount: taxAmount.toFixed(2)
            }
        });
    } catch (error) {
        console.error('Error calculating tax:', error);
        res.status(500).json({ message: 'Failed to calculate tax' });
    }
};

// Update an employee's payroll information
exports.updatePayroll = async (req, res) => {
    try {
        const { 
            payrollId,
            employeeId, 
            basicPay, 
            allowances, 
            totalBonus, 
            pfDeductions, 
            taxDeductions 
        } = req.body;
        
        // Calculate net salary
        const netSalary = parseFloat(basicPay) + 
                          parseFloat(allowances) + 
                          parseFloat(totalBonus) - 
                          parseFloat(pfDeductions) - 
                          parseFloat(taxDeductions);
        
        if (payrollId) {
            // Update existing record
            await db.query(`
                UPDATE Payroll
                SET
                    Basic_Pay = ?,
                    Allowances = ?,
                    Total_Bonus = ?,
                    PF_Deductions = ?,
                    Tax_Deductions = ?,
                    Pay_Date = CURDATE()
                WHERE Payroll_ID = ?
            `, [
                basicPay,
                allowances,
                totalBonus,
                pfDeductions,
                taxDeductions,
                payrollId
            ]);
        } else {
            // Find latest payroll record for this employee
            const [existingPayroll] = await db.query(`
                SELECT * FROM Payroll 
                WHERE Employee_ID = ? 
                ORDER BY Pay_Date DESC LIMIT 1
            `, [employeeId]);
            
            if (existingPayroll && existingPayroll.length > 0) {
                // Update existing record
                await db.query(`
                    UPDATE Payroll
                    SET
                        Basic_Pay = ?,
                        Allowances = ?,
                        Total_Bonus = ?,
                        PF_Deductions = ?,
                        Tax_Deductions = ?,
                        Pay_Date = CURDATE()
                    WHERE Payroll_ID = ?
                `, [
                    basicPay,
                    allowances,
                    totalBonus,
                    pfDeductions,
                    taxDeductions,
                    existingPayroll[0].Payroll_ID
                ]);
            } else {
                // Create new record
                await db.query(`
                    INSERT INTO Payroll (
                        Employee_ID,
                        Basic_Pay,
                        Allowances,
                        Total_Bonus,
                        PF_Deductions,
                        Tax_Deductions,
                        Pay_Date
                    ) VALUES (?, ?, ?, ?, ?, ?, CURDATE())
                `, [
                    employeeId,
                    basicPay,
                    allowances,
                    totalBonus,
                    pfDeductions,
                    taxDeductions
                ]);
            }
        }
        
        res.json({
            success: true,
            payroll: {
                employeeId,
                basicPay,
                allowances,
                totalBonus,
                pfDeductions,
                taxDeductions,
                netSalary: netSalary.toFixed(2)
            }
        });
    } catch (error) {
        console.error('Error updating payroll:', error);
        res.status(500).json({ message: 'Failed to update payroll information' });
    }
};

// Delete a payroll record
exports.deletePayroll = async (req, res) => {
    try {
        const payrollId = req.params.id;
        
        // Delete the payroll record
        await db.query('DELETE FROM Payroll WHERE Payroll_ID = ?', [payrollId]);
        
        res.json({ message: 'Payroll record deleted successfully' });
    } catch (error) {
        console.error('Error deleting payroll:', error);
        res.status(500).json({ message: 'Failed to delete payroll record' });
    }
};

// Generate monthly payroll report
exports.generatePayrollReport = async (req, res) => {
    try {
        const { month, year, departmentId } = req.query;
        const startDate = year && month ? `${year}-${month}-01` : null;
        let endDate = null;
        
        if (startDate) {
            // Calculate the last day of the month
            const lastDay = new Date(year, month, 0).getDate();
            endDate = `${year}-${month}-${lastDay}`;
        }
        
        // Base query for payroll data
        let sqlQuery = `
            SELECT 
                p.Payroll_ID,
                e.Employee_ID,
                a.Name AS Employee_Name,
                d.Department_Name,
                d.Department_ID,
                p.Basic_Pay,
                p.Allowances,
                p.Total_Bonus,
                p.PF_Deductions,
                p.Tax_Deductions,
                (p.Basic_Pay + p.Allowances + p.Total_Bonus - p.PF_Deductions - p.Tax_Deductions) AS Net_Salary,
                p.Pay_Date,
                e.Joining_Date
            FROM 
                Payroll p
            JOIN 
                Employee e ON p.Employee_ID = e.Employee_ID
            JOIN 
                Applicant a ON e.Applicant_ID = a.Applicant_ID
            JOIN 
                Department d ON e.Department_ID = d.Department_ID
            WHERE 1=1
        `;
        
        const params = [];
        
        // Add date range filter if provided
        if (startDate && endDate) {
            sqlQuery += ' AND p.Pay_Date BETWEEN ? AND ?';
            params.push(startDate, endDate);
        }
        
        // Add department filter if provided
        if (departmentId) {
            sqlQuery += ' AND d.Department_ID = ?';
            params.push(departmentId);
        }
        
        // Execute query
        const [payrolls] = await db.query(sqlQuery, params);
        
        // Calculate totals
        let totalEmployees = payrolls.length;
        let totalBasicPay = 0;
        let totalAllowances = 0;
        let totalBonus = 0;
        let totalPfDeductions = 0;
        let totalTaxDeductions = 0;
        let totalNetSalary = 0;
        
        // Department-wise analysis
        const departmentWiseAnalysis = {};
        
        // Process each payroll record
        payrolls.forEach(payroll => {
            // Add to totals
            totalBasicPay += parseFloat(payroll.Basic_Pay || 0);
            totalAllowances += parseFloat(payroll.Allowances || 0);
            totalBonus += parseFloat(payroll.Total_Bonus || 0);
            totalPfDeductions += parseFloat(payroll.PF_Deductions || 0);
            totalTaxDeductions += parseFloat(payroll.Tax_Deductions || 0);
            totalNetSalary += parseFloat(payroll.Net_Salary || 0);
            
            // Group by department
            const departmentId = payroll.Department_ID;
            const departmentName = payroll.Department_Name;
            
            if (!departmentWiseAnalysis[departmentId]) {
                departmentWiseAnalysis[departmentId] = {
                    departmentName,
                    totalEmployees: 0,
                    totalSalary: 0,
                    totalBonus: 0,
                    totalDeductions: 0
                };
            }
            
            departmentWiseAnalysis[departmentId].totalEmployees++;
            departmentWiseAnalysis[departmentId].totalSalary += parseFloat(payroll.Net_Salary || 0);
            departmentWiseAnalysis[departmentId].totalBonus += parseFloat(payroll.Total_Bonus || 0);
            departmentWiseAnalysis[departmentId].totalDeductions += parseFloat(payroll.PF_Deductions || 0) + parseFloat(payroll.Tax_Deductions || 0);
        });
        
        // Format department analysis for response
        const departmentAnalysis = Object.values(departmentWiseAnalysis).map(dept => {
            return {
                ...dept,
                totalSalary: dept.totalSalary.toFixed(2),
                totalBonus: dept.totalBonus.toFixed(2),
                totalDeductions: dept.totalDeductions.toFixed(2),
                averageSalary: (dept.totalSalary / dept.totalEmployees).toFixed(2)
            };
        });
        
        // Get performance data for employees in the report
        const employeeIds = payrolls.map(p => p.Employee_ID).join(',');
        let performanceData = [];
        
        if (employeeIds.length > 0) {
            const [performanceResults] = await db.query(`
                SELECT 
                    p.Employee_ID,
                    AVG(p.Appraisal) as AverageAppraisal,
                    MAX(p.Review_Date) as LastReviewDate
                FROM 
                    Performance p
                WHERE 
                    p.Employee_ID IN (${employeeIds})
                GROUP BY 
                    p.Employee_ID
            `);
            
            performanceData = performanceResults;
        }
        
        res.json({
            success: true,
            report: {
                period: startDate && endDate ? `${year}-${month}` : 'All Time',
                totalEmployees,
                totalBasicPay: totalBasicPay.toFixed(2),
                totalAllowances: totalAllowances.toFixed(2),
                totalBonus: totalBonus.toFixed(2),
                totalPfDeductions: totalPfDeductions.toFixed(2),
                totalTaxDeductions: totalTaxDeductions.toFixed(2),
                totalNetSalary: totalNetSalary.toFixed(2),
                departmentAnalysis,
                performanceData
            }
        });
    } catch (error) {
        console.error('Error generating payroll report:', error);
        res.status(500).json({ message: 'Failed to generate payroll report' });
    }
};

// Get employee performance history
exports.getEmployeePerformance = async (req, res) => {
    try {
        const { employeeId } = req.params;
        
        // Fetch performance data
        const [performanceData] = await db.query(`
            SELECT 
                Performance_ID,
                Employee_ID,
                KPIs,
                Review_Date,
                Appraisal,
                Comments
            FROM 
                Performance
            WHERE 
                Employee_ID = ?
            ORDER BY 
                Review_Date DESC
        `, [employeeId]);
        
        res.json({
            success: true,
            performance: performanceData
        });
    } catch (error) {
        console.error('Error fetching performance data:', error);
        res.status(500).json({ message: 'Failed to fetch performance data' });
    }
};

// Add new performance review
exports.addPerformanceReview = async (req, res) => {
    try {
        const { employeeId, kpis, appraisal, comments } = req.body;
        
        // Insert new performance record
        const [result] = await db.query(`
            INSERT INTO Performance (
                Employee_ID,
                KPIs,
                Review_Date,
                Appraisal,
                Comments
            ) VALUES (?, ?, CURDATE(), ?, ?)
        `, [
            employeeId,
            kpis,
            appraisal,
            comments
        ]);
        
        res.json({
            success: true,
            performanceId: result.insertId,
            message: 'Performance review added successfully'
        });
    } catch (error) {
        console.error('Error adding performance review:', error);
        res.status(500).json({ message: 'Failed to add performance review' });
    }
};