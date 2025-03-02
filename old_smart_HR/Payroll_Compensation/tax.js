document.getElementById("taxForm").addEventListener("submit", function(event) {
    event.preventDefault();

    let annualSalary = parseFloat(document.getElementById("annualSalary").value);
    let taxRate = parseFloat(document.getElementById("taxRate").value) || 0;

    // Calculate the tax amount
    let netTax = (taxRate / 100) * annualSalary;
    document.getElementById("netTax").value = netTax.toFixed(2);
});
