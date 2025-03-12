const db = require('../config/db');

exports.getOffboardingPage = async (req, res) => {
    try {
        const { employee_id, date } = req.query;

        let query = `
            SELECT Exit_ID, 
                   Employee_ID, 
                   Resignation_Date, 
                   Exit_Reason 
            FROM Exit_Management 
            WHERE 1=1`;
        let queryParams = [];

        if (employee_id) {
            query += ` AND Employee_ID = ?`;
            queryParams.push(employee_id);
        }

        if (date) {
            query += ` AND Resignation_Date = ?`;
            queryParams.push(date);
        }

        const [offboardedEmployees] = await db.query(query, queryParams);

        // ✅ Convert Resignation_Date to proper format before sending it to EJS
        offboardedEmployees.forEach(emp => {
            if (emp.Resignation_Date) {
                emp.Resignation_Date = new Date(emp.Resignation_Date).toISOString().split('T')[0];
            }
        });

        res.render('modules/offboarding/offboarding', {
            title: 'Employee Offboarding - Smart HR',
            user: req.session.user,
            offboardedEmployees
        });
    } catch (error) {
        console.error('Error fetching offboarding data:', error);
        res.status(500).render('error', { message: 'Failed to load offboarding data' });
    }
};


exports.addOffboarding = async (req, res) => {
    try {
        const { employee_id, resignation_date, exit_reason } = req.body;

        // Validate inputs
        if (!employee_id || !resignation_date || !exit_reason) {
            console.error("Missing required fields:", req.body);
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        // Insert into the database
        const [result] = await db.query(
            `INSERT INTO Exit_Management (Employee_ID, Resignation_Date, Exit_Reason) VALUES (?, ?, ?)`,
            [employee_id, resignation_date, exit_reason]
        );

        if (result.affectedRows === 0) {
            throw new Error("Failed to insert record into the database.");
        }

        res.json({ success: true, message: 'Employee offboarded successfully' });
    } catch (error) {
        console.error('Error offboarding employee:', error);
        res.status(500).json({ success: false, message: 'Failed to offboard employee' });
    }
};


// 📌 Search Offboarding Records
exports.searchOffboarding = async (req, res) => {
    try {
        res.redirect(`/offboarding?employee_id=${req.query.employee_id}&date=${req.query.date}`);
    } catch (error) {
        console.error('Error searching:', error);
        res.status(500).json({ success: false, message: 'Failed to search' });
    }
};
