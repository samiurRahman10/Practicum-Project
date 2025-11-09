// Navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    // Page navigation
    const navItems = document.querySelectorAll('.nav-item');
    const pageContents = document.querySelectorAll('.page-content');
    
    // Function to switch pages
    function switchPage(targetPage) {
        // Hide all pages
        pageContents.forEach(page => page.classList.remove('active'));
        
        // Show target page
        const targetElement = document.getElementById(`${targetPage}-page`);
        if (targetElement) {
            targetElement.classList.add('active');
        }
        
        // Update active nav item
        navItems.forEach(nav => {
            nav.classList.remove('bg-orange-100', 'text-orange-500', 'font-bold');
            nav.classList.add('font-semibold');
        });
        
        const activeNav = document.querySelector(`.nav-item[data-page="${targetPage}"]`);
        if (activeNav) {
            activeNav.classList.add('bg-orange-100', 'text-orange-500', 'font-bold');
            activeNav.classList.remove('font-semibold');
        }
        
        // Close mobile sidebar
        if (window.innerWidth < 768) {
            document.getElementById('sidebar').classList.add('-translate-x-full');
            document.getElementById('overlay').classList.add('hidden');
        }

        // Load menu data if switching to menu page
        if (targetPage === 'menu') {
            initializeMenuPage();
        }
    }
    
    // Add click events to nav items
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const targetPage = this.getAttribute('data-page');
            switchPage(targetPage);
        });
    });

    // Sidebar toggle functionality
    document.getElementById('toggleSidebar').addEventListener('click', function() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('overlay');
        sidebar.classList.toggle('-translate-x-full');
        overlay.classList.toggle('hidden');
    });

    document.getElementById('mobileToggle').addEventListener('click', function() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('overlay');
        sidebar.classList.toggle('-translate-x-full');
        overlay.classList.toggle('hidden');
    });

    document.getElementById('overlay').addEventListener('click', function() {
        const sidebar = document.getElementById('sidebar');
        sidebar.classList.add('-translate-x-full');
        this.classList.add('hidden');
    });

    // Set dashboard as active by default
    switchPage('dashboard');
});