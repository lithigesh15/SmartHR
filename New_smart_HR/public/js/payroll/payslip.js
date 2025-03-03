

// public/js/payroll/payslip.js
document.addEventListener('DOMContentLoaded', function() {
    console.log('Payslip page loaded');
    
    // This will run when the page loads
    fetchPayslipData();
    
    // Add print functionality
    const printButton = document.createElement('button');
    printButton.className = 'btn btn-info mb-3';
    printButton.textContent = 'Print Payslips';
    printButton.addEventListener('click', function() {
        window.print();
    });
    
    // Add export functionality
    const exportButton = document.createElement('button');
    exportButton.className = 'btn btn-secondary mb-3 ms-2';
    exportButton.textContent = 'Export to CSV';
    exportButton.addEventListener('click', function() {
        exportToCSV();
    });
    
    // Add buttons to page
    const container = document.querySelector('.container');
    const actionDiv = document.createElement('div');
    actionDiv.className = 'text-end';
    actionDiv.appendChild(printButton);
    actionDiv.appendChild(exportButton);
    container.prepend(actionDiv);
});

function fetchPayslipData() {
    // Fetch payslip data from the server if not already provided
    const tableBody = document.getElementById('paySlipTable');
    
    // If the table is empty (no data from server-side rendering)
    if (tableBody.querySelectorAll('tr').length === 0 || 
        tableBody.querySelector('tr td').colSpan === 9) {
        
        fetch('/payroll/api/payslip-data')
            .then(response => response.json())
            .then(data => {
                if (data.length === 0) {
                    tableBody.innerHTML = `
                        <tr>
                            <td colspan="9" class="text-center">No payslip data available</td>
                        </tr>
                    `;
                    return;
                }
                
                let html = '';
                data.forEach(payslip => {
                    html += `
                        <tr>
                            <td>${payslip.employeeId}</td>
                            <td>${payslip.employeeName}</td>
                            <td>${payslip.basicSalary}</td>
                            <td>${payslip.allowance}</td>
                            <td>${payslip.bonus}</td>
                            <td>${payslip.incentive}</td>
                            <td>${payslip.pfDeduction}</td>
                            <td>${payslip.taxDeduction}</td>
                            <td>${payslip.netSalary}</td>
                        </tr>
                    `;
                });
                tableBody.innerHTML = html;
            })
            .catch(error => {
                console.error('Error fetching payslip data:', error);
                tableBody.innerHTML = `
                    <tr>
                        <td colspan="9" class="text-center text-danger">Error loading payslip data</td>
                    </tr>
                `;
            });
    }
}

function exportToCSV() {
    // Get table data
    const table = document.querySelector('table');
    let csv = [];
    
    // Get headers
    let headers = [];
    for (let cell of table.querySelectorAll('thead th')) {
        headers.push(cell.textContent);
    }
    csv.push(headers.join(','));
    
    // Get data rows
    for (let row of table.querySelectorAll('tbody tr')) {
        let data = [];
        for (let cell of row.querySelectorAll('td')) {
            // Handle commas in the data by quoting fields
            data.push(`"${cell.textContent}"`);
        }
        csv.push(data.join(','));
    }
    
    // Create CSV content
    const csvContent = csv.join('\n');
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'payslip_data.csv');
    link.style.display = 'none';
    
    // Append to document, trigger download, and clean up
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}