document.addEventListener('DOMContentLoaded', function() {
    // Function to update dashboard statistics via AJAX
    function updateDashboardStats() {
        fetch('/dashboard/stats')
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Update each stat box with new data
                    const stats = data.stats;
                    
                    // Update attendance stats
                    updateStatBox('Attendance', stats.attendance);
                    
                    // Update projects stats
                    updateStatBox('Total Projects', stats.projects);
                    
                    // Update clients stats
                    updateStatBox('Total Clients', stats.clients);
                    
                    // Update tasks stats
                    updateStatBox('Total Tasks', stats.tasks);
                }
            })
            .catch(error => {
                console.error('Error updating dashboard stats:', error);
            });
    }
    
    // Helper function to update a specific stat box
    function updateStatBox(title, data) {
        const boxes = document.querySelectorAll('.box');
        boxes.forEach(box => {
            const boxTitle = box.querySelector('.box-title');
            if (boxTitle && boxTitle.textContent.trim() === title) {
                const valueElement = box.querySelector('.box-value');
                const changeElement = box.querySelector('.box-change');
                
                if (valueElement) valueElement.textContent = data.value;
                
                if (changeElement) {
                    changeElement.textContent = data.change;
                    changeElement.className = `box-change text-${data.trend === 'up' ? 'success' : 'danger'}`;
                }
            }
        });
    }
    
    // Update stats every minute
    setInterval(updateDashboardStats, 60000);
    
    // Initial update
    updateDashboardStats();
    
    // Button hover effects
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.classList.add('pulse');
        });
        
        btn.addEventListener('mouseleave', function() {
            this.classList.remove('pulse');
        });
    });
    
    // Box hover effects
    document.querySelectorAll('.box').forEach(box => {
        box.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0px 6px 12px rgba(0, 0, 0, 0.2)';
        });
        
        box.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0px 4px 8px rgba(0, 0, 0, 0.1)';
        });
    });
    
    // Add notification functionality
    const notificationBtn = document.getElementById('notificationBtn');
    if (notificationBtn) {
        notificationBtn.addEventListener('click', function() {
            // Toggle notification dropdown would go here
            console.log('Notifications toggled');
        });
    }
    
    // Add theme switcher functionality
    const themeSwitcher = document.getElementById('themeSwitcher');
    if (themeSwitcher) {
        themeSwitcher.addEventListener('change', function() {
            document.documentElement.setAttribute('data-bs-theme', this.checked ? 'dark' : 'light');
            localStorage.setItem('theme', this.checked ? 'dark' : 'light');
        });
        
        // Set initial theme based on localStorage or system preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            document.documentElement.setAttribute('data-bs-theme', savedTheme);
            themeSwitcher.checked = savedTheme === 'dark';
        } else {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            document.documentElement.setAttribute('data-bs-theme', prefersDark ? 'dark' : 'light');
            themeSwitcher.checked = prefersDark;
        }
    }
});