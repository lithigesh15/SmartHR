// Feedback form submission handler
document.getElementById('feedback-form').addEventListener('submit', function (e) {
    e.preventDefault();

    // Get form values
    const employeeId = document.getElementById('employeeId').value;
    const feedback = document.getElementById('feedback').value;
    const rating = document.getElementById('rating').value;

    // Basic validation
    if (employeeId && feedback && rating >= 1 && rating <= 5) {
        alert(`Feedback for Employee ID ${employeeId} submitted!\n\nRating: ${rating}\nFeedback: ${feedback}`);
        // Optionally reset form after submission
        document.getElementById('feedback-form').reset();
    } else {
        alert('Please fill in all fields with valid data!');
    }
});
