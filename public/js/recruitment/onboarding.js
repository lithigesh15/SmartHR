// public/js/recruitment/onboarding.js
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById("onboarding-form").addEventListener("submit", function(e) {
        e.preventDefault();

        const applicantID = document.getElementById("applicantID").value.trim();
        const department = document.getElementById("department").value.trim();
        const salary = document.getElementById("salary").value.trim();

        // Validate inputs
        if (!applicantID || !department || !salary) {
            alert("Please fill in all required fields");
            return;
        }

        fetch('/recruitment/api/onboard', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                applicantID,
                department,
                salary
            }),
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            document.getElementById("onboarding-form").reset();
        })
        .catch(error => {
            console.error('Error onboarding employee:', error);
            alert('An error occurred while onboarding the employee');
        });
    });
});