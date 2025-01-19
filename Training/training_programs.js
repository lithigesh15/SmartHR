document.addEventListener("DOMContentLoaded", function () {
    const courses = [
        { name: "Leadership Training", description: "Enhance leadership skills for better management.", image: "leadership.jpg" },
        { name: "Data Analysis", description: "Learn data-driven decision-making techniques.", image: "data_analysis.jpg" },
        { name: "Project Management", description: "Master project planning and execution.", image: "project_management.jpg" },
        { name: "Communication Skills", description: "Improve workplace communication effectiveness.", image: "communication.jpg" },
        { name: "Cybersecurity Basics", description: "Understand fundamental cybersecurity principles.", image: "cybersecurity.jpg" },
        { name: "AI & Machine Learning", description: "Introduction to AI and ML concepts.", image: "ai_ml.jpg" }
    ];

    const courseContainer = document.getElementById("course-list");

    courses.forEach(course => {
        const courseCard = document.createElement("div");
        courseCard.className = "col-md-4 mb-4";
        courseCard.innerHTML = `
            <div class="card">
                <img src="../Resources/${course.image}" class="card-img-top" alt="${course.name}">
                <div class="card-body">
                    <h5 class="card-title">${course.name}</h5>
                    <p class="card-text">${course.description}</p>
                    <a href="#" class="btn btn-primary">Enroll Now</a>
                </div>
            </div>
        `;
        courseContainer.appendChild(courseCard);
    });
});
