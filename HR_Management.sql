create database HR_Management;

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

-- Training Table
CREATE TABLE Training (
    Training_ID INT PRIMARY KEY AUTO_INCREMENT,
    Skill_ID INT,
    Program_Name VARCHAR(100),
    Start_Date DATE,
    End_Date DATE,
    FOREIGN KEY (Skill_ID) REFERENCES Skill(Skill_ID)
);

-- Employee_Training Table
CREATE TABLE Employee_Training (
    Employee_Training_ID INT PRIMARY KEY AUTO_INCREMENT,
    Employee_ID INT,
    Training_ID INT,
    Completion_Status BOOLEAN,
    Completion_Date DATE,
    Score DECIMAL(5, 2),
    Progress TEXT,
    Feedback TEXT,
    FOREIGN KEY (Employee_ID) REFERENCES Employee(Employee_ID),
    FOREIGN KEY (Training_ID) REFERENCES Training(Training_ID)
);

-- Exit_Management Table
CREATE TABLE Exit_Management (
    Exit_ID INT PRIMARY KEY AUTO_INCREMENT,
    Employee_ID INT,
    Resignation_Date DATE,
    Exit_Reason TEXT,
    FOREIGN KEY (Employee_ID) REFERENCES Employee(Employee_ID)
);

-- Populate the tables with sample data
-- Department
INSERT INTO Department (Manager_ID, Department_Name) VALUES
(1, 'Human Resources'),
(2, 'Finance'),
(3, 'Engineering'),
(4, 'Marketing'),
(5, 'Sales'),
(6, 'IT Support'),
(7, 'Legal'),
(8, 'R&D'),
(9, 'Procurement'),
(10, 'Operations');

-- Job_Posting
INSERT INTO Job_Posting (Job_Title, Job_Description, Qualifications, Job_Type, Posted_Date) VALUES
('Software Engineer', 'Develop and maintain software.', 'Bachelor of Computer Science', 'Full-Time', '2025-01-01'),
('HR Manager', 'Manage HR operations.', 'MBA in HR', 'Full-Time', '2025-01-10'),
('Data Analyst', 'Analyze business data.', 'Bachelor of Statistics', 'Part-Time', '2025-01-15'),
('Marketing Executive', 'Develop marketing campaigns.', 'MBA in Marketing', 'Full-Time', '2025-01-20'),
('Sales Representative', 'Manage client accounts.', 'Bachelor of Commerce', 'Full-Time', '2025-01-25'),
('Network Engineer', 'Maintain IT networks.', 'Bachelor of IT', 'Full-Time', '2025-01-30'),
('Legal Advisor', 'Provide legal advice.', 'LLB', 'Full-Time', '2025-02-01'),
('Procurement Specialist', 'Handle procurement processes.', 'Bachelor of Supply Chain', 'Part-Time', '2025-02-05'),
('R&D Scientist', 'Conduct research and development.', 'PhD in relevant field', 'Full-Time', '2025-02-10'),
('Operations Manager', 'Oversee operations.', 'MBA in Operations', 'Full-Time', '2025-02-15');

-- Applicant
INSERT INTO Applicant (Applied_Job_ID, Name, Email, Experience, Interview_Scheduled_Status, Interview_Date, Interviewer) VALUES
(1, 'John Doe', 'john.doe@example.com', '5 years', TRUE, '2025-01-15', 'Jane Smith'),
(2, 'Alice Brown', 'alice.brown@example.com', '3 years', FALSE, NULL, NULL),
(3, 'Mark Spencer', 'mark.spencer@example.com', '7 years', TRUE, '2025-01-20', 'Robert Johnson'),
(4, 'Sophia Johnson', 'sophia.johnson@example.com', '2 years', TRUE, '2025-01-22', 'Emily Davis'),
(5, 'William White', 'william.white@example.com', '10 years', FALSE, NULL, NULL),
(6, 'Olivia Green', 'olivia.green@example.com', '1 year', TRUE, '2025-01-25', 'Michael Brown'),
(7, 'Lucas Gray', 'lucas.gray@example.com', '4 years', FALSE, NULL, NULL),
(8, 'Emma Black', 'emma.black@example.com', '6 years', TRUE, '2025-01-28', 'Charlotte Wilson'),
(9, 'James Miller', 'james.miller@example.com', '8 years', TRUE, '2025-02-01', 'Henry Harris'),
(10, 'Mia Scott', 'mia.scott@example.com', '2 years', FALSE, NULL, NULL);

-- Employee
INSERT INTO Employee (Applicant_ID, Department_ID, Hired_Salary, Joining_Date) VALUES
(1, 3, 75000, '2025-01-20'),
(2, 1, 60000, '2025-01-22'),
(3, 2, 80000, '2025-01-25'),
(4, 4, 55000, '2025-01-30'),
(5, 5, 70000, '2025-02-01'),
(6, 6, 62000, '2025-02-05'),
(7, 7, 90000, '2025-02-10'),
(8, 8, 85000, '2025-02-15'),
(9, 9, 78000, '2025-02-20'),
(10, 10, 88000, '2025-02-25');

-- Payroll
INSERT INTO Payroll (Employee_ID, Basic_Pay, Allowances, PF_Deductions, Tax_Deductions, Total_Bonus, Pay_Date) VALUES
(1, 50000, 10000, 5000, 8000, 12000, '2025-01-31'),
(2, 40000, 9000, 4500, 7000, 10000, '2025-02-01'),
(3, 55000, 12000, 6000, 10000, 15000, '2025-02-05'),
(4, 35000, 8000, 4000, 6000, 8000, '2025-02-10'),
(5, 45000, 11000, 5000, 7500, 11000, '2025-02-15'),
(6, 42000, 10000, 4800, 7200, 10500, '2025-02-20'),
(7, 60000, 15000, 7500, 12000, 18000, '2025-02-25'),
(8, 58000, 14000, 7300, 11500, 17000, '2025-02-28'),
(9, 52000, 13000, 6500, 10000, 16000, '2025-03-05'),
(10, 61000, 16000, 7800, 12500, 19000, '2025-03-10');

-- Performance
INSERT INTO Performance (Employee_ID, KPIs, Review_Date, Appraisal, Comments) VALUES
(1, 'Met deadlines, excellent teamwork.', '2025-02-01', 5000, 'Great performance.'),
(2, 'Exceeded sales targets, proactive.', '2025-02-05', 7000, 'Outstanding performance.'),
(3, 'Achieved project milestones.', '2025-02-10', 6000, 'Very good.'),
(4, 'Improved marketing campaigns.', '2025-02-15', 4000, 'Good work.'),
(5, 'Maintained high client satisfaction.', '2025-02-20', 4500, 'Impressive efforts.'),
(6, 'Enhanced network security.', '2025-02-25', 5200, 'Excellent job.'),
(7, 'Provided critical legal advice.', '2025-02-28', 8000, 'Exceptional.'),
(8, 'Developed innovative products.', '2025-03-05', 7500, 'Creative and effective.'),
(9, 'Streamlined procurement process.', '2025-03-10', 5000, 'Efficient performance.'),
(10, 'Optimized operations workflows.', '2025-03-15', 9000, 'Phenomenal.');

-- Leave_Request
INSERT INTO Leave_Request (Employee_ID, Start_Date, End_Date, Reason, Permission_Status) VALUES
(1, '2025-02-10', '2025-02-15', 'Family emergency', 'Approved'),
(2, '2025-03-01', '2025-03-05', 'Medical leave', 'Approved'),
(3, '2025-04-10', '2025-04-15', 'Vacation', 'Approved'),
(4, '2025-05-01', '2025-05-07', 'Personal reasons', 'Pending'),
(5, '2025-06-15', '2025-06-20', 'Conference attendance', 'Approved'),
(6, '2025-07-10', '2025-07-12', 'Training session', 'Approved'),
(7, '2025-08-20', '2025-08-25', 'Family event', 'Pending'),
(8, '2025-09-05', '2025-09-08', 'Health checkup', 'Approved'),
(9, '2025-10-15', '2025-10-18', 'Maternity/Paternity leave', 'Approved'),
(10, '2025-11-01', '2025-11-03', 'Workshop', 'Approved');

-- Skill
INSERT INTO Skill (Skill_Name, Skill_Description) VALUES
('Python Programming', 'Proficient in Python development.'),
('Project Management', 'Skilled in managing projects.'),
('Data Analysis', 'Expert in analyzing data and generating insights.'),
('Network Security', 'Specialized in securing IT systems.'),
('Client Communication', 'Effective client communication skills.'),
('Team Leadership', 'Ability to lead and motivate teams.'),
('Legal Compliance', 'Knowledge of legal regulations.'),
('Supply Chain Management', 'Expert in procurement and logistics.'),
('Innovation Techniques', 'Creative problem-solving methods.'),
('Operational Efficiency', 'Improving business workflows.');

-- Training
INSERT INTO Training (Skill_ID, Program_Name, Start_Date, End_Date) VALUES
(1, 'Advanced Python', '2025-01-25', '2025-02-05'),
(2, 'Effective Project Management', '2025-02-10', '2025-02-20'),
(3, 'Business Data Analysis', '2025-03-01', '2025-03-10'),
(4, 'Cybersecurity Essentials', '2025-03-15', '2025-03-25'),
(5, 'Client Relations Mastery', '2025-04-01', '2025-04-05'),
(6, 'Team Leadership Workshop', '2025-04-10', '2025-04-15'),
(7, 'Corporate Legal Training', '2025-04-20', '2025-04-25'),
(8, 'Supply Chain Optimization', '2025-05-01', '2025-05-10'),
(9, 'Creative Thinking Techniques', '2025-05-15', '2025-05-20'),
(10, 'Operational Excellence', '2025-05-25', '2025-05-30');

-- Employee_Training
INSERT INTO Employee_Training (Employee_ID, Training_ID, Completion_Status, Completion_Date, Score, Progress, Feedback) VALUES
(1, 1, TRUE, '2025-02-06', 95.5, 'Completed', 'Excellent training.'),
(2, 2, TRUE, '2025-02-21', 90.0, 'Completed', 'Very informative.'),
(3, 3, TRUE, '2025-03-11', 88.5, 'Completed', 'Useful insights.'),
(4, 4, TRUE, '2025-03-26', 92.0, 'Completed', 'Highly recommended.'),
(5, 5, TRUE, '2025-04-06', 85.0, 'Completed', 'Practical and engaging.'),
(6, 6, TRUE, '2025-04-16', 89.5, 'Completed', 'Well-structured program.'),
(7, 7, TRUE, '2025-04-26', 94.0, 'Completed', 'Excellent resources.'),
(8, 8, TRUE, '2025-05-11', 93.0, 'Completed', 'Valuable content.'),
(9, 9, TRUE, '2025-05-21', 91.5, 'Completed', 'Great strategies shared.'),
(10, 10, TRUE, '2025-05-31', 96.0, 'Completed', 'Exceptional training experience.');

-- Exit_Management
INSERT INTO Exit_Management (Employee_ID, Resignation_Date, Exit_Reason) VALUES
(1, '2025-03-01', 'Personal reasons'),
(2, '2025-03-10', 'Career advancement'),
(3, '2025-04-15', 'Relocation'),
(4, '2025-05-20', 'Health issues'),
(5, '2025-06-25', 'Higher education'),
(6, '2025-07-30', 'Better opportunities'),
(7, '2025-08-15', 'Family commitments'),
(8, '2025-09-05', 'Retirement'),
(9, '2025-10-10', 'Contract end'),
(10, '2025-11-20', 'Job dissatisfaction');
