const db = require('../config/db');

// Get Compliance Dashboard
exports.getCompliancePage = (req, res) => {
    res.render('modules/compliance/compliance', {
        title: 'Compliance - Smart HR',
        user: req.session.user
    });
};

// Get Policy Repository
exports.getPolicyPage = async (req, res) => {
    try {
        const [policies] = await db.query(`SELECT * FROM Compliance_Policies ORDER BY Policy_ID`);

        res.render('modules/compliance/policy', {
            title: 'Policy Repository - Smart HR',
            user: req.session.user,
            policies: policies || []
        });
    } catch (error) {
        console.error('Error fetching policies:', error);
        res.status(500).render('error', { message: 'Failed to load policy repository' });
    }
};

// Create a New Policy
exports.createPolicy = async (req, res) => {
    try {
        const { policyTitle, description, effectiveDate } = req.body;

        if (!policyTitle || !description || !effectiveDate) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        // Ensure unique policies
        const [existingPolicy] = await db.query(
            `SELECT * FROM Compliance_Policies WHERE Policy_Title = ?`,
            [policyTitle]
        );

        if (existingPolicy.length > 0) {
            return res.status(400).json({ success: false, message: 'Policy with this title already exists' });
        }

        await db.query(
            `INSERT INTO Compliance_Policies (Policy_Title, Description, Effective_Date) VALUES (?, ?, ?)`,
            [policyTitle, description, effectiveDate]
        );

        res.redirect('/compliance/policy');
    } catch (error) {
        console.error('Error creating policy:', error);
        res.status(500).json({ success: false, message: 'Failed to create policy' });
    }
};

// Delete a Policy
exports.deletePolicy = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query(`DELETE FROM Compliance_Policies WHERE Policy_ID = ?`, [id]);
        res.json({ success: true, message: 'Policy deleted successfully' });
    } catch (error) {
        console.error('Error deleting policy:', error);
        res.status(500).json({ success: false, message: 'Failed to delete policy' });
    }
};

exports.getNotificationsPage = async (req, res) => {
    try {
        // Fetch active compliance notifications
        const [notifications] = await db.query(`
            SELECT n.Notification_ID, n.Department_ID, n.Compliance_Issue, d.Department_Name
            FROM Compliance_Notifications n
            JOIN Department d ON n.Department_ID = d.Department_ID
            ORDER BY n.Created_At DESC
        `);

        // Fetch compliance tracking records (without Notification_ID)
        const [tracking] = await db.query(`
            SELECT 
                t.Tracking_ID, 
                t.Department_ID, 
                d.Department_Name, 
                t.Compliance_Issue, 
                t.Status
            FROM Compliance_Tracking t
            JOIN Department d ON t.Department_ID = d.Department_ID
            ORDER BY t.Updated_At DESC
        `);

        //console.log("Notifications:", notifications);
        //console.log("Tracking:", tracking);

        res.render('modules/compliance/notification', {
            title: 'Compliance Notifications - Smart HR',
            user: req.session.user,
            notifications: notifications || [],
            tracking: tracking || []
        });
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).render('error', { title: 'Error', message: 'Failed to load compliance notifications' });
    }
};


exports.saveNotificationToTracking = async (req, res) => {
    try {
        const { notificationId } = req.body;

        //console.log(`Received request to save Notification_ID: ${notificationId}`);

        if (!notificationId) {
            console.error('Notification ID is missing or invalid.');
            return res.status(400).json({ success: false, message: 'Invalid notification ID' });
        }

        // Fetch notification details before deleting
        const [existingNotification] = await db.query(
            `SELECT * FROM Compliance_Notifications WHERE Notification_ID = ?`,
            [notificationId]
        );

        if (existingNotification.length === 0) {
            console.error('Notification not found.');
            return res.status(404).json({ success: false, message: 'Notification not found' });
        }

        const { Compliance_Issue, Department_ID } = existingNotification[0];

        //console.log(`Found Notification: ${JSON.stringify(existingNotification[0])}`);

        // Start transaction
        await db.query('START TRANSACTION');

        try {
            // Insert into Compliance_Tracking without Notification_ID
            const insertQuery = `
                INSERT INTO Compliance_Tracking (Compliance_Issue, Department_ID, Status, Updated_At)
                VALUES (?, ?, 'Pending', NOW())
            `;
            const [insertResult] = await db.query(insertQuery, [Compliance_Issue, Department_ID]);

            if (!insertResult.affectedRows) {
                throw new Error('Failed to insert into Compliance_Tracking');
            }

            //console.log(`Inserted into Compliance_Tracking with Tracking_ID: ${insertResult.insertId}`);

            // Delete the notification from Compliance_Notifications
            const deleteQuery = `DELETE FROM Compliance_Notifications WHERE Notification_ID = ?`;
            const [deleteResult] = await db.query(deleteQuery, [notificationId]);

            if (!deleteResult.affectedRows) {
                throw new Error('Failed to delete from Compliance_Notifications');
            }

            //console.log(`Deleted from Compliance_Notifications with Notification_ID: ${notificationId}`);

            // Commit transaction
            await db.query('COMMIT');

            // Redirect to Tracking page after saving
            return res.json({ success: true, message: 'Notification saved to tracking', redirect: '/compliance/tracking' });
        } catch (transactionError) {
            await db.query('ROLLBACK');
            console.error('Transaction error:', transactionError);
            return res.status(500).json({ success: false, message: 'Failed to save notification' });
        }
    } catch (error) {
        console.error('Error saving notification to tracking:', error);
        res.status(500).json({ success: false, message: 'Failed to save notification' });
    }
};

// Delete Notification (Prevents Deleting Tracked Notifications)
exports.deleteNotification = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if the notification is tracked
        const [trackingCheck] = await db.query(
            `SELECT * FROM Compliance_Tracking WHERE Notification_ID = ?`,
            [id]
        );

        if (trackingCheck.length > 0) {
            return res.status(400).json({ success: false, message: 'Cannot delete a notification that is being tracked' });
        }

        // Check if the notification exists before deleting
        const [existingNotification] = await db.query(
            `SELECT * FROM Compliance_Notifications WHERE Notification_ID = ?`,
            [id]
        );

        if (existingNotification.length === 0) {
            return res.status(404).json({ success: false, message: 'Notification not found' });
        }

        await db.query(`DELETE FROM Compliance_Notifications WHERE Notification_ID = ?`, [id]);
        res.json({ success: true, message: 'Notification deleted successfully' });
    } catch (error) {
        console.error('Error deleting notification:', error);
        res.status(500).json({ success: false, message: 'Failed to delete notification' });
    }
};

exports.updateTrackingStatus = async (req, res) => {
    try {
        const { trackingId, newStatus } = req.body;

        console.log(`Updating Tracking_ID ${trackingId} to Status: ${newStatus}`);

        // Validate input
        if (!trackingId || isNaN(trackingId)) {
            return res.status(400).json({ success: false, message: 'Invalid tracking ID' });
        }

        // Validate status
        const validStatuses = ['Pending', 'In Progress', 'Resolved', 'Escalated'];
        if (!validStatuses.includes(newStatus)) {
            return res.status(400).json({ success: false, message: 'Invalid status' });
        }

        // Ensure tracking record exists
        const [trackingCheck] = await db.query(`SELECT * FROM Compliance_Tracking WHERE Tracking_ID = ?`, [trackingId]);
        if (trackingCheck.length === 0) {
            return res.status(404).json({ success: false, message: 'Tracking record not found' });
        }

        // Perform the update with transaction
        await db.query('START TRANSACTION');

        try {
            const [updateResult] = await db.query(
                `UPDATE Compliance_Tracking SET Status = ?, Updated_At = NOW() WHERE Tracking_ID = ?`,
                [newStatus, trackingId]
            );

            if (updateResult.affectedRows === 0) {
                throw new Error('No rows affected - Update failed');
            }

            console.log(`Tracking ID ${trackingId} successfully updated to status: ${newStatus}`);

            // Commit transaction
            await db.query('COMMIT');

            // Fetch the updated status to send back to UI
            const [updatedRecord] = await db.query(
                `SELECT Status FROM Compliance_Tracking WHERE Tracking_ID = ?`,
                [trackingId]
            );

            res.json({
                success: true,
                message: 'Tracking status updated successfully',
                updatedStatus: updatedRecord[0].Status
            });
        } catch (transactionError) {
            await db.query('ROLLBACK');
            console.error('Transaction error:', transactionError);
            return res.status(500).json({ success: false, message: 'Failed to update tracking status' });
        }
    } catch (error) {
        console.error('Error updating tracking status:', error);
        res.status(500).json({ success: false, message: 'Failed to update tracking status' });
    }
};
