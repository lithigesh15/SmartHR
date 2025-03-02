// Sample leave requests (You can replace this with data from a backend API)
const leaveRequests = [
    {
        employeeId: "E001",
        employeeName: "John Doe",
        startDate: "2025-01-20",
        endDate: "2025-01-25",
        reason: "Family Function"
    },
    {
        employeeId: "E002",
        employeeName: "Jane Smith",
        startDate: "2025-01-22",
        endDate: "2025-01-24",
        reason: "Medical Appointment"
    }
];

// Populate the table dynamically
const leaveRequestsTable = document.getElementById("leave-requests");

function populateTable() {
    leaveRequests.forEach(request => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${request.employeeId}</td>
            <td>${request.employeeName}</td>
            <td>${request.startDate}</td>
            <td>${request.endDate}</td>
            <td>${request.reason}</td>
            <td>
                <button class="approve" onclick="handleApprove('${request.employeeId}')">✔</button>
                <button class="reject" onclick="handleReject('${request.employeeId}')">✕</button>
            </td>
        `;

        leaveRequestsTable.appendChild(row);
    });
}

// Approve button handler
function handleApprove(employeeId) {
    alert(`Leave approved for Employee ID: ${employeeId}`);
    removeRequest(employeeId);
}

// Reject button handler
function handleReject(employeeId) {
    alert(`Leave rejected for Employee ID: ${employeeId}`);
    removeRequest(employeeId);
}

// Remove the request from the table
function removeRequest(employeeId) {
    const rows = Array.from(leaveRequestsTable.rows);
    for (let row of rows) {
        if (row.cells[0].textContent === employeeId) {
            leaveRequestsTable.deleteRow(row.rowIndex - 1);
        }
    }
}

// Initialize table population
populateTable();
