document.addEventListener('DOMContentLoaded', function () {
    console.log('✅ Tax Calculator Page Loaded');

    document.getElementById('tax-form').addEventListener('submit', function (e) {
        e.preventDefault();

        const salary = parseFloat(document.getElementById('annualSalary').value) || 0;
        const taxRegime = document.getElementById('taxRegime').value;

        if (salary <= 0 || !taxRegime) {
            alert('Please enter a valid salary and select a tax regime.');
            return;
        }

        // Calculate tax based on the selected regime
        const taxAmount = calculateTax(salary, taxRegime);

        // Display the calculated tax
        document.getElementById('totalTax').innerText = taxAmount.toFixed(2);
        document.getElementById('taxResult').style.display = 'block';
    });
});

/**
 * Function to calculate tax based on Indian tax slabs (Old vs New Regime)
 */
function calculateTax(salary, regime) {
    let tax = 0;

    if (regime === 'old') {
        // ✅ Old Regime Tax Slabs (FY 2024-25 & 2025-26)
        if (salary <= 250000) tax = 0;
        else if (salary <= 500000) tax = (salary - 250000) * 0.05;
        else if (salary <= 1000000) tax = 12500 + (salary - 500000) * 0.2;
        else tax = 12500 + 100000 + (salary - 1000000) * 0.3;

        // ✅ Apply Standard Deduction (₹50,000)
        salary -= 50000;

        // ✅ Apply Rebate Under 87A (For Income Up to ₹5L)
        if (salary <= 500000) tax = 0;
    } else if (regime === 'new') {
        // ✅ New Regime Tax Slabs (Post Budget 2025)
        if (salary <= 300000) tax = 0;
        else if (salary <= 700000) tax = (salary - 300000) * 0.05;
        else if (salary <= 1000000) tax = 20000 + (salary - 700000) * 0.1;
        else if (salary <= 1200000) tax = 50000 + (salary - 1000000) * 0.15;
        else if (salary <= 1500000) tax = 80000 + (salary - 1200000) * 0.2;
        else tax = 140000 + (salary - 1500000) * 0.3;

        // ✅ Apply Standard Deduction (₹75,000)
        salary -= 75000;

        // ✅ Apply Rebate Under 87A (For Income Up to ₹7L)
        if (salary <= 700000) tax = 0;
    }

    return tax;
}
