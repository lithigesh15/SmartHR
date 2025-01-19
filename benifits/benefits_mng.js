document.getElementById('update-benefits-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const employeeId = document.getElementById('employee-id').value;
    const rewardPoints = document.getElementById('reward-points').value;
    const description = document.getElementById('description').value;

    // You can send the data to the backend (e.g., via AJAX or fetch)
    const data = {
        employeeId: employeeId,
        rewardPoints: rewardPoints,
        description: description
    };

    fetch('update_benefits.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(responseData => {
        alert('Employee benefits updated successfully!');
        // Reset the form after successful submission
        document.getElementById('update-benefits-form').reset();
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to update employee benefits.');
    });
});
