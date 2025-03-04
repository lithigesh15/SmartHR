const db = require('../config/db');

exports.getTrainingPrograms = async (req, res) => {
  try {
    // Use the promise pool to query courses
    const [courses] = await db.query('SELECT * FROM Courses');
    
    res.render('modules/training/index', {
      title: 'Training Programs - Smart HR',
      user: req.session.user,
      courses: courses
    });
  } catch (error) {
    console.error('Error loading training programs:', error);
    res.status(500).render('error', {
      title: 'Error',
      message: 'Failed to load training programs',
      error: error
    });
  }
};

exports.addCourse = async (req, res) => {
  try {
    const { courseTitle, courseDescription, courseCategory, courseDuration } = req.body;
    
    const query = 'INSERT INTO Courses (Course_Title, Course_Description, Category, Duration) VALUES (?, ?, ?, ?)';
    const values = [courseTitle, courseDescription, courseCategory, courseDuration];
    
    const [result] = await db.query(query, values);
    
    res.json({
      success: true,
      courseId: result.insertId,
      message: 'Course added successfully'
    });
  } catch (error) {
    console.error('Error adding course:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add course'
    });
  }
};

exports.enrollCourse = async (req, res) => {
  try {
    const { employeeId, courseId } = req.body;
    
    // First, check if employee exists
    const [employeeCheck] = await db.query('SELECT * FROM Employee WHERE Employee_ID = ?', [employeeId]);
    
    if (employeeCheck.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Employee not found'
      });
    }
    
    // Check if course exists
    const [courseCheck] = await db.query('SELECT * FROM Courses WHERE Course_ID = ?', [courseId]);
    
    if (courseCheck.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Course not found'
      });
    }
    
    // Check if employee is already enrolled
    const [enrollmentCheck] = await db.query(
      'SELECT * FROM Employee_Training WHERE Employee_ID = ? AND Training_ID = ?', 
      [employeeId, courseId]
    );
    
    if (enrollmentCheck.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Employee is already enrolled in this course'
      });
    }
    
    // Insert into Employee_Training
    const query = `
      INSERT INTO Employee_Training 
      (Employee_ID, Training_ID, Completion_Status) 
      VALUES (?, ?, false)
    `;
    
    const [result] = await db.query(query, [employeeId, courseId]);
    
    res.json({
      success: true,
      message: 'Successfully enrolled in the course'
    });
  } catch (error) {
    console.error('Error enrolling in course:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to enroll in course',
      error: error.message
    });
  }
};