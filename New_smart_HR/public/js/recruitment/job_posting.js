// public/js/recruitment/job_postings.js
document.addEventListener('DOMContentLoaded', function() {
    const toggleCreate = document.getElementById('toggle-create');
    const toggleManage = document.getElementById('toggle-manage');
    const createSection = document.getElementById('create-section');
    const manageSection = document.getElementById('manage-section');

    toggleCreate.addEventListener('click', () => {
        toggleCreate.classList.add('active');
        toggleManage.classList.remove('active');
        createSection.classList.add('active');
        manageSection.classList.remove('active');
    });

    toggleManage.addEventListener('click', () => {
        toggleManage.classList.add('active');
        toggleCreate.classList.remove('active');
        manageSection.classList.add('active');
        createSection.classList.remove('active');
    });
    
    document.getElementById('create-job-form').addEventListener('submit', (e) => {
        e.preventDefault();

        const jobTitle = document.getElementById('jobTitle').value;
        const jobDescription = document.getElementById('jobDescription').value;
        const jobQualification = document.getElementById('jobQualification').value;
        const jobType = document.getElementById('jobType').value;

        fetch('/recruitment/job-postings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                job_title: jobTitle, 
                description: jobDescription, 
                qualification: jobQualification, 
                type: jobType 
            }),
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            // Refresh page to show the new job posting
            window.location.reload();
        })
        .catch(error => console.error('Error:', error));
    });

    // Delete job posting functionality
    document.querySelectorAll('.delete-job').forEach(button => {
        button.addEventListener('click', function() {
            if (confirm('Are you sure you want to delete this job posting?')) {
                const jobId = this.getAttribute('data-id');
                fetch(`/recruitment/job-postings/${jobId}`, {
                    method: 'DELETE'
                })
                .then(response => response.json())
                .then(data => {
                    alert(data.message);
                    window.location.reload();
                })
                .catch(error => console.error('Error:', error));
            }
        });
    });
});