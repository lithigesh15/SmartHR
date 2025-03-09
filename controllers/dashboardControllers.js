/**
 * Dashboard controller
 * Handles dashboard-related functionality
 */

// Display the dashboard page
exports.getDashboard = async (req, res) => {
    try {
        // You can fetch any user-specific data here
        // For now, we'll just render the dashboard
        res.render('dashboard', {
            user: req.user, // Pass authenticated user data to the view
            title: 'Dashboard - Smart HR'
        });
    } catch (error) {
        console.error('Dashboard error:', error);
        res.status(500).render('error', { 
            message: 'Error loading dashboard', 
            error: process.env.NODE_ENV === 'development' ? error : {} 
        });
    }
};

// Future methods for dashboard data can be added here
exports.getDashboardStats = async (req, res) => {
    // This would fetch real-time statistics for the dashboard
    // For now, returns dummy data
    try {
        const stats = {
            attendance: { value: "92/99", change: "+2.1%" },
            projects: { value: "90/94", change: "-2.1%" },
            clients: { value: "69/86", change: "-11.2%" },
            tasks: { value: "25/28", change: "+11.2%" }
        };
        
        res.json(stats);
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({ error: 'Failed to fetch dashboard statistics' });
    }
};