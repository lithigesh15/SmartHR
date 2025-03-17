ndocument.addEventListener('DOMContentLoaded', function() {
    // Fetch payslip data from the server
    fetchPayslipData();
    
    // Add event listeners to buttons
    document.getElementById('generatePayslip').addEventListener('click', function() {
      alert('Generating payslips for all employees...');
      // Implement actual generation functionality
      fetch('/payroll/api/generate-payslips', {
        method: 'POST'
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          alert('Payslips generated successfully!');
          fetchPayslipData(); // Refresh the table
        } else {
          alert('Failed to generate payslips: ' + data.message);
        }
      })
      .catch(error => {
        console.error('Error generating payslips:', error);
        alert('An error occurred while generating payslips');
      });
    });
    
    document.getElementById('exportPayslip').addEventListener('click', function() {
      alert('Exporting payslips to PDF...');
      // Implement PDF export functionality
      fetch('/payroll/api/export-payslips', {
        method: 'GET'
      })
      .then(response => response.blob())
      .then(blob => {
        // Create a link to download the PDF
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Payslips_' + new Date().toISOString().split('T')[0] + '.pdf';
        document.body.appendChild(a);
        a.click();
        a.remove();
      })
      .catch(error => {
        console.error('Error exporting payslips:', error);
        alert('An error occurred while exporting payslips');
      });
    });
  });
  
  function fetchPayslipData() {
    const tableBody = document.getElementById('paySlipTable');
    
    fetch('/payroll/api/payslip-data')
      .then(response => response.json())
      .then(data => {
        if (data.length === 0) {
          tableBody.innerHTML = `
            <tr>
              <td colspan="10" class="text-center">No payslip data available</td>
            </tr>
          `;
          return;
        }
        
        let html = '';
        data.forEach((payslip, index) => {
          html += `
            <tr>
              <td>${index + 1}</td>
              <td>${payslip.employeeId}</td>
              <td>${payslip.employeeName}</td>
              <td>${Number(payslip.basicSalary).toFixed(2)}</td>
              <td>${Number(payslip.allowance).toFixed(2)}</td>
              <td>${Number(payslip.bonus).toFixed(2)}</td>
              <td>0.00</td>
              <td>${Number(payslip.pfDeduction).toFixed(2)}</td>
              <td>${Number(payslip.taxDeduction).toFixed(2)}</td>
              <td>${Number(payslip.netSalary).toFixed(2)}</td>
            </tr>
          `;
        });
        tableBody.innerHTML = html;
      })
      .catch(error => {
        console.error('Error fetching payslip data:', error);
        tableBody.innerHTML = `
          <tr>
            <td colspan="10" class="text-center text-danger">Error loading payslip data</td>
          </tr>
        `;
      });
  }