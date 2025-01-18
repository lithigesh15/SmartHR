// Toggle functionality
function showOnboardingForm() {
    document.getElementById("onboarding-form-container").style.display = "block";
    document.getElementById("status-container").style.display = "none";

    // Update button classes
    const onboardingToggle = document.getElementById("onboarding-toggle");
    const statusToggle = document.getElementById("status-toggle");
    onboardingToggle.classList.add("btn-primary");
    onboardingToggle.classList.remove("btn-outline-primary");
    statusToggle.classList.add("btn-outline-primary");
    statusToggle.classList.remove("btn-primary");
}

function showStatus() {
    document.getElementById("onboarding-form-container").style.display = "none";
    document.getElementById("status-container").style.display = "block";

    // Update button classes
    const onboardingToggle = document.getElementById("onboarding-toggle");
    const statusToggle = document.getElementById("status-toggle");
    statusToggle.classList.add("btn-primary");
    statusToggle.classList.remove("btn-outline-primary");
    onboardingToggle.classList.add("btn-outline-primary");
    onboardingToggle.classList.remove("btn-primary");
}

// Onboarding form submission
document.getElementById("onboarding-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("employeeName").value.trim();
    const email = document.getElementById("email").value.trim();
    const designation = document.getElementById("designation").value.trim();
    const department = document.getElementById("department").value.trim();
    const id = "E" + Math.floor(1000 + Math.random() * 9000);

    alert("Employee onboarded successfully!");

    document.getElementById("onboarding-form").reset();
});

// Status search functionality
document.getElementById("status-search-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("search-name").value.trim();
    const email = document.getElementById("search-email").value.trim();
    const designation = document.getElementById("search-designation").value.trim();
    const department = document.getElementById("search-department").value.trim();

    // Validate if at least one field is filled
    if (!name && !email && !designation && !department) {
        alert("Please provide at least one search criterion.");
        return;
    }

    // Simulate search results
    document.getElementById("search-results").style.display = "table";

    const tableBody = document.querySelector("#search-results tbody");
    tableBody.innerHTML = `
        <tr>
            <td>E1234</td>
            <td>John Doe</td>
            <td>john.doe@example.com</td>
            <td>Software Engineer</td>
            <td>IT</td>
            <td>Pending</td>
        </tr>
    `;
});
