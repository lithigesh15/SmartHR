const db = require('../config/db');

// Show Employee Records Page
exports.showRecordsPage = (req, res) => {
    res.render('modules/records/records', { 
        title: 'Employee Records - Smart HR',
        user: req.session.user
    });
};

// Fetch Employee Details
exports.getEmployeeDetails = async (req, res) => {
    try {
        const { employeeId } = req.params;

        if (!employeeId || isNaN(employeeId) || employeeId < 1) {
            return res.status(400).json({ success: false, message: 'Invalid Employee ID.' });
        }

        const [employee] = await db.query(`
            SELECT 
                e.Employee_ID, 
                a.Name, 
                a.Email, 
                a.Experience, 
                d.Department_Name, 
                j.Job_Title, 
                e.Hired_Salary, 
                e.Joining_Date,
                p.Appraisal,
                COALESCE(t.Last_Training, 'N/A') AS Last_Training,
                COALESCE(t.Total_Trainings, 0) AS Total_Trainings,
                COALESCE(l.Leave_Balance, 0) AS Leave_Balance,
                COALESCE(ex.Exit_Status, 'Active') AS Exit_Status
            FROM Employee e
            JOIN Applicant a ON e.Applicant_ID = a.Applicant_ID
            JOIN Department d ON e.Department_ID = d.Department_ID
            JOIN Job_Posting j ON a.Applied_Job_ID = j.Job_ID
            LEFT JOIN Performance p ON e.Employee_ID = p.Employee_ID
            LEFT JOIN (
                SELECT Employee_ID, COUNT(*) AS Total_Trainings, MAX(Start_Date) AS Last_Training
                FROM Employee_Training et
                JOIN Training t ON et.Training_ID = t.Training_ID
                GROUP BY Employee_ID
            ) t ON e.Employee_ID = t.Employee_ID
            LEFT JOIN (
                SELECT Employee_ID, SUM(DATEDIFF(End_Date, Start_Date)) AS Leave_Balance
                FROM Leave_Request
                WHERE Permission_Status = 'Approved'
                GROUP BY Employee_ID
            ) l ON e.Employee_ID = l.Employee_ID
            LEFT JOIN (
                SELECT Employee_ID, 'Exited' AS Exit_Status FROM Exit_Management
            ) ex ON e.Employee_ID = ex.Employee_ID
            WHERE e.Employee_ID = ?`, 
            [employeeId]
        );

        if (!employee.length) {
            return res.status(404).json({ success: false, message: 'Employee not found.' });
        }

        res.json({ success: true, employee: employee[0] });
    } catch (error) {
        console.error('Error fetching employee details:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch employee details.' });
    }
};

// Render Employee Records Page
exports.showEmployeeRecordsPage = (req, res) => {
    res.render('modules/records/records', {
        title: 'Employee Records - Smart HR',
        user: req.session.user
    });
};
