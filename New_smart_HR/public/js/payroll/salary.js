// public/js/payroll/salary.js
document.addEventListener('DOMContentLoaded', function() {
    console.log('Salary page loaded');

    // Attach event listener to form submission
    const salaryForm = document.getElementById('salaryForm');
    salaryForm.addEventListener('submit', function(e) {
        e.preventDefault();
        calculateSalary();
    });

    // Fetch employee details when Employee ID is entered
    document.getElementById('employeeId').addEventListener('blur', function() {
        const employeeId = this.value.trim();
        if (!employeeId) return;

        fetch(`/payroll/api/employee/${employeeId}`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    const employee = data.employee;
                    document.getElementById('employeeName').value = employee.Employee_Name;
                    document.getElementById('department').value = employee.Department_Name;
                    document.getElementById('basicSalary').value = employee.Basic_Salary.toFixed(2);
                    
                    // Pre-fill allowance and deduction fields if available
                    document.getElementById('hra').value = employee.HRA ? (employee.HRA / employee.Basic_Salary * 100).toFixed(2) : '10';
                    document.getElementById('medical').value = employee.Allowances || '2000';
                    document.getElementById('pf').value = employee.PF_Deductions ? (employee.PF_Deductions / employee.Basic_Salary * 100).toFixed(2) : '12';
                    document.getElementById('tax').value = employee.Tax_Deductions ? (employee.Tax_Deductions / employee.Basic_Salary * 100).toFixed(2) : '10';
                } else {
                    alert('Employee not found');
                }
            })
            .catch(error => {
                console.error('Error fetching employee details:', error);
                alert('Failed to fetch employee details');
            });
    });

    // Function to update payslip
    document.getElementById('update-payslip').addEventListener('click', function() {
        const employeeId = document.getElementById('employeeId').value.trim();
        if (!employeeId) {
            alert('Please enter a valid Employee ID');
            return;
        }

        const basicSalary = parseFloat(document.getElementById('basicSalary').value) || 0;
        const hra = parseFloat(document.getElementById('hra').value) || 0;
        const medical = parseFloat(document.getElementById('medical').value) || 0;
        const pf = parseFloat(document.getElementById('pf').value) || 0;
        const tax = parseFloat(document.getElementById('tax').value) || 0;
        const netSalary = parseFloat(document.getElementById('netSalary').value) || 0;

        fetch('/payroll/api/update-payslip', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                employeeId, 
                basicSalary, 
                hra, 
                medical, 
                pf, 
                tax, 
                netSalary 
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Payslip updated successfully!');
            } else {
                alert('Error updating payslip: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error updating payslip:', error);
            alert('Failed to update payslip. Please try again.');
        });
    });
});

function calculateSalary() {
    const basicSalary = parseFloat(document.getElementById('basicSalary').value) || 0;
    const hra = parseFloat(document.getElementById('hra').value) || 0;
    const medical = parseFloat(document.getElementById('medical').value) || 0;
    const pf = parseFloat(document.getElementById('pf').value) || 0;
    const tax = parseFloat(document.getElementById('tax').value) || 0;

    const hraAmount = (basicSalary * hra) / 100;
    const pfAmount = (basicSalary * pf) / 100;
    const taxAmount = (basicSalary * tax) / 100;

    const grossSalary = basicSalary + hraAmount + medical;
    const netSalary = grossSalary - pfAmount - taxAmount;

    document.getElementById('grossSalary').value = grossSalary.toFixed(2);
    document.getElementById('netSalary').value = netSalary.toFixed(2);
}