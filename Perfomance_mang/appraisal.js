// Appraisal form submission handler
document.getElementById('appraisal-form').addEventListener('submit', function (e) {
    e.preventDefault();

    // Get form values
    const employeeId = document.getElementById('employeeId').value;
    const jobRole = document.getElementById('jobRole').value;
    const rating = document.getElementById('rating').value;
    const comments = document.getElementById('comments').value;

    // Basic validation
    if (employeeId && jobRole && rating >= 1 && rating <= 5 && comments) {
        alert(`Appraisal for Employee ID ${employeeId} submitted!\n\nRole: ${jobRole}\nRating: ${rating}\nComments: ${comments}`);
        // Optionally reset form after submission
        document.getElementById('appraisal-form').reset();
    } else {
        alert('Please fill in all fields with valid data!');
    }
});
