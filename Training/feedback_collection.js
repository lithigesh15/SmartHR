document.addEventListener("DOMContentLoaded", function () {
    const feedbackForm = document.getElementById("feedback-form");

    feedbackForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const employeeId = document.getElementById("employeeId").value;
        const feedbackType = document.getElementById("feedbackType").value;
        const comments = document.getElementById("comments").value;

        // Future-proofing: Store the data in an object (or send to a database)
        const feedbackData = {
            employeeId: employeeId,
            feedbackType: feedbackType,
            comments: comments
        };

        // For now, we'll log it to the console
        console.log("Feedback Submitted:", feedbackData);

        // Future-proof: Here you could send this data to the backend API for storage in a database.
        // Example:
        // fetch('/submitFeedback', {
        //     method: 'POST',
        //     body: JSON.stringify(feedbackData),
        //     headers: {
        //         'Content-Type': 'application/json'
        //     }
        // })
        // .then(response => response.json())
        // .then(data => {
        //     alert("Feedback submitted successfully!");
        // })
        // .catch(error => console.error('Error:', error));

        alert("Feedback Submitted!");
        feedbackForm.reset();
    });
});
