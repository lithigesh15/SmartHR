document.getElementById("search-btn").addEventListener("click", () => {
    const searchCriteria = document.getElementById("searchCriteria").value;
    const searchInput = document.getElementById("searchInput").value.trim().toLowerCase();

    console.log("Search By:", searchCriteria, "Input:", searchInput);

    const applicants = [
        { id: "A001", name: "Alice Smith", job: "Software Engineer", qualification: "Under-Graduate", experience: "3 years", status: "Shortlisted" },
        { id: "A002", name: "John Doe", job: "Backend Developer", qualification: "Post-Graduate", experience: "5 years", status: "Applied" },
        { id: "A003", name: "Jane Doe", job: "Software Engineer", qualification: "Under-Graduate", experience: "2 years", status: "Interview Scheduled" },
    ];

    const filteredApplicants = applicants.filter(applicant => {
        if (searchCriteria === "jobTitle") {
            return applicant.job.toLowerCase().includes(searchInput);
        } else if (searchCriteria === "name") {
            return applicant.name.toLowerCase().includes(searchInput);
        } else if (searchCriteria === "experience") {
            return applicant.experience.toLowerCase().includes(searchInput);
        }
        return false;
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
                    <td>${applicant.qualification || "N/A"}</td>
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