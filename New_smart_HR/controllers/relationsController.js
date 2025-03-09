const db = require('../config/db');

// Main relations dashboard
exports.getRelationsDashboard = (req, res) => {
  res.render('../views/modules/relations/relations', {
    title: 'Employee Relations - Smart HR',
    user: req.session.user
  });
};

// Create a Conflict
exports.createConflict = (req, res) => {
    const { employeeIDs, conflictType, status } = req.body;

    if (!employeeIDs || !conflictType) {
        return res.status(400).send("Missing required fields: Employee IDs or Conflict Type.");
    }

    db.query(
        'INSERT INTO Conflict_Management (Conflict_Type, Status) VALUES (?, ?)',
        [conflictType, status || 'Pending'],
        (err, result) => {
            if (err) {
                console.error("Error inserting conflict:", err);
                return res.status(500).send("Error inserting conflict.");
            }

            const conflictID = result.insertId;
            const employeeArray = employeeIDs.split(',')
                .map(id => parseInt(id.trim()))
                .filter(id => !isNaN(id))
                .map(id => [conflictID, id]);

            if (employeeArray.length === 0) {
                return res.redirect('/relations/conflict-management'); // No employees, just redirect
            }

            db.query(
                'INSERT INTO Conflict_Employees (Conflict_ID, Employee_ID) VALUES ?',
                [employeeArray],
                (err, result) => {
                    if (err) {
                        console.error("Error mapping employees to conflict:", err);
                        return res.status(500).send("Error mapping employees.");
                    }
                    res.redirect('/relations/conflict-management');
                }
            );
        }
    );
};

// Retrieve Conflict Management Data
exports.getConflictManagement = async (req, res) => {
    try {
        const sql = `
            SELECT cm.Conflict_ID, 
                   IFNULL(GROUP_CONCAT(ce.Employee_ID ORDER BY ce.Employee_ID SEPARATOR ', '), 'N/A') AS Employee_IDs, 
                   cm.Conflict_Type, 
                   cm.Status
            FROM Conflict_Management cm
            LEFT JOIN Conflict_Employees ce ON cm.Conflict_ID = ce.Conflict_ID
            GROUP BY cm.Conflict_ID
        `;

        const [results] = await db.query(sql); // ✅ Use `await` with the query
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

// Update Conflict Status
exports.updateConflictStatus = (req, res) => {
    const { conflictID, newStatus } = req.body;

    db.query(
        'UPDATE Conflict_Management SET Status = ? WHERE Conflict_ID = ?',
        [newStatus, conflictID],
        (err, result) => {
            if (err) {
                console.error("Error updating status:", err);
                return res.status(500).json({ message: "Update failed" });
            }
            res.json({ message: "Status updated successfully" });
        }
    );
};

// Delete Conflict
exports.deleteConflict = (req, res) => {
    const conflictID = req.params.id;

    db.query('DELETE FROM Conflict_Management WHERE Conflict_ID = ?', [conflictID], (err, result) => {
        if (err) {
            console.error("Error deleting conflict:", err);
            return res.status(500).send("Deletion failed");
        }
        res.redirect('/relations/conflict-management');
    });
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
