const db = require('../config/db');

// 📌 Show Leave Management Page
exports.showLeavePage = async (req, res) => {
    try {
        const [leaveRequests] = await db.execute(`
            SELECT 
                l.Leave_ID, 
                l.Employee_ID, 
                a.Name AS Employee_Name, 
                l.Start_Date, 
                l.End_Date, 
                l.Reason, 
                l.Permission_Status 
            FROM Leave_Request l
            JOIN Employee e ON l.Employee_ID = e.Employee_ID
            JOIN Applicant a ON e.Applicant_ID = a.Applicant_ID
            ORDER BY FIELD(l.Permission_Status, 'Pending', 'Approved', 'Rejected'), l.Start_Date DESC
        `);

        res.render('modules/leave/leave', { 
            title: 'Leave Management - Smart HR', 
            user: req.session.user,
            leaveRequests
        });
    } catch (error) {
        console.error('Error fetching leave requests:', error);
        res.status(500).send('Failed to load leave requests.');
    }
};

// 📌 Fetch All Leave Requests (API)
exports.getLeaveRequests = async (req, res) => {
    try {
        const [leaveRequests] = await db.execute(`
            SELECT 
                l.Leave_ID, 
                l.Employee_ID, 
                a.Name AS Employee_Name, 
                l.Start_Date, 
                l.End_Date, 
                l.Reason, 
                l.Permission_Status 
            FROM Leave_Request l
            JOIN Employee e ON l.Employee_ID = e.Employee_ID
            JOIN Applicant a ON e.Applicant_ID = a.Applicant_ID
            ORDER BY FIELD(l.Permission_Status, 'Pending', 'Approved', 'Rejected'), l.Start_Date DESC
        `);

        res.json({ success: true, leaveRequests });
    } catch (error) {
        console.error('Error fetching leave requests:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch leave requests.' });
    }
};


// 📌 Show Leave Management Page
exports.showLeavePage = async (req, res) => {
    try {
        const [leaveRequests] = await db.execute(`
            SELECT 
                l.Leave_ID, 
                l.Employee_ID, 
                a.Name AS Employee_Name, 
                l.Start_Date, 
                l.End_Date, 
                l.Reason, 
                l.Permission_Status 
            FROM Leave_Request l
            JOIN Employee e ON l.Employee_ID = e.Employee_ID
            JOIN Applicant a ON e.Applicant_ID = a.Applicant_ID
            ORDER BY FIELD(l.Permission_Status, 'Pending', 'Approved', 'Rejected'), l.Start_Date DESC
        `);

        res.render('modules/leave/leave', { 
            title: 'Leave Management - Smart HR', 
            user: req.session.user,
            leaveRequests
        });
    } catch (error) {
        //console.error('Error fetching leave requests:', error);
        res.status(500).send('Failed to load leave requests.');
    }
};

// 📌 Approve Leave Request
exports.approveLeave = async (req, res) => {
    const leaveId = req.params.id;

    try {
        console.log(`Approving Leave ID: ${leaveId}`);

        const [result] = await db.execute(`
            UPDATE Leave_Request 
            SET Permission_Status = 'Approved' 
            WHERE Leave_ID = ? AND Permission_Status = 'Pending'
        `, [leaveId]);

        if (result.affectedRows === 0) {
            console.error(`Leave request ${leaveId} not found or already processed.`);
            return res.status(404).json({ success: false, message: 'Leave request not found or already processed.' });
        }

        //console.log(`Leave ID ${leaveId} approved successfully.`);
        res.json({ success: true, message: 'Leave approved successfully.' });

    } catch (error) {
        console.error(`Error approving leave request (Leave ID: ${leaveId}):`, error);
        res.status(500).json({ success: false, message: 'Failed to approve leave request.' });
    }
};

// 📌 Reject Leave Request
exports.rejectLeave = async (req, res) => {
    const leaveId = req.params.id;

    try {
        console.log(`Rejecting Leave ID: ${leaveId}`);

        const [result] = await db.execute(`
            UPDATE Leave_Request 
            SET Permission_Status = 'Rejected' 
            WHERE Leave_ID = ? AND Permission_Status = 'Pending'
        `, [leaveId]);

        if (result.affectedRows === 0) {
            console.error(`Leave request ${leaveId} not found or already processed.`);
            return res.status(404).json({ success: false, message: 'Leave request not found or already processed.' });
        }

        //console.log(`Leave ID ${leaveId} rejected successfully.`);
        res.json({ success: true, message: 'Leave rejected successfully.' });

    } catch (error) {
        console.error(`Error rejecting leave request (Leave ID: ${leaveId}):`, error);
        res.status(500).json({ success: false, message: 'Failed to reject leave request.' });
    }
};

