document.addEventListener("DOMContentLoaded", function () {
    // Example static data for Skill Matrix table (Mock data)
    const employees = [
        { name: 'John Doe', python: 80, webDevelopment: 60, dataScience: 40, projectManagement: 90, java: 70, cyberSecurity: 95 },
        { name: 'Jane Smith', python: 60, webDevelopment: 80, dataScience: 85, projectManagement: 60, java: 50, cyberSecurity: 70 },
        { name: 'Emily Johnson', python: 90, webDevelopment: 50, dataScience: 70, projectManagement: 60, java: 75, cyberSecurity: 55 },
        { name: 'Michael Brown', python: 40, webDevelopment: 60, dataScience: 65, projectManagement: 90, java: 85, cyberSecurity: 60 },
        // Add more employee data as needed
    ];

    // Function to populate the skill matrix table with mock data
    function populateSkillMatrix(employeeData) {
        const tableBody = document.querySelector('#skillMatrix tbody');
        tableBody.innerHTML = '';  // Clear existing table data

        // Loop through each employee and create table rows
        employeeData.forEach(employee => {
            const row = document.createElement('tr');

            // Create table cells for each skill
            const employeeCell = document.createElement('td');
            employeeCell.textContent = employee.name;

            const pythonCell = document.createElement('td');
            pythonCell.textContent = getSkillLevel(employee.python);

            const webDevelopmentCell = document.createElement('td');
            webDevelopmentCell.textContent = getSkillLevel(employee.webDevelopment);

            const dataScienceCell = document.createElement('td');
            dataScienceCell.textContent = getSkillLevel(employee.dataScience);

            const projectManagementCell = document.createElement('td');
            projectManagementCell.textContent = getSkillLevel(employee.projectManagement);

            const javaCell = document.createElement('td');
            javaCell.textContent = getSkillLevel(employee.java);

            const cyberSecurityCell = document.createElement('td');
            cyberSecurityCell.textContent = getSkillLevel(employee.cyberSecurity);

            // Append cells to the row
            row.appendChild(employeeCell);
            row.appendChild(pythonCell);
            row.appendChild(webDevelopmentCell);
            row.appendChild(dataScienceCell);
            row.appendChild(projectManagementCell);
            row.appendChild(javaCell);
            row.appendChild(cyberSecurityCell);

            // Append the row to the table body
            tableBody.appendChild(row);
        });
    }

    // Function to classify skill level based on the percentage
    function getSkillLevel(percentage) {
        if (percentage <= 30) {
            return 'Beginner';
        } else if (percentage <= 60) {
            return 'Intermediate';
        } else if (percentage <= 85) {
            return 'Advanced';
        } else {
            return 'Expert';
        }
    }

    // Call the populateSkillMatrix function with the mock data
    populateSkillMatrix(employees);
});
