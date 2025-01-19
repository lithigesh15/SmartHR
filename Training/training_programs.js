document.addEventListener("DOMContentLoaded", function () {
    // Updated courses data from the provided HTML
    const courses = [
        {
            name: "Python for Beginners",
            description: "Learn Python from scratch. Build programming skills step by step.",
            image: "Programs_cover/python.jpeg",
        },
        {
            name: "Advanced Java",
            description: "Master Java programming with advanced concepts and best practices.",
            image: "Programs_cover/java.jpeg",
        },
        {
            name: "Web Development",
            description: "Learn HTML, CSS, and JavaScript to build interactive websites.",
            image: "Programs_cover/web_development.jpeg",
        },
        {
            name: "Data Science",
            description: "Explore data analytics, machine learning, and AI techniques.",
            image: "Programs_cover/data_science.jpeg",
        },
        {
            name: "Project Management",
            description: "Develop skills to manage projects efficiently and meet deadlines.",
            image: "Programs_cover/porject_mang.jpeg",
        },
        {
            name: "Cybersecurity Basics",
            description: "Understand fundamental cybersecurity principles and practices.",
            image: "Programs_cover/cyber.jpeg",
        },
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
                    <button class="btn btn-primary enroll-btn">Enroll Now</button>
                </div>
            </div>
        `;
        courseContainer.appendChild(courseCard);
    });

    // Event listener for Enroll buttons
    document.querySelectorAll(".enroll-btn").forEach(button => {
        button.addEventListener("click", () => {
            const modal = new bootstrap.Modal(document.getElementById("enrollModal"));
            modal.show();
        });
    });

    // Handle form submission
    const enrollForm = document.getElementById("enrollForm");
    enrollForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const employeeId = document.getElementById("employeeId").value;
        const employeeName = document.getElementById("employeeName").value;
        const phoneNo = document.getElementById("phoneNo").value;
        const dob = document.getElementById("dob").value;

        // Simulate storing data (e.g., sending to a database)
        const enrollmentData = { employeeId, employeeName, phoneNo, dob };
        console.log("Enrollment Data:", enrollmentData);

        // Show success message
        alert(`You have successfully enrolled. Further details will be sent to ${phoneNo}.`);

        // Reset form
        enrollForm.reset();

        // Hide modal
        const modal = bootstrap.Modal.getInstance(document.getElementById("enrollModal"));
        modal.hide();
    });
});
