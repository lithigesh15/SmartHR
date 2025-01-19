// Mock data simulating complaints retrieved from a database
const complaints = [
    {
        complaintId: "C001",
        employeeId: "E123",
        category: "Workload Issues",
        description: "The workload has been overwhelming, leading to stress.",
        status: "Under Review"
    },
    {
        complaintId: "C002",
        employeeId: "E124",
        category: "Harassment",
        description: "Inappropriate behavior from a colleague in the office.",
        status: "Resolved"
    },
    {
        complaintId: "C003",
        employeeId: "E125",
        category: "Management Issues",
        description: "Lack of proper communication from the management.",
        status: "Pending"
    }
];

// Function to populate the complaint status table with data
function populateComplaintTable() {
    const tbody = document.getElementById('complaint-status-body');
    complaints.forEach(complaint => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${complaint.complaintId}</td>
            <td>${complaint.employeeId}</td>
            <td>${complaint.category}</td>
            <td>${complaint.description}</td>
            <td>${complaint.status}</td>
        `;
        
        tbody.appendChild(row);
    });
}

// Initialize the table on page load
window.onload = populateComplaintTable;
