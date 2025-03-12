const db = require('../config/db');

// 📌 Get Compliance Dashboard
exports.getCompliancePage = (req, res) => {
    res.render('modules/compliance/compliance', {
        title: 'Compliance - Smart HR',
        user: req.session.user
    });
};

// 📌 Get Policy Repository
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

// 📌 Create a New Policy
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

// 📌 Delete a Policy
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

// 📌 Get Compliance Notifications & Tracking Page
exports.getNotificationsPage = async (req, res) => {
    try {
        const [notifications] = await db.query(`
            SELECT n.Notification_ID, n.Department_ID, n.Compliance_Issue, d.Department_Name
            FROM Compliance_Notifications n
            JOIN Department d ON n.Department_ID = d.Department_ID
            ORDER BY n.Created_At DESC
        `);

        const [tracking] = await db.query(`
            SELECT t.Tracking_ID, t.Notification_ID, n.Compliance_Issue, t.Status
            FROM Compliance_Tracking t
            JOIN Compliance_Notifications n ON t.Notification_ID = n.Notification_ID
            ORDER BY t.Updated_At DESC
        `);

        console.log("✅ Notifications:", notifications);
        console.log("✅ Tracking:", tracking);

        res.render('modules/compliance/notification', {
            title: 'Compliance Notifications - Smart HR',
            user: req.session.user,
            notifications: notifications || [],
            tracking: tracking || []
        });
    } catch (error) {
        console.error('❌ Error fetching notifications:', error);
        res.status(500).render('error', { message: 'Failed to load compliance notifications' });
    }
};

exports.saveNotificationToTracking = async (req, res) => {
    try {
        const { notificationId } = req.body;

        console.log(`🔹 Received request to save Notification_ID: ${notificationId}`);

        // 1️⃣ Ensure `notificationId` is valid
        if (!notificationId) {
            console.error('❌ Notification ID is missing or invalid.');
            return res.status(400).json({ success: false, message: 'Invalid notification ID' });
        }

        // 2️⃣ Check if the notification exists in Compliance_Notifications
        const [existingNotification] = await db.query(
            `SELECT * FROM Compliance_Notifications WHERE Notification_ID = ?`,
            [notificationId]
        );

        if (existingNotification.length === 0) {
            console.error('❌ Notification not found in Compliance_Notifications');
            return res.status(404).json({ success: false, message: 'Notification not found' });
        }

        console.log(`✅ Found Notification: ${JSON.stringify(existingNotification[0])}`);

        // 3️⃣ Insert the notification into Compliance_Tracking
        const insertQuery = `
            INSERT INTO Compliance_Tracking (Notification_ID, Status, Updated_At)
            VALUES (?, 'Pending', NOW())
        `;
        const [insertResult] = await db.query(insertQuery, [notificationId]);

        if (!insertResult.affectedRows) {
            console.error('❌ Failed to insert into Compliance_Tracking');
            return res.status(500).json({ success: false, message: 'Failed to insert into tracking' });
        }

        console.log(`✅ Inserted into Compliance_Tracking with Tracking_ID: ${insertResult.insertId}`);

        // 4️⃣ Delete the notification from Compliance_Notifications
        const deleteQuery = `DELETE FROM Compliance_Notifications WHERE Notification_ID = ?`;
        const [deleteResult] = await db.query(deleteQuery, [notificationId]);

        if (!deleteResult.affectedRows) {
            console.error('❌ Failed to delete from Compliance_Notifications');
            return res.status(500).json({ success: false, message: 'Failed to delete notification' });
        }

        console.log(`✅ Deleted from Compliance_Notifications with Notification_ID: ${notificationId}`);

        // ✅ Redirect to tracking page
        res.json({ success: true, redirect: '/compliance/notification#tracking-section' });
    } catch (error) {
        console.error('❌ Error saving notification to tracking:', error);
        res.status(500).json({ success: false, message: 'Failed to save notification' });
    }
};


// 📌 Remove Notification (✅ Fixed Logic)
exports.deleteNotification = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if notification exists before deleting
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

// 📌 Update Tracking Status
exports.updateTrackingStatus = async (req, res) => {
    try {
        const { trackingId, newStatus } = req.body;
        await db.query(`UPDATE Compliance_Tracking SET Status = ? WHERE Tracking_ID = ?`, [newStatus, trackingId]);
        res.json({ success: true });
    } catch (error) {
        console.error('Error updating tracking status:', error);
        res.status(500).json({ success: false, message: 'Failed to update status' });
    }
};
