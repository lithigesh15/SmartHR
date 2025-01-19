document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById('search');
    const filterSelect = document.getElementById('filter');

    // Example of dynamically filtering (stub for future MySQL integration)
    searchInput.addEventListener('input', function () {
        const rows = document.querySelectorAll('#employeeTable tr');
        rows.forEach(row => {
            const name = row.cells[0].textContent.toLowerCase();
            if (name.includes(searchInput.value.toLowerCase())) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    });

    filterSelect.addEventListener('change', function () {
        const rows = document.querySelectorAll('#employeeTable tr');
        rows.forEach(row => {
            // Filter logic (stub for department-based filter)
            const department = row.cells[0].textContent.toLowerCase(); // Use department info in future
            if (department.includes(filterSelect.value.toLowerCase()) || filterSelect.value === "") {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    });
});
