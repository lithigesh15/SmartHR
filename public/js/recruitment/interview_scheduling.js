// public/js/recruitment/interview_scheduling.js
document.addEventListener('DOMContentLoaded', function() {
    // Toggle Functionality
    window.showScheduleForm = function() {
        document.getElementById("schedule-form-container").style.display = "block";
        document.getElementById("manage-container").style.display = "none";

        // Update button styles
        document.getElementById("schedule-toggle").classList.add("btn-primary");
        document.getElementById("schedule-toggle").classList.remove("btn-outline-primary");
        document.getElementById("manage-toggle").classList.add("btn-outline-primary");
        document.getElementById("manage-toggle").classList.remove("btn-primary");
    }

    window.showManageInterviews = function() {
        document.getElementById("schedule-form-container").style.display = "none";
        document.getElementById("manage-container").style.display = "block";

        // Update button styles
        document.getElementById("manage-toggle").classList.add("btn-primary");
        document.getElementById("manage-toggle").classList.remove("btn-outline-primary");
        document.getElementById("schedule-toggle").classList.add("btn-outline-primary");
        document.getElementById("schedule-toggle").classList.remove("btn-primary");
    }

    // Schedule Interview
    document.getElementById("schedule-form").addEventListener("submit", function(e) {
        e.preventDefault();

        const applicantID = document.getElementById("applicantID").value.trim();
        const interviewDate = document.getElementById("interview-date").value.trim();
        const interviewerName = document.getElementById("interviewer-name").value.trim();

        fetch('/recruitment/api/interviews', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                applicantID,
                interview_date: interviewDate,
                interviewer_name: interviewerName
            }),
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            document.getElementById("schedule-form").reset();
        })
        .catch(error => {
            console.error('Error scheduling interview:', error);
            alert('An error occurred while scheduling the interview');
        });
    });

    // Manage Search
    document.getElementById("manage-search-form").addEventListener("submit", function(e) {
        e.preventDefault();

        const jobTitle = document.getElementById("search-job").value.trim();
        const interviewDate = document.getElementById("search-date").value.trim();

        if (!jobTitle && !interviewDate) {
            alert("Please provide at least one search criterion.");
            return;
        }

        fetch(`/recruitment/api/interviews?job_title=${jobTitle}&interview_date=${interviewDate}`)
            .then(response => response.json())
            .then(interviews => {
                const tbody = document.querySelector("#search-results tbody");
                tbody.innerHTML = "";

                if (interviews.length > 0) {
                    interviews.forEach(interview => {
                        const row = `
                            <tr>
                                <td>${interview.job_title || 'N/A'}</td>
                                <td>${new Date(interview.interview_date).toLocaleDateString()}</td>
                                <td>${interview.interviewer || 'N/A'}</td>
                                <td>${interview.department || 'N/A'}</td>
                                <td>1</td>
                            </tr>
                        `;
                        tbody.innerHTML += row;
                    });
                } else {
                    tbody.innerHTML = `<tr><td colspan="5" class="text-center">No interviews found</td></tr>`;
                }

                document.getElementById("search-results").style.display = "table";
            })
            .catch(error => {
                console.error('Error searching interviews:', error);
                alert('An error occurred while searching interviews');
            });
    });
});