document.addEventListener("DOMContentLoaded", function() {
    // Example static data for Skill Matrix table
    const employees = [
        { name: 'John Doe', skill1: 'Advanced', skill2: 'Intermediate', skill3: 'Beginner', skill4: 'Expert' },
        { name: 'Jane Smith', skill1: 'Intermediate', skill2: 'Advanced', skill3: 'Advanced', skill4: 'Intermediate' },
        { name: 'Emily Johnson', skill1: 'Expert', skill2: 'Beginner', skill3: 'Advanced', skill4: 'Intermediate' },
        { name: 'Michael Brown', skill1: 'Beginner', skill2: 'Intermediate', skill3: 'Intermediate', skill4: 'Expert' },
        // Add more employee data as needed
    ];

    // Function to populate the skill matrix table
    function populateSkillMatrix() {
        const tableBody = document.querySelector('#skillMatrix tbody');
        tableBody.innerHTML = '';  // Clear existing table data
        
        // Loop through each employee and create table rows
        employees.forEach(employee => {
            const row = document.createElement('tr');

            // Create table cells for each skill
            const employeeCell = document.createElement('td');
            employeeCell.textContent = employee.name;

            const skill1Cell = document.createElement('td');
            skill1Cell.textContent = employee.skill1;

            const skill2Cell = document.createElement('td');
            skill2Cell.textContent = employee.skill2;

            const skill3Cell = document.createElement('td');
            skill3Cell.textContent = employee.skill3;

            const skill4Cell = document.createElement('td');
            skill4Cell.textContent = employee.skill4;

            // Append cells to the row
            row.appendChild(employeeCell);
            row.appendChild(skill1Cell);
            row.appendChild(skill2Cell);
            row.appendChild(skill3Cell);
            row.appendChild(skill4Cell);

            // Append the row to the table body
            tableBody.appendChild(row);
        });
    }

    // Call the function to populate the table when the page loads
    populateSkillMatrix();
});

