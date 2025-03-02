// Toggle Functionality
function showScheduleForm() {
    document.getElementById("schedule-form-container").style.display = "block";
    document.getElementById("manage-container").style.display = "none";

    // Update button styles
    document.getElementById("schedule-toggle").classList.add("btn-primary");
    document.getElementById("schedule-toggle").classList.remove("btn-outline-primary");
    document.getElementById("manage-toggle").classList.add("btn-outline-primary");
    document.getElementById("manage-toggle").classList.remove("btn-primary");
}

function showManageInterviews() {
    document.getElementById("schedule-form-container").style.display = "none";
    document.getElementById("manage-container").style.display = "block";

    // Update button styles
    document.getElementById("manage-toggle").classList.add("btn-primary");
    document.getElementById("manage-toggle").classList.remove("btn-outline-primary");
    document.getElementById("schedule-toggle").classList.add("btn-outline-primary");
    document.getElementById("schedule-toggle").classList.remove("btn-primary");
}

// Schedule Interview
document.getElementById("schedule-form").addEventListener("submit", function (e) {
    e.preventDefault();

    alert("Interview scheduled successfully!");
    document.getElementById("schedule-form").reset();
});

// Manage Search
document.getElementById("manage-search-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const role = document.getElementById("search-job").value.trim();
    const date = document.getElementById("search-date").value.trim();

    if (!role && !date) {
        alert("Please provide at least one search criterion.");
        return;
    }

    document.getElementById("search-results").style.display = "table";
    const tbody = document.querySelector("#search-results tbody");
    tbody.innerHTML = `
        <tr>
            <td>Software Engineer</td>
            <td>2025-01-20</td>
            <td>John Smith</td>
            <td>IT</td>
            <td>5</td>
        </tr>
    `;
});
