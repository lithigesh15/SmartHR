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

    // Convert to an integer and validate
    employeeId = parseInt(employeeId, 10);

    if (isNaN(employeeId) || employeeId < 1) {
        return res.status(400).json({ success: false, message: "Invalid Employee ID." });
    }

    try {
        //console.log(`Fetching details for Employee ID: ${employeeId}`); // Debugging log

        const query = `
            SELECT e.Employee_ID, a.Name, a.Email, d.Department_Name, j.Job_Title, e.Hired_Salary, e.Joining_Date,
                COALESCE(p.Appraisal, 'N/A') AS Appraisal, 
                COALESCE(et.Total_Trainings, 0) AS Total_Trainings, 
                COALESCE(lt.Last_Training, 'N/A') AS Last_Training, 
                COALESCE(lr.Leave_Balance, 'N/A') AS Leave_Balance
            FROM Employee e
            LEFT JOIN Applicant a ON e.Applicant_ID = a.Applicant_ID
            LEFT JOIN Department d ON e.Department_ID = d.Department_ID
            LEFT JOIN Job_Posting j ON a.Applied_Job_ID = j.Job_ID
            LEFT JOIN (
                SELECT Employee_ID, AVG(Appraisal) AS Appraisal
                FROM Performance
                GROUP BY Employee_ID
            ) p ON e.Employee_ID = p.Employee_ID
            LEFT JOIN (
                SELECT Employee_ID, COUNT(Employee_Training_ID) AS Total_Trainings
                FROM Employee_Training
                WHERE Completion_Status = 'Completed'
                GROUP BY Employee_ID
            ) et ON e.Employee_ID = et.Employee_ID
            LEFT JOIN (
                SELECT et.Employee_ID, MAX(c.Course_Title) AS Last_Training
                FROM Employee_Training et
                JOIN Courses c ON et.Course_ID = c.Course_ID
                WHERE et.Completion_Status = 'Completed'
                GROUP BY et.Employee_ID
            ) lt ON e.Employee_ID = lt.Employee_ID
            LEFT JOIN (
                SELECT Employee_ID, COUNT(Leave_ID) AS Leave_Balance
                FROM Leave_Request
                WHERE Permission_Status = 'Approved'
                GROUP BY Employee_ID
            ) lr ON e.Employee_ID = lr.Employee_ID
            WHERE e.Employee_ID = ?;
        `;

        const [rows] = await pool.query(query, [employeeId]);

        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: "Employee not found." });
        }

        //console.log("Employee Data Retrieved:", rows[0]); // Debugging log

        res.json({ success: true, employee: rows[0] });

        console.log('employee:', rows[0]);

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
