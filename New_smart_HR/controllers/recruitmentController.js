const db = require('../config/db');

// Main recruitment page
exports.getRecruitmentDashboard = (req, res) => {
  res.render('../views/modules/recruitment/recruitment', {
    title: 'Recruitment - Smart HR',
    user: req.session.user
  });
};

// Job Postings
exports.getJobPostings = async (req, res) => {
  try {
    // Using db directly since it's already a promise-based client
    const [jobPostings] = await db.query('SELECT * FROM Job_Posting');
    res.render('modules/recruitment/job_postings', {
      title: 'Job Postings - Smart HR',
      user: req.session.user,
      jobPostings
    });
  } catch (error) {
    console.error('Error fetching job postings:', error);
    res.status(500).render('error', {
      title: 'Error',
      message: 'Failed to load job postings',
      error: {}
    });
  }
};

exports.createJobPosting = async (req, res) => {
  try {
    const { job_title, description, qualification, type } = req.body;
    const [result] = await db.query(
      'INSERT INTO Job_Posting (Job_Title, Job_Description, Qualifications, Job_Type, Posted_Date) VALUES (?, ?, ?, ?, CURDATE())',
      [job_title, description, qualification, type]
    );
    res.status(201).json({ message: 'Job posting created successfully' });
  } catch (error) {
    console.error('Error creating job posting:', error);
    res.status(500).json({ message: 'Failed to create job posting' });
  }
};



// Application Tracking
exports.getApplicationTracking = async (req, res) => {
  try {
    // Get all applicants for initial load (optional)
    const [applicants] = await db.query(`
      SELECT 
        Applicant_ID, 
        Applied_Job_ID, 
        Name, 
        Email, 
        Experience, 
        Interview_Scheduled_Status,
        Interview_Date,
        Interviewer
      FROM Applicant
      LIMIT 20
    `);
    
    res.render('modules/recruitment/application_tracking', {
      title: 'Application Tracking - Smart HR',
      user: req.session.user,
      applicants: applicants
    });
  } catch (error) {
    console.error('Error loading application tracking:', error);
    res.status(500).render('error', {
      title: 'Error',
      message: 'Failed to load application tracking',
      error: {}
    });
  }
};

exports.searchApplicants = async (req, res) => {
  try {
    const { searchCriteria, searchInput } = req.query;
    let sqlQuery = `
      SELECT 
        Applicant_ID, 
        Applied_Job_ID, 
        Name, 
        Email, 
        Experience, 
        Interview_Scheduled_Status,
        Interview_Date,
        Interviewer
      FROM Applicant WHERE 1=1
    `;
    let params = [];
    
    if (searchCriteria === 'name' && searchInput) {
      sqlQuery += ' AND Name LIKE ?';
      params.push(`%${searchInput}%`);
    } else if (searchCriteria === 'email' && searchInput) {
      sqlQuery += ' AND Email LIKE ?';
      params.push(`%${searchInput}%`);
    } else if (searchCriteria === 'experience' && searchInput) {
      sqlQuery += ' AND Experience LIKE ?';
      params.push(`%${searchInput}%`);
    } else if (searchCriteria === 'interviewStatus' && searchInput) {
      // Convert text to binary for interview status
      const statusValue = searchInput.toLowerCase().includes('scheduled') ? 1 : 0;
      sqlQuery += ' AND Interview_Scheduled_Status = ?';
      params.push(statusValue);
    }
    
    const [applicants] = await db.query(sqlQuery, params);
    res.json(applicants);
  } catch (error) {
    console.error('Error searching applicants:', error);
    res.status(500).json({ message: 'Error searching applicants' });
  }
};

// Get applicant details
exports.getApplicantDetails = async (req, res) => {
  try {
    const applicantId = req.params.id;
    
    // Get applicant details
    const [applicant] = await db.query(`
      SELECT 
        a.*, 
        j.Job_Title,
        j.Job_Description,
        j.Job_Type
      FROM 
        Applicant a
      LEFT JOIN 
        Job_Posting j ON a.Applied_Job_ID = j.Job_ID
      WHERE 
        a.Applicant_ID = ?
    `, [applicantId]);
    
    if (applicant.length === 0) {
      return res.status(404).render('error', {
        title: 'Error',
        message: 'Applicant not found',
        error: {}
      });
    }
    
    res.render('modules/recruitment/applicant_details', {
      title: 'Applicant Details - Smart HR',
      user: req.session.user,
      applicant: applicant[0]
    });
  } catch (error) {
    console.error('Error getting applicant details:', error);
    res.status(500).render('error', {
      title: 'Error',
      message: 'Failed to load applicant details',
      error: {}
    });
  }
};

// Interview Scheduling
exports.getInterviewScheduling = async (req, res) => {
  try {
    // Get applicantId from query parameters if provided
    const { applicantId } = req.query;
    
    const [departments] = await db.query('SELECT * FROM Department');
    res.render('modules/recruitment/interview_scheduling', {
      title: 'Interview Scheduling - Smart HR',
      user: req.session.user,
      departments,
      applicantId // Pass applicantId to the view
    });
  } catch (error) {
    console.error('Error loading interview scheduling:', error);
    res.status(500).render('error', {
      title: 'Error',
      message: 'Failed to load interview scheduling',
      error: {}
    });
  }
};

// Schedule interview
exports.scheduleInterview = async (req, res) => {
  try {
    const { applicantId, interviewDate, interviewer } = req.body;
    
    // Update the applicant with interview details
    await db.query(`
      UPDATE Applicant 
      SET 
        Interview_Scheduled_Status = 1,
        Interview_Date = ?,
        Interviewer = ?
      WHERE 
        Applicant_ID = ?
    `, [interviewDate, interviewer, applicantId]);
    
    res.json({ success: true, message: 'Interview scheduled successfully' });
  } catch (error) {
    console.error('Error scheduling interview:', error);
    res.status(500).json({ success: false, message: 'Failed to schedule interview' });
  }
};

// Search interviews - Modified to work without direct Department_ID in Job_Posting
exports.searchInterviews = async (req, res) => {
  try {
    const { job_title, interview_date } = req.query;
    
    console.log('Search parameters:', { job_title, interview_date }); // Debug log
    
    let sqlQuery = `
      SELECT 
        a.Applicant_ID, 
        a.Name, 
        a.Email, 
        a.Experience, 
        a.Interview_Date,
        a.Interviewer,
        j.Job_Title
      FROM 
        Applicant a
      JOIN 
        Job_Posting j ON a.Applied_Job_ID = j.Job_ID
      WHERE 
        a.Interview_Scheduled_Status = 1
    `;
    
    let params = [];
    
    if (job_title && job_title.trim() !== '') {
      sqlQuery += ' AND j.Job_Title LIKE ?';
      params.push(`%${job_title}%`);
    }
    
    if (interview_date && interview_date.trim() !== '') {
      sqlQuery += ' AND DATE(a.Interview_Date) = ?';
      params.push(interview_date);
    }
    
    console.log('SQL Query:', sqlQuery); // Debug log
    console.log('Parameters:', params); // Debug log
    
    const [interviews] = await db.query(sqlQuery, params);
    
    // Add department information after the main query
    // Since we don't have direct relationship, we'll add a placeholder value
    interviews.forEach(interview => {
      // Add a default department or look it up based on other data
      // This is a workaround since we don't have the actual relationship in DB
      interview.Department_Name = getDepartmentNameForJob(interview.Job_Title);
    });
    
    console.log('Query results:', interviews.length, 'interviews found'); // Debug log
    
    res.json(interviews);
  } catch (error) {
    console.error('Error searching interviews:', error);
    res.status(500).json({ message: 'Error searching interviews' });
  }
};

// Helper function to determine department based on job title
function getDepartmentNameForJob(jobTitle) {
  // Map common job titles to departments based on naming conventions
  const jobMap = {
    'Software Engineer': 'Engineering',
    'Developer': 'Engineering',
    'HR': 'Human Resources',
    'Human Resources': 'Human Resources',
    'Finance': 'Finance',
    'Accountant': 'Finance',
    'Marketing': 'Marketing',
    'Sales': 'Sales',
    'Network': 'IT Support',
    'IT': 'IT Support',
    'Legal': 'Legal',
    'Procurement': 'Procurement',
    'Research': 'R&D',
    'Scientist': 'R&D',
    'Operations': 'Operations'
  };
  
  // Check if job title contains any of our mapping keywords
  for (const [keyword, department] of Object.entries(jobMap)) {
    if (jobTitle.toLowerCase().includes(keyword.toLowerCase())) {
      return department;
    }
  }
  
  // Default department if no match found
  return 'General';
}

// Onboarding
exports.getOnboarding = async (req, res) => {
  try {
    // Fetch departments
    const [departments] = await db.query('SELECT * FROM Department');
    
    // Fetch recent onboardings for display
    const [recentOnboardings] = await db.query(`
      SELECT 
        e.Employee_ID,
        a.Name,
        a.Email,
        d.Department_Name,
        e.Hired_Salary,
        e.Joining_Date
      FROM 
        Employee e
      JOIN 
        Applicant a ON e.Applicant_ID = a.Applicant_ID
      JOIN 
        Department d ON e.Department_ID = d.Department_ID
      ORDER BY 
        e.Joining_Date DESC
      LIMIT 10
    `);
    
    res.render('modules/recruitment/onboarding', {
      title: 'Onboarding - Smart HR',
      user: req.session.user,
      departments,
      recentOnboardings
    });
  } catch (error) {
    console.error('Error loading onboarding:', error);
    res.status(500).render('error', {
      title: 'Error',
      message: 'Failed to load onboarding',
      error: {}
    });
  }
};

exports.onboardEmployee = async (req, res) => {
  try {
    const { applicantID, department, salary } = req.body;
    
    // First, get the applicant details
    const [applicants] = await db.query('SELECT * FROM Applicant WHERE Applicant_ID = ?', [applicantID]);
    
    if (!applicants || applicants.length === 0) {
      return res.status(404).json({ message: 'Applicant not found' });
    }
    
    // Insert into Employee table
    await db.query(
      'INSERT INTO Employee (Applicant_ID, Department_ID, Hired_Salary, Joining_Date) VALUES (?, ?, ?, CURDATE())',
      [applicantID, department, salary]
    );
    
    res.status(200).json({ message: 'Employee onboarded successfully' });
  } catch (error) {
    console.error('Error onboarding employee:', error);
    res.status(500).json({ message: 'Failed to onboard employee' });
  }
};

// Update Job Posting
exports.updateJobPosting = async (req, res) => {
  try {
      const { job_id, job_title, description, qualification, type } = req.body;

      await db.query(
          `UPDATE Job_Posting 
          SET Job_Title = ?, Job_Description = ?, Qualifications = ?, Job_Type = ? 
          WHERE Job_ID = ?`,
          [job_title, description, qualification, type, job_id]
      );

      res.status(200).json({ success: true, message: 'Job posting updated successfully' });
  } catch (error) {
      console.error('Error updating job posting:', error);
      res.status(500).json({ success: false, message: 'Failed to update job posting' });
  }
};

// Delete Job Posting
exports.deleteJobPosting = async (req, res) => {
  try {
      const jobId = req.params.id;

      // Check if there are applicants linked to the job posting
      const [applicants] = await db.query('SELECT * FROM Applicant WHERE Applied_Job_ID = ?', [jobId]);

      if (applicants.length > 0) {
          return res.status(400).json({ 
              success: false, 
              message: 'Cannot delete job posting. Applicants are linked to this job.' 
          });
      }

      // If no applicants are found, proceed with deletion
      await db.query('DELETE FROM Job_Posting WHERE Job_ID = ?', [jobId]);
      res.status(200).json({ success: true, message: 'Job posting deleted successfully.' });

  } catch (error) {
      console.error('Error deleting job posting:', error);
      res.status(500).json({ success: false, message: 'Failed to delete job posting.' });
  }
};

exports.getJobById = async (req, res) => {
  try {
      const jobId = req.params.id;
      const [job] = await db.query('SELECT * FROM Job_Posting WHERE Job_ID = ?', [jobId]);

      if (job.length > 0) {
          res.json(job[0]); // Send the job details as JSON
      } else {
          res.status(404).json({ message: 'Job not found' });
      }
  } catch (error) {
      console.error('Error fetching job details:', error);
      res.status(500).json({ message: 'Failed to fetch job details' });
  }
};
