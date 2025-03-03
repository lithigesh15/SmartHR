// public/js/payroll/salary.js
document.addEventListener('DOMContentLoaded', function() {
    console.log('Salary page loaded');
    
    // Attach event listener to form submission
    const salaryForm = document.getElementById('salaryForm');
    salaryForm.addEventListener('submit', function(e) {
        e.preventDefault();
        calculateSalary();
    });
    
    // Function to fetch employee details when ID is entered
    document.getElementById('employeeId').addEventListener('blur', function() {
        const employeeId = this.value.trim();
        if (!employeeId) return;
        
        fetch(`/payroll/api/employee/${employeeId}`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Auto-fill form with employee data if available
                    if (data.employee.hra) document.getElementById('hra').value = data.employee.hra;
                    if (data.employee.medical) document.getElementById('medical').value = data.employee.medical;
                    if (data.employee.pf) document.getElementById('pf').value = data.employee.pf;
                    if (data.employee.tax) document.getElementById('tax').value = data.employee.tax;
                }
            })
            .catch(error => {
                console.error('Error fetching employee data:', error);
            });
    });
});

function calculateSalary() {
    const employeeId = document.getElementById('employeeId').value.trim();
    const hra = parseFloat(document.getElementById('hra').value) || 0;
    const medical = parseFloat(document.getElementById('medical').value) || 0;
    const pf = parseFloat(document.getElementById('pf').value) || 0;
    const tax = parseFloat(document.getElementById('tax').value) || 0;
    
    if (!employeeId) {
        alert('Please enter an Employee ID');
        return;
    }

    // Show loading state
    document.getElementById('netSalary').value = 'Calculating...';
    
    // Make API call to calculate salary
    fetch('/payroll/api/calculate-salary', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            employeeId,
            hra,
            medical,
            pf,
            tax
        }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            document.getElementById('netSalary').value = data.netSalary;
        } else {
            alert('Error: ' + data.message);
            document.getElementById('netSalary').value = '';
        }
    })
    .catch(error => {
        console.error('Error calculating salary:', error);
        alert('Failed to calculate salary. Please try again.');
        document.getElementById('netSalary').value = '';
    });
}