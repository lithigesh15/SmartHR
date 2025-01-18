document.getElementById("search-btn").addEventListener("click", () => {
    const jobTitle = document.getElementById("jobTitle").value.trim().toLowerCase();
    const location = document.getElementById("location").value.trim().toLowerCase();
    const experience = document.getElementById("experience").value.trim().toLowerCase();

    console.log("Search Inputs - Job Title:", jobTitle, "Location:", location, "Experience:", experience);

    const applicants = [
        { id: "A001", name: "Alice Smith", job: "Software Engineer", location: "New York", experience: "3 years", status: "Shortlisted" },
        { id: "A002", name: "John Doe", job: "Backend Developer", location: "San Francisco", experience: "5 years", status: "Applied" },
        { id: "A003", name: "Jane Doe", job: "Software Engineer", location: "New York", experience: "2 years", status: "Interview Scheduled" },
    ];

    const filteredApplicants = applicants.filter(applicant => {
        return (
            (!jobTitle || applicant.job.toLowerCase().includes(jobTitle)) &&
            (!location || applicant.location.toLowerCase().includes(location)) &&
            (!experience || applicant.experience.toLowerCase().includes(experience))
        );
    });

    console.log("Filtered Results:", filteredApplicants);

    const resultBody = document.getElementById("result-body");
    resultBody.innerHTML = "";

    if (filteredApplicants.length > 0) {
        filteredApplicants.forEach(applicant => {
            const row = `
                <tr>
                    <td>${applicant.id}</td>
                    <td>${applicant.name}</td>
                    <td>${applicant.job}</td>
                    <td>${applicant.location}</td>
                    <td>${applicant.experience}</td>
                    <td>${applicant.status}</td>
                </tr>
            `;
            resultBody.innerHTML += row;
        });
    } else {
        resultBody.innerHTML = `<tr><td colspan="6" class="text-center text-muted">No results found</td></tr>`;
    }

    document.getElementById("result-container").style.display = "block";
});
