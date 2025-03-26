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

        // Apply Standard Deduction (₹75,000)
        let taxableIncome = salary - 75000;
        if (taxableIncome < 0) taxableIncome = 0;

        // Calculate tax based on the selected regime
        const taxAmount = calculateTax(taxableIncome, taxRegime);

        // Display the calculated tax
        document.getElementById('totalTax').innerText = taxAmount.toFixed(2);
        document.getElementById('taxResult').style.display = 'block';
    });
});

function calculateTax(salary, regime) {
    let tax = 0;

    if (regime === 'old') {
        if (salary <= 250000) tax = 0;
        else if (salary <= 500000) tax = (salary - 250000) * 0.05;
        else if (salary <= 1000000) tax = 12500 + (salary - 500000) * 0.2;
        else if (salary <= 1500000) tax = 112500 + (salary - 1000000) * 0.3;
        else tax = 262500 + (salary - 1500000) * 0.3;

        // Apply Rebate Under 87A (Income ≤ ₹5L)
        if (salary <= 500000) tax = 0;
    } else if (regime === 'new') {
        if (salary <= 400000) return 0; // ✅ No tax for taxable income ≤ ₹4L
        else if (salary <= 800000) tax = (salary - 400000) * 0.05;
        else if (salary <= 1200000) tax = 20000 + (salary - 800000) * 0.1;
        else if (salary <= 1600000) tax = 60000 + (salary - 1200000) * 0.15;
        else if (salary <= 2000000) tax = 120000 + (salary - 1600000) * 0.2;
        else if (salary <= 2400000) tax = 200000 + (salary - 2000000) * 0.25;
        else tax = 300000 + (salary - 2400000) * 0.3;
    }

    return tax;
}
