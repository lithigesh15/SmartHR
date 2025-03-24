const db = require('../config/db');

// Main relations dashboard
exports.getRelationsDashboard = (req, res) => {
  res.render('../views/modules/relations/relations', {
    title: 'Employee Relations - Smart HR',
    user: req.session.user
  });
};

// ✅ Get Conflict Management Page
exports.getConflictManagement = async (req, res) => {
    try {
        const sql = `
            SELECT cm.Conflict_ID, 
                   IFNULL(GROUP_CONCAT(ce.Employee_ID ORDER BY ce.Employee_ID SEPARATOR ', '), 'N/A') AS Employee_IDs, 
                   cm.Conflict_Type, 
                   cm.Status
            FROM Conflict_Management cm
            LEFT JOIN Conflict_Employees ce ON cm.Conflict_ID = ce.Conflict_ID
            GROUP BY cm.Conflict_ID;
        `;

        const [results] = await db.query(sql);
        res.render('../views/modules/relations/conflicts', {
            title: 'Conflict Management - Smart HR',
            user: req.session.user,
            conflicts: results
        });
    } catch (err) {
        console.error("Error fetching conflicts:", err);
        res.status(500).send("Database Error.");
    }
};

// ✅ Create a Conflict
exports.createConflict = async (req, res) => {
    const { employeeIDs, conflictType, status } = req.body;

    if (!employeeIDs || !conflictType) {
        return res.status(400).send("Missing required fields: Employee IDs or Conflict Type.");
    }

    try {
        const [result] = await db.query(
            'INSERT INTO Conflict_Management (Conflict_Type, Status) VALUES (?, ?)',
            [conflictType, status || 'Pending']
        );

        const conflictID = result.insertId;
        const employeeArray = employeeIDs.split(',')
            .map(id => parseInt(id.trim()))
            .filter(id => !isNaN(id))
            .map(id => [conflictID, id]);

        if (employeeArray.length > 0) {
            await db.query('INSERT INTO Conflict_Employees (Conflict_ID, Employee_ID) VALUES ?', [employeeArray]);
        }

        res.redirect('/relations/conflict-management');
    } catch (err) {
        console.error("Error inserting conflict:", err);
        res.status(500).send("Error inserting conflict.");
    }
};

// ✅ Update Conflict Status
exports.updateConflictStatus = async (req, res) => {
    try {
        console.log("📌 Received update request:", req.body); // Debug log

        const { conflictID, newStatus } = req.body;

        if (!conflictID || !newStatus) {
            console.log("❌ Missing required fields");
            return res.status(400).json({ success: false, message: "Missing required fields." });
        }

        console.log("✅ Valid data received:", conflictID, newStatus);

        const conflictIDInt = parseInt(conflictID, 10);

        const [result] = await db.query(
            'UPDATE Conflict_Management SET Status = ? WHERE Conflict_ID = ?',
            [newStatus, conflictIDInt]
        );

        console.log("🛠 SQL Query Result:", result);

        if (result.affectedRows === 0) {
            console.log("⚠ Conflict not found or already set to the same status.");
            return res.status(404).json({ success: false, message: "Conflict not found or already set." });
        }

        console.log("✅ Status updated successfully.");
        res.json({ success: true, message: "Status updated successfully." });

    } catch (err) {
        console.error("❌ Error updating conflict status:", err);
        res.status(500).json({ success: false, message: "Update failed." });
    }
};

// ✅ Delete a Conflict (Fixed)
exports.deleteConflict = async (req, res) => {
    const { id } = req.params;

    try {
        const conflictID = parseInt(id, 10);

        if (isNaN(conflictID)) {
            return res.status(400).json({ success: false, message: "Invalid Conflict ID." });
        }

        const [result] = await db.query('DELETE FROM Conflict_Management WHERE Conflict_ID = ?', [conflictID]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Conflict not found." });
        }

        res.json({ success: true, message: "Conflict deleted successfully." });
    } catch (err) {
        console.error("❌ Error deleting conflict:", err);
        res.status(500).json({ success: false, message: "Deletion failed due to server error." });
    }
};





// Get all engagement activities
exports.getEngagementActivities = async (req, res) => {
    try {
        const [results] = await db.query('SELECT * FROM Engagement_Activities ORDER BY Activity_Date ASC');
        res.render('../views/modules/relations/engagement_activities', {
            title: 'Engagement Activities - Smart HR',
            user: req.session.user,
            activities: results
        });
    } catch (err) {
        console.error("Error fetching engagement activities:", err);
        res.status(500).send("Database Error.");
    }
};

// Create a new engagement activity
exports.createEngagementActivity = async (req, res) => {
    try {
        const { activityName, description, activityType, activityDate } = req.body;

        if (!activityName || !description || !activityType || !activityDate) {
            return res.status(400).send("Missing required fields.");
        }

        await db.query(
            'INSERT INTO Engagement_Activities (Activity_Name, Description, Activity_Type, Activity_Date) VALUES (?, ?, ?, ?)',
            [activityName, description, activityType, activityDate]
        );

        res.redirect('/relations/engagement-activities');
    } catch (err) {
        console.error("Error inserting engagement activity:", err);
        res.status(500).send("Error inserting engagement activity.");
    }
};

// Update engagement activity status
exports.updateEngagementActivity = async (req, res) => {
    try {
        const { id } = req.params;
        const { newStatus } = req.body;

        await db.query('UPDATE Engagement_Activities SET Status = ? WHERE Activity_ID = ?', [newStatus, id]);

        res.json({ message: "Status updated successfully" });
    } catch (err) {
        console.error("Error updating engagement activity:", err);
        res.status(500).json({ message: "Update failed" });
    }
};

// Delete an engagement activity
exports.deleteEngagementActivity = async (req, res) => {
    try {
        const { id } = req.params;

        await db.query('DELETE FROM Engagement_Activities WHERE Activity_ID = ?', [id]);

        res.redirect('/relations/engagement-activities');
    } catch (err) {
        console.error("Error deleting engagement activity:", err);
        res.status(500).send("Deletion failed");
    }
};

// Get all surveys
exports.getSurveys = async (req, res) => {
    try {
        const [results] = await db.query('SELECT * FROM Surveys ORDER BY Expiry_Date ASC');
        res.render('../views/modules/relations/survey', {
            title: 'Surveys - Smart HR',
            user: req.session.user,
            surveys: results
        });
    } catch (err) {
        console.error("Error fetching surveys:", err);
        res.status(500).send("Database Error.");
    }
};

// Create a new survey
exports.createSurvey = async (req, res) => {
    try {
        const { surveyTitle, description, surveyType, expiryDate } = req.body;

        if (!surveyTitle || !description || !surveyType || !expiryDate) {
            return res.status(400).send("Missing required fields.");
        }

        await db.query(
            'INSERT INTO Surveys (Survey_Title, Description, Survey_Type, Expiry_Date) VALUES (?, ?, ?, ?)',
            [surveyTitle, description, surveyType, expiryDate]
        );

        res.redirect('/relations/surveys');
    } catch (err) {
        console.error("Error inserting survey:", err);
        res.status(500).send("Error inserting survey.");
    }
};

// Update survey status
exports.updateSurvey = async (req, res) => {
    try {
        const { id } = req.params;
        const { newStatus } = req.body;

        await db.query('UPDATE Surveys SET Status = ? WHERE Survey_ID = ?', [newStatus, id]);

        res.json({ message: "Status updated successfully" });
    } catch (err) {
        console.error("Error updating survey:", err);
        res.status(500).json({ message: "Update failed" });
    }
};

// Delete a survey
exports.deleteSurvey = async (req, res) => {
    try {
        const { id } = req.params;

        await db.query('DELETE FROM Surveys WHERE Survey_ID = ?', [id]);

        res.redirect('/relations/surveys');
    } catch (err) {
        console.error("Error deleting survey:", err);
        res.status(500).send("Deletion failed");
    }
};
