document.getElementById("bonusForm").addEventListener("submit", function(event) {
    event.preventDefault();

    let basicSalary = parseFloat(document.getElementById("basicSalary").value);
    let performanceRating = parseFloat(document.getElementById("performanceRating").value) || 0;
    let bonusPercentage = parseFloat(document.getElementById("bonusPercentage").value) || 0;
    let incentiveAmount = parseFloat(document.getElementById("incentiveAmount").value) || 0;

    // Calculate the bonus based on performance rating and bonus percentage
    let performanceBonus = (performanceRating / 100) * basicSalary;
    let bonus = (bonusPercentage / 100) * basicSalary;

    // Total Bonus is the sum of the performance bonus, calculated bonus, and incentives
    let totalBonus = performanceBonus + bonus + incentiveAmount;

    // Display the calculated total bonus
    document.getElementById("totalBonus").value = totalBonus.toFixed(2);
});
