USE HR_Management;

-- Create the tables

-- Employee Table
CREATE TABLE Employee (
    Employee_ID INT PRIMARY KEY AUTO_INCREMENT,
    Applicant_ID INT,
    Department_ID INT,
    Hired_Salary DECIMAL(10, 2),
    Joining_Date DATE,
    FOREIGN KEY (Applicant_ID) REFERENCES Applicant(Applicant_ID),
    FOREIGN KEY (Department_ID) REFERENCES Department(Department_ID)
);

-- Department Table
CREATE TABLE Department (
    Department_ID INT PRIMARY KEY AUTO_INCREMENT,
    Manager_ID INT,
    Department_Name VARCHAR(100)
);

-- Payroll Table
CREATE TABLE Payroll (
    Payroll_ID INT PRIMARY KEY AUTO_INCREMENT,
    Employee_ID INT,
    Basic_Pay DECIMAL(10, 2),
    Allowances DECIMAL(10, 2),
    PF_Deductions DECIMAL(10, 2),
    Tax_Deductions DECIMAL(10, 2),
    Total_Bonus DECIMAL(10, 2),
    Pay_Date DATE,
    FOREIGN KEY (Employee_ID) REFERENCES Employee(Employee_ID)
);

-- Performance Table
CREATE TABLE Performance (
    Performance_ID INT PRIMARY KEY AUTO_INCREMENT,
    Employee_ID INT,
    KPIs TEXT,
    Review_Date DATE,
    Appraisal DECIMAL(10, 2),
    Comments TEXT,
    FOREIGN KEY (Employee_ID) REFERENCES Employee(Employee_ID)
);

-- Applicant Table
CREATE TABLE Applicant (
    Applicant_ID INT PRIMARY KEY AUTO_INCREMENT,
    Applied_Job_ID INT,
    Name VARCHAR(100),
    Email VARCHAR(100),
    Experience VARCHAR(100),
    Interview_Scheduled_Status BOOLEAN,
    Interview_Date DATE,
    Interviewer VARCHAR(100),
    FOREIGN KEY (Applied_Job_ID) REFERENCES Job_Posting(Job_ID)
);

-- Job_Posting Table
CREATE TABLE Job_Posting (
    Job_ID INT PRIMARY KEY AUTO_INCREMENT,
    Job_Title VARCHAR(100),
    Job_Description TEXT,
    Qualifications TEXT,
    Job_Type VARCHAR(50),
    Posted_Date DATE
);

-- Leave_Request Table
CREATE TABLE Leave_Request (
    Leave_ID INT PRIMARY KEY AUTO_INCREMENT,
    Employee_ID INT,
    Start_Date DATE,
    End_Date DATE,
    Reason TEXT,
    Permission_Status VARCHAR(50),
    FOREIGN KEY (Employee_ID) REFERENCES Employee(Employee_ID)
);

-- Skill Table
CREATE TABLE Skill (
    Skill_ID INT PRIMARY KEY AUTO_INCREMENT,
    Skill_Name VARCHAR(100),
    Skill_Description TEXT
);

-- Exit_Management Table
CREATE TABLE Exit_Management (
    Exit_ID INT PRIMARY KEY AUTO_INCREMENT,
    Employee_ID INT,
    Resignation_Date DATE,
    Exit_Reason TEXT,
    FOREIGN KEY (Employee_ID) REFERENCES Employee(Employee_ID)
);

-- New tables
CREATE TABLE Conflict_Management (
    Conflict_ID INT PRIMARY KEY AUTO_INCREMENT,
    Conflict_Type VARCHAR(255) NOT NULL,
    Status ENUM('Resolved', 'Ongoing', 'Pending') DEFAULT 'Pending',
    Reported_Date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE Conflict_Employees (
    Conflict_Employee_ID INT PRIMARY KEY AUTO_INCREMENT,
    Conflict_ID INT,
    Employee_ID INT,
    FOREIGN KEY (Conflict_ID) REFERENCES Conflict_Management(Conflict_ID) ON DELETE CASCADE,
    FOREIGN KEY (Employee_ID) REFERENCES Employee(Employee_ID) ON DELETE CASCADE
);

CREATE TABLE Engagement_Activities (
    Activity_ID INT PRIMARY KEY AUTO_INCREMENT,
    Activity_Name VARCHAR(255) NOT NULL,
    Description TEXT NOT NULL,
    Activity_Type ENUM('Workshop', 'Team Building', 'Wellness Session', 'CSR Activity', 'Training Program') NOT NULL,
    Activity_Date DATE NOT NULL,
    Status ENUM('Conducted', 'Cancelled', 'Yet to be Conducted') DEFAULT 'Yet to be Conducted',
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Surveys (
    Survey_ID INT PRIMARY KEY AUTO_INCREMENT,
    Survey_Title VARCHAR(255) NOT NULL,
    Description TEXT NOT NULL,
    Survey_Type ENUM('Employee Feedback', 'Training Evaluation', 'HR Policy Review', 'Culture & Engagement', 'Wellness Assessment') NOT NULL,
    Expiry_Date DATE NOT NULL,
    Status ENUM('Active', 'Closed', 'Draft') DEFAULT 'Draft',
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Performance (
    Performance_ID INT AUTO_INCREMENT PRIMARY KEY,
    Employee_ID INT NOT NULL,
    KPIs TEXT NOT NULL,
    Review_Date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Appraisal INT CHECK (Appraisal BETWEEN 1 AND 5),
    Comments TEXT NOT NULL,
    FOREIGN KEY (Employee_ID) REFERENCES Employee(Employee_ID) ON DELETE CASCADE
);

CREATE TABLE Goals (
    Goal_ID INT AUTO_INCREMENT PRIMARY KEY,
    Title VARCHAR(255) NOT NULL,
    Description TEXT NOT NULL,
    Deadline DATE NOT NULL,
    Status ENUM('Not Started', 'In Progress', 'Completed') NOT NULL,
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Compliance_Policies (
    Policy_ID INT PRIMARY KEY AUTO_INCREMENT,
    Policy_Title VARCHAR(255) NOT NULL UNIQUE,
    Description TEXT NOT NULL,
    Effective_Date DATE NOT NULL,
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Compliance_Notifications (
    Notification_ID INT PRIMARY KEY AUTO_INCREMENT,
    Department_ID INT NOT NULL,
    Compliance_Issue VARCHAR(255) NOT NULL,
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Handled BOOLEAN DEFAULT FALSE, -- New column to mark if notification is processed
    FOREIGN KEY (Department_ID) REFERENCES Department(Department_ID) ON DELETE CASCADE
);

CREATE TABLE Compliance_Tracking (
    Tracking_ID INT PRIMARY KEY AUTO_INCREMENT,
    Notification_ID INT,
    Status ENUM('Pending', 'In Progress', 'Resolved', 'Escalated') DEFAULT 'Pending',
    Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (Notification_ID) REFERENCES Compliance_Notifications(Notification_ID) ON DELETE SET NULL
);

CREATE TABLE Courses (
    Course_ID INT PRIMARY KEY AUTO_INCREMENT,
    Course_Title VARCHAR(255) NOT NULL,
    Course_Description TEXT NOT NULL,
    Instructor VARCHAR(255) NOT NULL,  -- Added Instructor Column
    Category VARCHAR(100) NOT NULL,
    Duration VARCHAR(50) NOT NULL,
    Created_Date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Employee_Training Table (Tracks employee enrollment & progress)
CREATE TABLE Employee_Training (
    Employee_Training_ID INT PRIMARY KEY AUTO_INCREMENT,
    Employee_ID INT NOT NULL,
    Course_ID INT NOT NULL,
    Completion_Status ENUM('Not Started', 'In Progress', 'Completed') DEFAULT 'Not Started',
    Completion_Date DATE NULL,
    Score DECIMAL(5,2) NULL,
    Progress VARCHAR(50) DEFAULT '0%',
    Feedback TEXT NULL,
    Enrolled_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (Employee_ID) REFERENCES Employee(Employee_ID) ON DELETE CASCADE,
    FOREIGN KEY (Course_ID) REFERENCES Courses(Course_ID) ON DELETE CASCADE
);