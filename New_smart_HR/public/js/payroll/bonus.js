document.addEventListener('DOMContentLoaded', function () {
    console.log('✅ Bonus page loaded');

    document.getElementById('bonus-form').addEventListener('submit', function (e) {
        e.preventDefault();

        const employeeId = document.getElementById('employeeId').value.trim();
        const bonusAmount = parseFloat(document.getElementById('bonusAmount').value);

        if (!employeeId || isNaN(bonusAmount) || bonusAmount <= 0) {
            alert('Please enter a valid Employee ID and Bonus Amount.');
            return;
        }

        fetch('/payroll/api/update-bonus', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ employeeId, bonusAmount }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Bonus updated successfully!');
                document.getElementById('bonus-form').reset();
            } else {
                alert('Error: ' + data.message);
            }
        })
        .catch(error => {
            console.error('❌ Error updating bonus:', error);
            alert('Failed to update bonus.');
        });
    });
});
