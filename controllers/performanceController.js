const db = require('../config/db');

// Show Performance Home Page
exports.showPerformanceHome = (req, res) => {
    res.render('modules/performance/performance', {  
        title: 'Performance - Smart HR',
        user: req.session.user
    });
};

// Show Goal Setting Page
exports.showGoalPage = (req, res) => {
    res.render('modules/performance/create_goal', { 
        title: 'Goal Setting - Smart HR',
        user: req.session.user
    });
};

// Save Goal
// Save Goal
exports.saveGoal = async (req, res) => {  
    try {
        const { title, description, deadline, status } = req.body;

        // Validate input fields
        if (!title || !description || !deadline || !status) {
            return res.status(400).json({ success: false, message: 'All fields are required.' });
        }

        // Validate deadline (must be in the future)
        const today = new Date().toISOString().split("T")[0];
        if (deadline < today) {
            return res.status(400).json({ success: false, message: 'Deadline must be in the future.' });
        }

        // Insert goal into the database
        await db.query(
            `INSERT INTO Goals (Title, Description, Deadline, Status) VALUES (?, ?, ?, ?)`,
            [title, description, deadline, status]
        );

        res.status(201).json({ success: true, message: 'Goal saved successfully!' });
    } catch (error) {
        console.error('Error saving goal:', error);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
};


// Fetch All Goals
exports.getGoals = async (req, res) => {
    try {
        const [goals] = await db.query(
            `SELECT Goal_ID, Title, Description, Deadline, Status, Created_At 
             FROM Goals 
             ORDER BY Status DESC, Deadline ASC`
        );

        res.json(goals);
    } catch (error) {
        console.error('Error fetching goals:', error);
        res.status(500).json({ success: false, message: 'Failed to load goals' });
    }
};

// Update Goal Status
exports.updateGoalStatus = async (req, res) => {
    try {
        const { goalId, status } = req.body;

        // Validate inputs
        if (!goalId || !status) {
            return res.status(400).json({ success: false, message: 'Goal ID and status are required.' });
        }

        // Update goal status in the database
        const [result] = await db.query(`UPDATE Goals SET Status = ? WHERE Goal_ID = ?`, [status, goalId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Goal not found.' });
        }

        res.json({ success: true, message: 'Goal status updated successfully.' });
    } catch (error) {
        console.error('Error updating goal status:', error);
        res.status(500).json({ success: false, message: 'Failed to update goal status.' });
    }
};

// Delete a Goal
exports.deleteGoal = async (req, res) => {
    try {
        const { goalId } = req.params;

        // Delete goal from the database
        const [result] = await db.query(`DELETE FROM Goals WHERE Goal_ID = ?`, [goalId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Goal not found.' });
        }

        res.json({ success: true, message: `Goal with ID ${goalId} deleted successfully.` });
    } catch (error) {
        console.error('Error deleting goal:', error);
        res.status(500).json({ success: false, message: 'Failed to delete goal.' });
    }
};


exports.showGoalTrackingPage = async (req, res) => {
    try {
        const [goals] = await db.query("SELECT * FROM Goals ORDER BY Status DESC, Deadline ASC");
        res.render("modules/performance/goal_tracking", { title: "Goal Tracking - Smart HR", user: req.session.user, goals });
    } catch (error) {
        console.error("Error fetching goals:", error);
        res.status(500).send("Failed to load goals.");
    }
};

// Show Appraisal Page
exports.showAppraisalPage = (req, res) => {
    res.render('modules/performance/appraisal', { 
        title: 'Employee Appraisal - Smart HR',
        user: req.session.user
    });
};

// Save Appraisal
exports.saveAppraisal = async (req, res) => {
    try {
        const { employeeId, kpi, rating, comments } = req.body;

        if (!employeeId || !kpi || !rating || rating < 1 || rating > 5 || !comments) {
            return res.status(400).json({ success: false, message: 'All fields are required and rating must be between 1-5.' });
        }

        await db.query(
            `INSERT INTO Performance (Employee_ID, KPIs, Review_Date, Appraisal, Comments) 
             VALUES (?, ?, NOW(), ?, ?)`,
            [employeeId, kpi, rating, comments]
        );

        res.status(201).json({ success: true, message: 'Appraisal saved successfully!' });
    } catch (error) {
        console.error('Error saving appraisal:', error);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
};

// Fetch Appraisals
exports.getAppraisals = async (req, res) => {
    try {
        const [appraisals] = await db.query(
            `SELECT Performance_ID, Employee_ID, KPIs, Review_Date, Appraisal, Comments 
             FROM Performance 
             ORDER BY Review_Date DESC`
        );

        res.json(appraisals);
    } catch (error) {
        console.error('Error fetching appraisals:', error);
        res.status(500).json({ success: false, message: 'Failed to load appraisals' });
    }
};


// Show Appraisal Manager Page
exports.showAppraisalManagerPage = async (req, res) => {
    try {
        const [appraisals] = await db.query(
            `SELECT Performance_ID, Employee_ID, KPIs, Review_Date, Appraisal, Comments 
             FROM Performance 
             ORDER BY Review_Date DESC`
        );

        res.render('modules/performance/appraisal_tracking', { 
            title: 'Appraisal Tracking - Smart HR',
            user: req.session.user,
            appraisals
        });
    } catch (error) {
        console.error('Error fetching appraisals:', error);
        res.status(500).render('error', { message: 'Failed to load appraisals' });
    }
};
