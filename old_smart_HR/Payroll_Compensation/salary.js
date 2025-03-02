document.getElementById("salaryForm").addEventListener("submit", function(event) {
    event.preventDefault();

    let employeeId = document.getElementById("employeeId").value;
    let employeeName = document.getElementById("employeeName").value;
    let basicSalary = parseFloat(document.getElementById("basicSalary").value);
    let hra = parseFloat(document.getElementById("hra").value) || 0;
    let medical = parseFloat(document.getElementById("medical").value) || 0;
    let pf = parseFloat(document.getElementById("pf").value) || 0;
    let tax = parseFloat(document.getElementById("tax").value) || 0;

    // Calculate salary components
    let hraAmount = (hra / 100) * basicSalary;
    let pfAmount = (pf / 100) * basicSalary;
    let taxAmount = (tax / 100) * basicSalary;

    let netSalary = basicSalary + hraAmount + medical - (pfAmount + taxAmount);
    document.getElementById("netSalary").value = netSalary.toFixed(2);

    // Add data to table
    let table = document.getElementById("salaryTable");
    let row = table.insertRow();
    row.innerHTML = `
        <td>${employeeId}</td>
        <td>${employeeName}</td>
        <td>${basicSalary}</td>
        <td>${hraAmount.toFixed(2)}</td>
        <td>${medical}</td>
        <td>${pfAmount.toFixed(2)}</td>
        <td>${taxAmount.toFixed(2)}</td>
        <td>${netSalary.toFixed(2)}</td>
        <td><button class="btn btn-danger btn-sm" onclick="deleteRow(this)">Delete</button></td>
    `;

    // Clear form fields
    document.getElementById("salaryForm").reset();
});

function deleteRow(button) {
    let row = button.parentNode.parentNode;
    row.parentNode.removeChild(row);
}
