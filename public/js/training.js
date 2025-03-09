document.addEventListener('DOMContentLoaded', function() {
    const addCourseBtn = document.getElementById('save-course-btn');
    const addCourseForm = document.getElementById('add-course-form');
    const courseList = document.getElementById('course-list');

    const enrollCourseModal = new bootstrap.Modal(document.getElementById('enrollCourseModal'));
    const addCourseModal = new bootstrap.Modal(document.getElementById('addCourseModal'));

    // Add Course
    addCourseBtn.addEventListener('click', function() {
        const title = document.getElementById('courseTitle').value;
        const description = document.getElementById('courseDescription').value;
        const category = document.getElementById('courseCategory').value;
        const duration = document.getElementById('courseDuration').value;

        // Validate inputs
        if (!title || !description || !category || !duration) {
            alert('Please fill in all required fields');
            return;
        }

        // Prepare data
        const courseData = {
            courseTitle: title,
            courseDescription: description,
            courseCategory: category,
            courseDuration: duration
        };

        // Send request
        fetch('/training/add-course', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Add CSRF token if you're using it
                // 'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
            },
            body: JSON.stringify(courseData)
        })
        .then(response => {
            // Check if the response is OK
            if (!response.ok) {
                // Try to parse error message
                return response.json().then(errorData => {
                    throw new Error(errorData.message || 'Failed to add course');
                });
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                // Close modal
                addCourseModal.hide();
                
                // Reload page or update course list
                window.location.reload();
            } else {
                // Show error message
                alert(data.message || 'Failed to add course');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert(error.message || 'An error occurred while adding the course');
        });
    });

    // Enroll Course Event Delegation
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-enroll')) {
            const courseId = e.target.getAttribute('data-course-id');
            document.getElementById('enrollCourseId').value = courseId;
            enrollCourseModal.show();
        }
    });

    // Confirm Enrollment
    document.getElementById('confirm-enroll-btn').addEventListener('click', function() {
        const employeeId = document.getElementById('employeeId').value;
        const courseId = document.getElementById('enrollCourseId').value;

        // Validate inputs
        if (!employeeId || !courseId) {
            alert('Please enter an Employee ID');
            return;
        }

        // Send enrollment request
        fetch('/training/enroll-course', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Add CSRF token if you're using it
                // 'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
            },
            body: JSON.stringify({
                employeeId: employeeId,
                courseId: courseId
            })
        })
        .then(response => {
            // Check if the response is OK
            if (!response.ok) {
                // Try to parse error message
                return response.json().then(errorData => {
                    throw new Error(errorData.message || 'Failed to enroll in course');
                });
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                alert('Successfully enrolled in the course');
                enrollCourseModal.hide();
            } else {
                alert(data.message || 'Failed to enroll in course');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert(error.message || 'An error occurred while enrolling in the course');
        });
    });
});