// Mock data for demonstration
const appraisals = [
    { employeeId: "E001", jobRole: "Software Engineer", rating: 5, comments: "Excellent performance", date: "2025-01-10" },
    { employeeId: "E002", jobRole: "Project Manager", rating: 4, comments: "Good leadership", date: "2025-01-11" },
    { employeeId: "E003", jobRole: "HR Specialist", rating: 3, comments: "Needs improvement", date: "2025-01-12" }
];

// Function to populate the table
function populateTable() {
    const tableBody = document.getElementById('appraisal-table-body');

    // Clear the table body
    tableBody.innerHTML = "";

    // Populate rows
    appraisals.forEach(appraisal => {
        const row = `
            <tr>
                <td>${appraisal.employeeId}</td>
                <td>${appraisal.jobRole}</td>
                <td>${appraisal.rating}</td>
                <td>${appraisal.comments}</td>
                <td>${appraisal.date}</td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

// Initialize the table on page load
document.addEventListener('DOMContentLoaded', populateTable);
