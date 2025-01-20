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
        
document.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault();

    const jobTitle = document.getElementById('jobTitle').value;
    const jobDescription = document.getElementById('jobDescription').value;
    const jobQualification = document.getElementById('jobQualification').value;
    const jobType = document.getElementById('jobType').value;

    fetch('/api/job-postings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ job_title: jobTitle, description: jobDescription, qualification: jobQualification, type: jobType }),
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        // Refresh or update UI
    })
    .catch(error => console.error('Error:', error));
});
