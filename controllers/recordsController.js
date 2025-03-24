const pool = require('../config/db'); // Ensure MySQL connection is correctly set up

// Show Employee Records Page
exports.showEmployeeRecordsPage = (req, res) => {
    res.render('modules/records/records', {
        title: 'Employee Records - Smart HR',
        user: req.session.user
    });
};


// Fetch Employee Details API
exports.getEmployeeDetails = async (req, res) => {
    let { employeeId } = req.params;
    employeeId = parseInt(employeeId, 10);

    if (isNaN(employeeId) || employeeId < 1) {
        return res.status(400).json({ success: false, message: "Invalid Employee ID." });
    }

    try {
        const query = `
            SELECT 
                e.Employee_ID, a.Name, a.Email, a.Experience, d.Department_Name, 
                j.Job_Title, e.Hired_Salary, e.Joining_Date, 
                COALESCE(p.Appraisal, 'N/A') AS Appraisal, 
                COALESCE(p.Comments, 'No Comments') AS Performance_Comments,
                COALESCE(pay.Basic_Pay, 0) AS Basic_Pay, 
                COALESCE(pay.Allowances, 0) AS Allowances, 
                COALESCE(pay.PF_Deductions, 0) AS PF_Deductions, 
                COALESCE(pay.Tax_Deductions, 0) AS Tax_Deductions, 
                COALESCE(pay.Total_Bonus, 0) AS Total_Bonus,
                COALESCE(ex.Resignation_Date, 'Active') AS Resignation_Date,
                COALESCE(ex.Exit_Reason, 'Still Employed') AS Exit_Reason
            FROM Employee e
            LEFT JOIN Applicant a ON e.Applicant_ID = a.Applicant_ID
            LEFT JOIN Department d ON e.Department_ID = d.Department_ID
            LEFT JOIN Job_Posting j ON a.Applied_Job_ID = j.Job_ID
            LEFT JOIN (
                SELECT Employee_ID, AVG(Appraisal) AS Appraisal, GROUP_CONCAT(Comments SEPARATOR '; ') AS Comments
                FROM Performance
                GROUP BY Employee_ID
            ) p ON e.Employee_ID = p.Employee_ID
            LEFT JOIN (
                SELECT Employee_ID, SUM(Basic_Pay) AS Basic_Pay, 
                    SUM(Allowances) AS Allowances, 
                    SUM(PF_Deductions) AS PF_Deductions, 
                    SUM(Tax_Deductions) AS Tax_Deductions, 
                    SUM(Total_Bonus) AS Total_Bonus
                FROM Payroll
                GROUP BY Employee_ID
            ) pay ON e.Employee_ID = pay.Employee_ID
            LEFT JOIN (
                SELECT Employee_ID, Resignation_Date, Exit_Reason
                FROM Exit_Management
            ) ex ON e.Employee_ID = ex.Employee_ID
            WHERE e.Employee_ID = ?;
        `;

        const [rows] = await pool.query(query, [employeeId]);

        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: "Employee not found." });
        }

        res.json({ success: true, employee: rows[0] });

    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};


// Render Employee Records Page
exports.showEmployeeRecordsPage = (req, res) => {
    res.render('modules/records/records', {
        title: 'Employee Records - Smart HR',
        user: req.session.user
    });
};
