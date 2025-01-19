document.addEventListener("DOMContentLoaded", function () {
    const addPolicySection = document.getElementById("add-policy-section");
    const existingPolicySection = document.getElementById("existing-policy-section");

    const addPolicyButton = document.getElementById("add-policy-btn");
    const existingPolicyButton = document.getElementById("existing-policy-btn");

    const policyTableBody = document.getElementById("policy-table-body");
    const addPolicyForm = document.getElementById("add-policy-form");
    const policyNameInput = document.getElementById("policy-name");
    const policyDescriptionInput = document.getElementById("policy-description");

    // Toggle Functionality
    function showAddPolicy() {
        addPolicySection.style.display = "block";
        existingPolicySection.style.display = "none";

        addPolicyButton.classList.remove("btn-outline-primary");
        addPolicyButton.classList.add("btn-primary");

        existingPolicyButton.classList.remove("btn-primary");
        existingPolicyButton.classList.add("btn-outline-primary");
    }

    function showExistingPolicy() {
        addPolicySection.style.display = "none";
        existingPolicySection.style.display = "block";

        existingPolicyButton.classList.remove("btn-outline-primary");
        existingPolicyButton.classList.add("btn-primary");

        addPolicyButton.classList.remove("btn-primary");
        addPolicyButton.classList.add("btn-outline-primary");
    }

    addPolicyButton.addEventListener("click", showAddPolicy);
    existingPolicyButton.addEventListener("click", showExistingPolicy);

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
