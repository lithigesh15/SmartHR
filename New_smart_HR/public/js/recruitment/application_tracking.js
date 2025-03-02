// public/js/recruitment/application_tracking.js
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById("search-btn").addEventListener("click", () => {
        const searchCriteria = document.getElementById("searchCriteria").value;
        const searchInput = document.getElementById("searchInput").value.trim();

        if (!searchInput) {
            alert("Please enter a search term");
            return;
        }

        fetch(`/recruitment/api/applicants?searchCriteria=${searchCriteria}&searchInput=${searchInput}`)
            .then(response => response.json())
            .then(applicants => {
                const resultBody = document.getElementById("result-body");
                resultBody.innerHTML = "";

                if (applicants.length > 0) {
                    applicants.forEach(applicant => {
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
            })
            .catch(error => {
                console.error('Error searching applicants:', error);
                alert('An error occurred while searching applicants');
            });
    });
});