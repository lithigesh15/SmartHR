document.addEventListener("DOMContentLoaded", () => {
    const employeeData = [
        {
            name: "John Doe",
            python: 60,
            webDev: 75,
            dataScience: 40,
            projectMgmt: 50,
            java: 70,
            cyber: 80,
        },
        {
            name: "Jane Smith",
            python: 80,
            webDev: 55,
            dataScience: 30,
            projectMgmt: 90,
            java: 60,
            cyber: 70,
        },
        // Add more employees as necessary
    ];

    // Function to load employee data into the table
    function loadEmployeeData() {
        const tableBody = document.getElementById('employeeTable');
        tableBody.innerHTML = ''; // Clear any existing rows
        employeeData.forEach((employee, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${employee.name}</td>
                <td><div class="progress"><div class="progress-bar" style="width: ${employee.python}%">${employee.python}%</div></div></td>
                <td><div class="progress"><div class="progress-bar" style="width: ${employee.webDev}%">${employee.webDev}%</div></div></td>
                <td><div class="progress"><div class="progress-bar" style="width: ${employee.dataScience}%">${employee.dataScience}%</div></div></td>
                <td><div class="progress"><div class="progress-bar" style="width: ${employee.projectMgmt}%">${employee.projectMgmt}%</div></div></td>
                <td><div class="progress"><div class="progress-bar" style="width: ${employee.java}%">${employee.java}%</div></div></td>
                <td><div class="progress"><div class="progress-bar" style="width: ${employee.cyber}%">${employee.cyber}%</div></div></td>
                <td><button class="btn btn-warning btn-sm" data-bs-toggle="modal" data-bs-target="#updateProgressModal" onclick="openUpdateModal(${index})">Update</button></td>
            `;
            tableBody.appendChild(row);
        });
    }

    // Function to open the update modal and fill it with employee data
    window.openUpdateModal = function(index) {
        const employee = employeeData[index];
        document.getElementById('employeeName').value = employee.name;
        document.getElementById('pythonProgress').value = employee.python;
        document.getElementById('webProgress').value = employee.webDev;
        document.getElementById('dataProgress').value = employee.dataScience;
        document.getElementById('projectProgress').value = employee.projectMgmt;
        document.getElementById('javaProgress').value = employee.java;
        document.getElementById('cyberProgress').value = employee.cyber;

        // Save index of the employee to be updated
        document.getElementById('updateProgressForm').dataset.index = index;
    }

    // Handle the update form submission
    document.getElementById('updateProgressForm').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission

        const index = this.dataset.index;
        const employee = employeeData[index];

        // Update employee data with new progress
        employee.python = document.getElementById('pythonProgress').value;
        employee.webDev = document.getElementById('webProgress').value;
        employee.dataScience = document.getElementById('dataProgress').value;
        employee.projectMgmt = document.getElementById('projectProgress').value;
        employee.java = document.getElementById('javaProgress').value;
        employee.cyber = document.getElementById('cyberProgress').value;

        // Reload the employee table with updated data
        loadEmployeeData();

        // Close the modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('updateProgressModal'));
        modal.hide();
    });

    // Load initial employee data
    loadEmployeeData();

    // Search functionality
    const searchInput = document.getElementById('search');
    searchInput.addEventListener('input', function () {
        const rows = document.querySelectorAll('#employeeTable tr');
        rows.forEach(row => {
            const name = row.cells[0].textContent.toLowerCase();
            if (name.includes(searchInput.value.toLowerCase())) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    });

    // Filter functionality
    const filterSelect = document.getElementById('filter');
    filterSelect.addEventListener('change', function () {
        const rows = document.querySelectorAll('#employeeTable tr');
        rows.forEach(row => {
            const department = row.cells[0].textContent.toLowerCase(); // Placeholder for actual department filtering
            if (department.includes(filterSelect.value.toLowerCase()) || filterSelect.value === "") {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    });
});
