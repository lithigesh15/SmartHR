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

-- Create Courses Table
CREATE TABLE Courses (
    Course_ID INT PRIMARY KEY AUTO_INCREMENT,
    Course_Title VARCHAR(255) NOT NULL,
    Course_Description TEXT NOT NULL,
    Category VARCHAR(100) NOT NULL,
    Duration VARCHAR(50) NOT NULL,
    Created_Date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
