document.getElementById("complaint-feedback-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const complaintId = document.getElementById("complaint-id").value.trim();
    const satisfaction = document.getElementById("satisfaction").value;
    const communication = document.getElementById("communication").value;
    const feedback = document.getElementById("feedback").value.trim();

    if (complaintId && satisfaction && communication && feedback) {
        alert("Feedback submitted successfully!");
        // Reset the form after successful submission
        document.getElementById("complaint-feedback-form").reset();
    } else {
        alert("Please fill out all fields before submitting.");
    }
});
