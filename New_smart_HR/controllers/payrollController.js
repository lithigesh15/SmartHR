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
        const [employees] = await db.query(`
            SELECT 
                e.Employee_ID, 
                a.Name, 
                d.Department_Name, 
                e.Hired_Salary
            FROM 
                Employee e
            JOIN 
                Applicant a ON e.Applicant_ID = a.Applicant_ID
            JOIN 
                Department d ON e.Department_ID = d.Department_ID
            ORDER BY e.Employee_ID ASC
        `);
        
        res.render('modules/payroll/salary', {
            title: 'Salary Management - Smart HR',
            user: req.session.user,
            employees
        });
    } catch (error) {
        console.error('Error fetching salary page data:', error);
        res.status(500).render('error', { message: 'Failed to load salary page' });
    }
};

// API to fetch Employee Details
exports.getEmployeeDetails = async (req, res) => {
    try {
        const { employeeId } = req.params;
        
        const [employees] = await db.query(`
            SELECT 
                e.Employee_ID, 
                a.Name AS Employee_Name, 
                d.Department_Name, 
                e.Hired_Salary AS Basic_Salary
            FROM 
                Employee e
            JOIN 
                Applicant a ON e.Applicant_ID = a.Applicant_ID
            JOIN 
                Department d ON e.Department_ID = d.Department_ID
            WHERE 
                e.Employee_ID = ?
        `, [employeeId]);

        if (employees.length === 0) {
            return res.status(404).json({ success: false, message: 'Employee not found' });
        }

        // Fetch last payroll record for additional details
        const [payrollRecords] = await db.query(`
            SELECT 
                COALESCE(Basic_Pay, e.Hired_Salary) AS Basic_Pay,
                COALESCE(Allowances, 0) AS Allowances,
                COALESCE(PF_Deductions, 0) AS PF_Deductions,
                COALESCE(Tax_Deductions, 0) AS Tax_Deductions,
                COALESCE(Total_Bonus, 0) AS Total_Bonus
            FROM 
                Employee e
            LEFT JOIN 
                Payroll p ON e.Employee_ID = p.Employee_ID
            WHERE 
                e.Employee_ID = ?
            ORDER BY 
                p.Pay_Date DESC
            LIMIT 1
        `, [employeeId]);

        const employeeData = {
            ...employees[0],
            ...(payrollRecords[0] || {})
        };

        res.json({ 
            success: true, 
            employee: employeeData 
        });
    } catch (error) {
        console.error('Error fetching employee details:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch employee details' });
    }
};

// API to calculate salary
exports.calculateSalary = async (req, res) => {
    try {
        const { employeeId, hra, medical, pf, tax } = req.body;

        const [employees] = await db.query(
            'SELECT e.*, a.Name FROM Employee e JOIN Applicant a ON e.Applicant_ID = a.Applicant_ID WHERE e.Employee_ID = ?', 
            [employeeId]
        );

        if (!employees.length) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        const employee = employees[0];
        const baseSalary = employee.Hired_Salary || 50000;

        const hraAmount = (baseSalary * (hra || 0)) / 100;
        const medicalAmount = parseFloat(medical) || 0;
        const pfDeduction = (baseSalary * (pf || 0)) / 100;
        const taxDeduction = (baseSalary * (tax || 0)) / 100;

        const totalAllowances = hraAmount + medicalAmount;
        const totalDeductions = pfDeduction + taxDeduction;
        const netSalary = baseSalary + totalAllowances - totalDeductions;

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

// API to update Payroll (Payslip)
exports.updatePayslip = async (req, res) => {
    try {
        const { employeeId, basicSalary, hra, medical, pf, tax, netSalary } = req.body;

        if (!employeeId) {
            return res.status(400).json({ success: false, message: 'Employee ID is required' });
        }

        const currentDate = new Date();
        const hraAmount = (basicSalary * (hra || 0)) / 100;
        const medicalAmount = parseFloat(medical) || 0;
        const pfDeduction = (basicSalary * (pf || 0)) / 100;
        const taxDeduction = (basicSalary * (tax || 0)) / 100;

        await db.query(`
            INSERT INTO Payroll (
                Employee_ID, 
                Basic_Pay, 
                Allowances, 
                PF_Deductions, 
                Tax_Deductions, 
                Total_Bonus, 
                Pay_Date
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
                Basic_Pay = ?, 
                Allowances = ?, 
                PF_Deductions = ?, 
                Tax_Deductions = ?, 
                Total_Bonus = ?, 
                Pay_Date = ?
        `, [
            employeeId, 
            basicSalary, 
            hraAmount + medicalAmount, 
            pfDeduction, 
            taxDeduction, 
            0, 
            currentDate,
            // Update values
            basicSalary, 
            hraAmount + medicalAmount, 
            pfDeduction, 
            taxDeduction, 
            0, 
            currentDate
        ]);

        res.json({ success: true, message: 'Payslip updated successfully' });
    } catch (error) {
        console.error('Error updating payslip:', error);
        res.status(500).json({ success: false, message: 'Failed to update payslip' });
    }
};

// Display payslip page
exports.showPaySlipPage = async (req, res) => {
    try {
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
                p.Pay_Date
            FROM 
                Payroll p
            JOIN 
                Employee e ON p.Employee_ID = e.Employee_ID
            JOIN 
                Applicant a ON e.Applicant_ID = a.Applicant_ID
            JOIN 
                Department d ON e.Department_ID = d.Department_ID
            ORDER BY p.Pay_Date DESC
        `);
        
        res.render('modules/payroll/payslip', {
            title: 'Pay Slip - Smart HR',
            user: req.session.user,
            payslips
        });
    } catch (error) {
        console.error('Error fetching payslip data:', error);
        res.status(500).render('error', { message: 'Failed to load payslip data' });
    }
};

// API to fetch Payslip Data
exports.getPayslipData = async (req, res) => {
    try {
        const [payslips] = await db.query(`
        SELECT 
            p.Payroll_ID,
            e.Employee_ID AS employeeId,
            a.Name AS employeeName,
            p.Basic_Pay AS basicSalary,
            p.Allowances AS allowance,
            p.Total_Bonus AS bonus,
            p.PF_Deductions AS pfDeduction,
            p.Tax_Deductions AS taxDeduction,
            (p.Basic_Pay + p.Allowances + p.Total_Bonus - p.PF_Deductions - p.Tax_Deductions) AS netSalary
        FROM 
            Payroll p
        JOIN 
            Employee e ON p.Employee_ID = e.Employee_ID
        JOIN 
            Applicant a ON e.Applicant_ID = a.Applicant_ID
        ORDER BY e.Employee_ID DESC, p.Pay_Date DESC
        `);

        res.json(payslips);
    } catch (error) {
        console.error('Error fetching payslip data:', error);
        res.status(500).json({ message: 'Failed to load payslip data' });
    }
};