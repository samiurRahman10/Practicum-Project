  // Sidebar toggle functionality
        const toggleButton = document.getElementById('toggleSidebar');
        const mobileToggle = document.getElementById('mobileToggle');
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('overlay');

        function toggleSidebar() {
            const isOpen = sidebar.classList.contains('-translate-x-full');
            if (isOpen) {
                // Open sidebar
                sidebar.classList.remove('-translate-x-full');
                overlay.classList.remove('hidden');
            } else {
                // Close sidebar
                sidebar.classList.add('-translate-x-full');
                overlay.classList.add('hidden');
            }
        }

        // Add event listeners to both toggle buttons
        if (toggleButton) {
            toggleButton.addEventListener('click', toggleSidebar);
        }
        
        if (mobileToggle) {
            mobileToggle.addEventListener('click', toggleSidebar);
        }

        // Close sidebar when clicking overlay
        if (overlay) {
            overlay.addEventListener('click', () => {
                sidebar.classList.add('-translate-x-full');
                overlay.classList.add('hidden');
            });
        }

        // Analytics view functionality
        function showAnalytics(type) {
            // Hide all views
            document.getElementById('sales-view').classList.add('hidden');
            document.getElementById('orders-view').classList.add('hidden');
            document.getElementById('menu-view').classList.add('hidden');

            // Show the selected view
            document.getElementById(type + '-view').classList.remove('hidden');
        }

        // Initialize with sales view visible
        document.getElementById('sales-view').classList.remove('hidden');