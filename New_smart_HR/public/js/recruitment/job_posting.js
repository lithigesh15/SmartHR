document.addEventListener('DOMContentLoaded', function () {
    const createJobForm = document.getElementById('create-job-form');
    let editingJobId = null; // Store the job ID when editing

    if (createJobForm) {
        createJobForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const jobTitle = document.getElementById('jobTitle').value;
            const jobDescription = document.getElementById('jobDescription').value;
            const jobQualification = document.getElementById('jobQualification').value;
            const jobType = document.getElementById('jobType').value;

            const jobData = {
                job_title: jobTitle,
                description: jobDescription,
                qualification: jobQualification,
                type: jobType
            };

            try {
                let response;
                if (editingJobId) {
                    // Update existing job
                    response = await fetch(`/recruitment/job-postings/${editingJobId}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(jobData),
                    });
                } else {
                    // Create a new job
                    response = await fetch('/recruitment/job-postings', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(jobData),
                    });
                }

                const data = await response.json();
                alert(data.message);
                window.location.reload();
            } catch (error) {
                console.error('Error:', error);
                alert('Failed to process job posting');
            }
        });
    }

    // Handle Edit Job
    document.querySelectorAll('.edit-job').forEach(button => {
        button.addEventListener('click', async function() {
            const jobId = this.getAttribute('data-id');
    
            try {
                const response = await fetch(`/recruitment/job-postings/${jobId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch job details');
                }
    
                const job = await response.json();
    
                if (job) {
                    document.getElementById('jobId').value = jobId;
                    document.getElementById('jobTitle').value = job.Job_Title;
                    document.getElementById('jobDescription').value = job.Job_Description;
                    document.getElementById('jobQualification').value = job.Qualifications;
                    document.getElementById('jobType').value = job.Job_Type;
    
                    createToggle.click(); // Switch to the create section
                }
            } catch (error) {
                console.error('Error fetching job details:', error);
                alert('Failed to fetch job details. Please try again.');
            }
        });
    });
    

    // Handle Delete Job
    document.querySelectorAll('.delete-job').forEach(button => {
        button.addEventListener('click', async function () {
            if (confirm('Are you sure you want to delete this job posting?')) {
                const jobId = this.getAttribute('data-id');

                try {
                    const response = await fetch(`/recruitment/job-postings/${jobId}`, {
                        method: 'DELETE',
                    });

                    const data = await response.json();
                    alert(data.message);
                    window.location.reload();
                } catch (error) {
                    console.error('Error deleting job posting:', error);
                    alert('Failed to delete job posting');
                }
            }
        });
    });

    // Toggle between sections
    const createToggle = document.getElementById('toggle-create');
    const manageToggle = document.getElementById('toggle-manage');
    const createSection = document.getElementById('create-section');
    const manageSection = document.getElementById('manage-section');

    createToggle.addEventListener('click', function () {
        createToggle.classList.add('active');
        manageToggle.classList.remove('active');
        createSection.classList.add('active');
        manageSection.classList.remove('active');
    });

    manageToggle.addEventListener('click', function () {
        manageToggle.classList.add('active');
        createToggle.classList.remove('active');
        manageSection.classList.add('active');
        createSection.classList.remove('active');
        editingJobId = null; // Reset editing mode
        createJobForm.reset(); // Clear form
    });
});

