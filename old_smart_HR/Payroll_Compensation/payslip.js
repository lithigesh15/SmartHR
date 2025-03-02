// Sample data to fill the payslip (can be dynamically populated)
const employeeData = {
    employeeId: "E12345",
    employeeName: "John Doe",
    basicSalary: 50000,
    hra: 10000,
    bonus: 5000,
    incentive: 2000,
    deductions: 3000,
    tax: 2000,
    netSalary: 57000
};

// Insert payslip data into the table
document.getElementById("paySlipTable").innerHTML = `
    <tr>
        <td>${employeeData.employeeId}</td>
        <td>${employeeData.employeeName}</td>
        <td>${employeeData.basicSalary}</td>
        <td>${employeeData.hra}</td>
        <td>${employeeData.bonus}</td>
        <td>${employeeData.incentive}</td>
        <td>${employeeData.deductions}</td>
        <td>${employeeData.tax}</td>
        <td>${employeeData.netSalary}</td>
    </tr>
`;

// Function to generate and download the payslip as a PDF
document.getElementById("downloadPayslipBtn").addEventListener("click", function() {
    const doc = new jsPDF();

    // Adding the title
    doc.setFontSize(18);
    doc.text("Pay Slip", 14, 20);

    // Employee details
    doc.setFontSize(12);
    doc.text(`Employee ID: ${employeeData.employeeId}`, 14, 30);
    doc.text(`Employee Name: ${employeeData.employeeName}`, 14, 40);
    doc.text(`Basic Salary: ${employeeData.basicSalary}`, 14, 50);
    doc.text(`HRA: ${employeeData.hra}`, 14, 60);
    doc.text(`Bonus: ${employeeData.bonus}`, 14, 70);
    doc.text(`Incentive: ${employeeData.incentive}`, 14, 80);
    doc.text(`Deductions: ${employeeData.deductions}`, 14, 90);
    doc.text(`Tax: ${employeeData.tax}`, 14, 100);
    doc.text(`Net Salary: ${employeeData.netSalary}`, 14, 110);

    // Save the document as a PDF
    doc.save("payslip.pdf");
});
