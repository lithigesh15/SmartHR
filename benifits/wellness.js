document.getElementById('create-wellness-program-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting the traditional way

    // Get values from the form
    const sessionName = document.getElementById('session-name').value;
    const startTime = document.getElementById('start-time').value;
    const endTime = document.getElementById('end-time').value;
    const description = document.getElementById('description').value;

    // Validation (simple)
    if (!sessionName || !startTime || !endTime || !description) {
        alert("All fields are required.");
        return;
    }

    // If validation is passed, we can send data to backend (e.g., using AJAX or fetch).
    // For now, we just log the values.
    console.log("Session Name: ", sessionName);
    console.log("Start Time: ", startTime);
    console.log("End Time: ", endTime);
    console.log("Description: ", description);

    // Optional: Clear the form after submission
    document.getElementById('create-wellness-program-form').reset();

    // Success message
    alert("Wellness Program Published Successfully!");
});
