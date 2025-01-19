document.getElementById("submit-complaint-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const employeeId = document.getElementById("employee-id").value.trim();
    const category = document.getElementById("category").value;
    const description = document.getElementById("complaint-description").value.trim();

    if (employeeId && category && description) {
        alert("Complaint submitted successfully!");
        // Reset the form after successful submission
        document.getElementById("submit-complaint-form").reset();
    } else {
        alert("Please fill out all fields before submitting.");
    }
});
