// Orders functionality
document.addEventListener('DOMContentLoaded', function() {
    // Order filter tabs
    const orderTabs = document.querySelectorAll('.order-tab');
    const orderCards = document.querySelectorAll('.order-card');
    
    orderTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const status = this.getAttribute('data-status');
            
            // Update active tab
            orderTabs.forEach(t => {
                t.classList.remove('active', 'border-orange-500', 'text-orange-500');
                t.classList.add('text-gray-500');
            });
            this.classList.add('active', 'border-orange-500', 'text-orange-500');
            this.classList.remove('text-gray-500');
            
            // Filter orders
            orderCards.forEach(card => {
                if (status === 'all' || card.getAttribute('data-status') === status) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
});