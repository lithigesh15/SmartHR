const db = require('../config/db');

exports.getDashboard = async (req, res) => {
    try {
        // Fetch employee relations cases (conflict management count)
        const [relationsResult] = await db.query(`SELECT COUNT(*) AS count FROM Conflict_Management`);
        const relationsCases = relationsResult[0]?.count || 0;

        // Fetch total employees
        const [employeeResult] = await db.query(`SELECT COUNT(*) AS count FROM Employee`);
        const totalEmployees = employeeResult[0]?.count || 0;

        // Fetch leave requests (pending and total)
        const [leaveResult] = await db.query(`
            SELECT 
                COUNT(*) AS totalLeaves, 
                SUM(CASE WHEN Permission_Status = 'Pending' THEN 1 ELSE 0 END) AS pendingLeaves
            FROM Leave_Request
        `);
        const totalLeaves = leaveResult[0]?.totalLeaves || 0;
        const pendingLeaves = leaveResult[0]?.pendingLeaves || 0;

        // Fetch performance goals (completed vs total)
        const [goalsResult] = await db.query(`
            SELECT 
                COUNT(*) AS totalGoals, 
                SUM(CASE WHEN Status = 'Completed' THEN 1 ELSE 0 END) AS completedGoals
            FROM Goals
        `);
        const totalGoals = goalsResult[0]?.totalGoals || 0;
        const completedGoals = goalsResult[0]?.completedGoals || 0;

        const stats = {
            relations: relationsCases,
            totalEmployees: totalEmployees,
            totalLeaves: totalLeaves,
            pendingLeaves: pendingLeaves,
            totalGoals: totalGoals,
            completedGoals: completedGoals
        };

        res.render('dashboard', {
            title: 'Dashboard - Smart HR',
            user: req.session.user,
            stats: stats
        });
    } catch (error) {
        console.error('Dashboard error:', error);
        res.status(500).render('error', { 
            message: 'Error loading dashboard', 
            error: process.env.NODE_ENV === 'development' ? error : {} 
        });
    }
};
