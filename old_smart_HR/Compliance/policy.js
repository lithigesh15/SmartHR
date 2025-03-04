document.addEventListener("DOMContentLoaded", function () {

    const toggleCreate = document.getElementById("add-policy-btn");
        const toggleManage = document.getElementById("existing-policy-btn");
        const createSection = document.getElementById("add-policy-section");
        const manageSection = document.getElementById("existing-policy-btn");

        toggleCreate.addEventListener('click', () => {
            toggleCreate.classList.add('active');
            toggleManage.classList.remove('active');
            createSection.classList.add('active');
            manageSection.classList.remove('active');
        });

        toggleManage.addEventListener('click', () => {
            toggleManage.classList.add('active');
            toggleCreate.classList.remove('active');
            manageSection.classList.add('active');
            createSection.classList.remove('active');
        });



    // Form Submission for Adding Policy
    addPolicyForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const policyName = policyNameInput.value.trim();
        const policyDescription = policyDescriptionInput.value.trim();

        if (policyName && policyDescription) {
            const newRow = document.createElement("tr");
            newRow.innerHTML = `
                <td>${policyTableBody.children.length + 1}</td>
                <td>${policyName}</td>
                <td>${policyDescription}</td>
                <td>
                    <button class="btn btn-info btn-sm edit-btn">Edit</button>
                    <button class="btn btn-danger btn-sm delete-btn">Delete</button>
                </td>
            `;
            policyTableBody.appendChild(newRow);

            policyNameInput.value = "";
            policyDescriptionInput.value = "";
        }
    });

    // Delete and Edit Functionality
    policyTableBody.addEventListener("click", function (e) {
        if (e.target.classList.contains("delete-btn")) {
            e.target.closest("tr").remove();
        } else if (e.target.classList.contains("edit-btn")) {
            const row = e.target.closest("tr");
            const cells = row.querySelectorAll("td");
            policyNameInput.value = cells[1].innerText;
            policyDescriptionInput.value = cells[2].innerText;
            showAddPolicy();
            row.remove();
        }
    });

    // Initialize Default Section
    showExistingPolicy();
});
