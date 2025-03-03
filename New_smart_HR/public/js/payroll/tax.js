// public/js/payroll/tax.js
document.addEventListener('DOMContentLoaded', function() {
    console.log('Tax page loaded');
    
    // Attach event listener to form submission
    const taxForm = document.getElementById('taxForm');
    taxForm.addEventListener('submit', function(e) {
        e.preventDefault();
        calculateTax();
    });
    
    // Add tax bracket suggestions
    const annualSalaryInput = document.getElementById('annualSalary');
    annualSalaryInput.addEventListener('blur', function() {
        const salary = parseFloat(this.value) || 0;
        const taxRateInput = document.getElementById('taxRate');
        
        // Suggest tax rate based on salary brackets
        if (salary <= 300000) {
            taxRateInput.value = 0;
        } else if (salary <= 600000) {
            taxRateInput.value = 5;
        } else if (salary <= 900000) {
            taxRateInput.value = 10;
        } else if (salary <= 1200000) {
            taxRateInput.value = 15;
        } else if (salary <= 1500000) {
            taxRateInput.value = 20;
        } else {
            taxRateInput.value = 30;
        }
    });
});

function calculateTax() {
    const annualSalary = parseFloat(document.getElementById('annualSalary').value) || 0;
    const taxRate = parseFloat(document.getElementById('taxRate').value) || 0;
    
    if (annualSalary <= 0) {
        alert('Please enter a valid annual salary');
        return;
    }

    // Show loading state
    document.getElementById('netTax').value = 'Calculating...';
    
    // Make API call to calculate tax
    fetch('/payroll/api/calculate-tax', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            annualSalary,
            taxRate
        }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            document.getElementById('netTax').value = data.netTax;
            
            // Display tax breakdown if available
            if (data.taxDetails) {
                let breakdownHTML = '<div class="mt-4"><h5>Tax Breakdown</h5><table class="table table-sm">';
                breakdownHTML += '<thead><tr><th>Income Range</th><th>Rate</th><th>Tax Amount</th></tr></thead><tbody>';
                
                data.taxDetails.forEach(detail => {
                    breakdownHTML += `<tr>
                        <td>${detail.range}</td>
                        <td>${detail.rate}%</td>
                        <td>₹${detail.amount.toFixed(2)}</td>
                    </tr>`;
                });
                
                breakdownHTML += '</tbody></table></div>';
                
                // Check if breakdown container exists, create if not
                let breakdownContainer = document.getElementById('taxBreakdown');
                if (!breakdownContainer) {
                    breakdownContainer = document.createElement('div');
                    breakdownContainer.id = 'taxBreakdown';
                    document.getElementById('taxForm').after(breakdownContainer);
                }
                
                breakdownContainer.innerHTML = breakdownHTML;
            }
        } else {
            alert('Error: ' + data.message);
            document.getElementById('netTax').value = '';
        }
    })
    .catch(error => {
        console.error('Error calculating tax:', error);
        alert('Failed to calculate tax. Please try again.');
        document.getElementById('netTax').value = '';
    });
}
