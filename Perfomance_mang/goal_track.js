document.addEventListener("DOMContentLoaded", function () {
    const goalList = document.getElementById("goal-list");
    const updateGoalForm = document.getElementById("update-goal-form");

    let goals = JSON.parse(localStorage.getItem("goals")) || [];

    function renderGoals() {
        goalList.innerHTML = "";
        goals.forEach((goal, index) => {
            const goalItem = document.createElement("li");
            goalItem.className = "list-group-item d-flex justify-content-between align-items-center";
            goalItem.innerHTML = `
                <div>
                    <strong>${goal.title}</strong> - <span class="badge bg-info">${goal.status}</span>
                    <p class="mb-0">${goal.description}</p>
                    <small>Deadline: ${goal.deadline}</small>
                </div>
                <div>
                    <button class="btn btn-warning btn-sm edit-btn" data-index="${index}">Edit</button>
                    <button class="btn btn-danger btn-sm delete-btn" data-index="${index}">Delete</button>
                </div>
            `;

            // Edit Goal
            goalItem.querySelector(".edit-btn").addEventListener("click", function () {
                document.getElementById("goal-index").value = index;
                document.getElementById("update-goal-title").value = goal.title;
                document.getElementById("update-goal-description").value = goal.description;
                document.getElementById("update-goal-deadline").value = goal.deadline;
                document.getElementById("update-goal-status").value = goal.status;

                const updateModal = new bootstrap.Modal(document.getElementById("updateGoalModal"));
                updateModal.show();
            });

            // Delete Goal
            goalItem.querySelector(".delete-btn").addEventListener("click", function () {
                goals.splice(index, 1);
                localStorage.setItem("goals", JSON.stringify(goals));
                renderGoals();
            });

            goalList.appendChild(goalItem);
        });
    }

    // Update Goal
    updateGoalForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const index = document.getElementById("goal-index").value;
        goals[index] = {
            title: document.getElementById("update-goal-title").value,
            description: document.getElementById("update-goal-description").value,
            deadline: document.getElementById("update-goal-deadline").value,
            status: document.getElementById("update-goal-status").value
        };

        localStorage.setItem("goals", JSON.stringify(goals));
        renderGoals();
        bootstrap.Modal.getInstance(document.getElementById("updateGoalModal")).hide();
    });

    renderGoals();
});
