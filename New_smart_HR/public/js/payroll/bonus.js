// public/js/payroll/bonus.js
document.addEventListener('DOMContentLoaded', function() {
    console.log('Bonus page loaded');
    
    // Attach event listener to form submission
    const bonusForm = document.getElementById('bonusForm');
    bonusForm.addEventListener('submit', function(e) {
        e.preventDefault();
        calculateBonus();
    });
    
    // Set up performance rating input with validation
    const performanceRatingInput = document.getElementById('performanceRating');
    performanceRatingInput.addEventListener('input', function() {
        const value = parseFloat(this.value);
        if (value < 1) this.value = 1;
        if (value > 5) this.value = 5;
    });
    
    // Fetch employee details when ID is entered
    document.getElementById('employeeId').addEventListener('blur', function() {
        const employeeId = this.value.trim();
        if (!employeeId) return;
        
        fetch(`/payroll/api/employee/${employeeId}`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Auto-fill form with employee performance data if available
                    if (data.employee.performanceRating) {
                        document.getElementById('performanceRating').value = data.employee.performanceRating;
                    }
                    
                    // Auto-suggest bonus percentage based on performance rating
                    if (data.employee.performanceRating) {
                        const suggestedBonus = data.employee.performanceRating * 2;
                        document.getElementById('bonusPercentage').value = suggestedBonus;
                    }
                }
            })
            .catch(error => {
                console.error('Error fetching employee data:', error);
            });
    });
});

function calculateBonus() {
    const employeeId = document.getElementById('employeeId').value.trim();
    const performanceRating = parseFloat(document.getElementById('performanceRating').value) || 0;
    const bonusPercentage = parseFloat(document.getElementById('bonusPercentage').value) || 0;
    const incentiveAmount = parseFloat(document.getElementById('incentiveAmount').value) || 0;
    
    if (!employeeId) {
        alert('Please enter an Employee ID');
        return;
    }
    
    if (performanceRating < 1 || performanceRating > 5) {
        alert('Performance rating must be between 1 and 5');
        return;
    }

    // Show loading state
    document.getElementById('totalBonus').value = 'Calculating...';
    
    // Make API call to calculate bonus
    fetch('/payroll/api/calculate-bonus', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            employeeId,
            performanceRating,
            bonusPercentage,
            incentiveAmount
        }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            document.getElementById('totalBonus').value = data.totalBonus;
        } else {
            alert('Error: ' + data.message);
            document.getElementById('totalBonus').value = '';
        }
    })
    .catch(error => {
        console.error('Error calculating bonus:', error);
        alert('Failed to calculate bonus. Please try again.');
        document.getElementById('totalBonus').value = '';
    });
}
