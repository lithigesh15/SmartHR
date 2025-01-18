document.addEventListener("DOMContentLoaded", function () {
    const goalForm = document.getElementById("goal-form");

    // Load stored goals from local storage
    let goals = JSON.parse(localStorage.getItem("goals")) || [];

    // Function to save goals to local storage
    function saveGoals() {
        localStorage.setItem("goals", JSON.stringify(goals));
    }

    // Function to add a new goal
    function addGoal(title, description, deadline, status) {
        const newGoal = { title, description, deadline, status };
        goals.push(newGoal);
        saveGoals();
    }

    // Handle form submission
    goalForm.addEventListener("submit", function (event) {
        event.preventDefault();

        // Get form values
        const title = document.getElementById("goal-title").value;
        const description = document.getElementById("goal-description").value;
        const deadline = document.getElementById("goal-deadline").value;
        const status = document.getElementById("goal-status").value;

        // Add goal to storage
        addGoal(title, description, deadline, status);

        // Clear form
        goalForm.reset();

        alert("Goal saved successfully!");
    });
});
