document.getElementById("onboarding-form").addEventListener("submit", function (e) {
    e.preventDefault();

    // Retrieve input values
    const name = document.getElementById("employeeName").value.trim();
    const email = document.getElementById("email").value.trim();
    const designation = document.getElementById("designation").value.trim();
    const department = document.getElementById("department").value.trim();

    // Generate a random ID for the employee
    const id = "E" + Math.floor(1000 + Math.random() * 9000);

    // Add the new employee to the onboarding list
    const onboardingList = document.getElementById("onboarding-list");
    const newRow = `
        <tr>
            <td>${id}</td>
            <td>${name}</td>
            <td>${email}</td>
            <td>${designation}</td>
            <td>${department}</td>
            <td>Pending</td>
        </tr>
    `;
    onboardingList.innerHTML += newRow;

    // Clear the form fields
    document.getElementById("onboarding-form").reset();
});
