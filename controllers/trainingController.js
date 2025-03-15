const db = require('../config/db');

exports.getTrainingPrograms = async (req, res) => {
    try {
        const [courses] = await db.query('SELECT * FROM Courses');
        res.render('modules/training/training', { 
            title: 'Training Courses - Smart HR',
            user: req.session.user,  
            courses 
        });
    } catch (error) {
        console.error('Error fetching training courses:', error);
        res.status(500).json({ success: false, message: 'Failed to load training courses' });
    }
};

exports.addCourse = async (req, res) => {
    try {
        const { title, description, instructor, category, duration } = req.body;

        if (!title || !description || !instructor || !category || !duration) {
            return res.status(400).json({ success: false, message: 'All fields are required.' });
        }

        const query = `INSERT INTO Courses (Course_Title, Course_Description, Instructor, Category, Duration) VALUES (?, ?, ?, ?, ?)`;
        await db.query(query, [title, description, instructor, category, duration]);

        res.json({ success: true, message: 'Course added successfully' });
    } catch (error) {
        console.error('Error adding course:', error);
        res.status(500).json({ success: false, message: 'Failed to add course' });
    }
};

exports.deleteCourse = async (req, res) => {
    try {
        const { courseId } = req.params;

        // Check if course exists
        const [course] = await db.query('SELECT * FROM Courses WHERE Course_ID = ?', [courseId]);
        if (course.length === 0) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }

        // Delete the course
        await db.query('DELETE FROM Courses WHERE Course_ID = ?', [courseId]);

        res.json({ success: true, message: 'Course deleted successfully' });
    } catch (error) {
        console.error('Error deleting course:', error);
        res.status(500).json({ success: false, message: 'Failed to delete course' });
    }
};
