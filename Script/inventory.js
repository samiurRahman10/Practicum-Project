// Inventory Management System
let inventoryItems = [];
let filteredItems = [];

// Initialize inventory
const initializeInventory = () => {
    loadInventoryFromStorage();
    setupEventListeners();
    updateInventoryStats();
    renderInventoryTable();
    renderLowStockAlerts();
}

// Load inventory from localStorage or use sample data
const loadInventoryFromStorage = () => {
    const savedInventory = localStorage.getItem('dinesmart_inventory');
    if (savedInventory) {
        inventoryItems = JSON.parse(savedInventory);
    } else {
        // Sample inventory data
        inventoryItems = [
            {
                id: 1,
                name: "Salmon Fillet",
                category: "meat",
                currentStock: 5,
                unit: "kg",
                reorderLevel: 10,
                supplier: "Ocean Fresh Co.",
                status: "low_stock"
            },
            {
                id: 2,
                name: "Truffle Oil",
                category: "spices",
                currentStock: 3,
                unit: "L",
                reorderLevel: 5,
                supplier: "Gourmet Imports",
                status: "low_stock"
            },
            {
                id: 3,
                name: "Parmesan Cheese",
                category: "dairy",
                currentStock: 2,
                unit: "kg",
                reorderLevel: 5,
                supplier: "Italian Delights",
                status: "low_stock"
            },
            {
                id: 4,
                name: "Fresh Basil",
                category: "vegetables",
                currentStock: 0.1,
                unit: "kg",
                reorderLevel: 0.5,
                supplier: "Local Farm",
                status: "low_stock"
            },
            {
                id: 5,
                name: "Beef Patties",
                category: "meat",
                currentStock: 25,
                unit: "kg",
                reorderLevel: 10,
                supplier: "Prime Meats",
                status: "in_stock"
            },
            {
                id: 6,
                name: "Lettuce",
                category: "vegetables",
                currentStock: 8,
                unit: "kg",
                reorderLevel: 5,
                supplier: "Green Valley Farms",
                status: "in_stock"
            },
            {
                id: 7,
                name: "Tomatoes",
                category: "vegetables",
                currentStock: 12,
                unit: "kg",
                reorderLevel: 8,
                supplier: "Sunshine Produce",
                status: "in_stock"
            },
            {
                id: 8,
                name: "Cooking Oil",
                category: "other",
                currentStock: 15,
                unit: "L",
                reorderLevel: 5,
                supplier: "Chef's Choice",
                status: "in_stock"
            },
            {
                id: 9,
                name: "Mozzarella Cheese",
                category: "dairy",
                currentStock: 0,
                unit: "kg",
                reorderLevel: 8,
                supplier: "Italian Delights",
                status: "out_of_stock"
            },
            {
                id: 10,
                name: "Orange Juice",
                category: "beverages",
                currentStock: 24,
                unit: "bottles",
                reorderLevel: 12,
                supplier: "Fresh Squeezed Co.",
                status: "in_stock"
            }
        ];
        saveInventoryToStorage();
    }
    filteredItems = [...inventoryItems];
}

// Save inventory to localStorage
const saveInventoryToStorage = () => {
    localStorage.setItem('dinesmart_inventory', JSON.stringify(inventoryItems));
}
// Setup event listeners
const setupEventListeners = () => {
    // Search functionality
    const searchInput = document.getElementById('inventory-search');
    if (searchInput) {
        searchInput.addEventListener('input', filterInventory);
    }

    // Filter functionality
    const categoryFilter = document.getElementById('category-filter');
    const statusFilter = document.getElementById('status-filter');
    if (categoryFilter) categoryFilter.addEventListener('change', filterInventory);
    if (statusFilter) statusFilter.addEventListener('change', filterInventory);

    // Form submissions
    const addItemForm = document.getElementById('add-item-form');
    const editItemForm = document.getElementById('edit-item-form');
    if (addItemForm) addItemForm.addEventListener('submit', handleAddItem);
    if (editItemForm) editItemForm.addEventListener('submit', handleEditItem);
}

// Filter inventory based on search and filters
const filterInventory = () => {
    const searchTerm = document.getElementById('inventory-search').value.toLowerCase();
    const categoryFilter = document.getElementById('category-filter').value;
    const statusFilter = document.getElementById('status-filter').value;

    filteredItems = inventoryItems.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm);
        const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
        const matchesStatus = statusFilter === 'all' || item.status === statusFilter;

        return matchesSearch && matchesCategory && matchesStatus;
    });

    renderInventoryTable();
}

// Render inventory table
const renderInventoryTable = () => {
    const tbody = document.getElementById('inventory-table-body');
    if (!tbody) return;

    tbody.innerHTML = '';

    if (filteredItems.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="px-6 py-8 text-center text-gray-500">
                    No inventory items found matching your criteria.
                </td>
            </tr>
        `;
        return;
    }

    filteredItems.forEach(item => {
        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-50';
        
        const statusBadge = getStatusBadge(item.status);
        const stockLevelClass = getStockLevelClass(item.currentStock, item.reorderLevel);

        row.innerHTML = `
            <td class="px-6 py-4 font-medium text-gray-900">${item.name}</td>
            <td class="px-6 py-4 capitalize">${item.category.replace('_', ' ')}</td>
            <td class="px-6 py-4 font-semibold ${stockLevelClass}">${item.currentStock}</td>
            <td class="px-6 py-4 text-gray-500">${item.unit}</td>
            <td class="px-6 py-4 text-gray-500">${item.reorderLevel}</td>
            <td class="px-6 py-4 text-gray-500">${item.supplier}</td>
            <td class="px-6 py-4">${statusBadge}</td>
            <td class="px-6 py-4">
                <div class="flex gap-2">
                    <button onclick="openEditItemModal(${item.id})" class="text-blue-600 hover:text-blue-800 transition-colors">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="updateStock(${item.id}, 1)" class="text-green-600 hover:text-green-800 transition-colors" title="Increase Stock">
                        <i class="fas fa-plus"></i>
                    </button>
                    <button onclick="updateStock(${item.id}, -1)" class="text-yellow-600 hover:text-yellow-800 transition-colors" title="Decrease Stock">
                        <i class="fas fa-minus"></i>
                    </button>
                    <button onclick="deleteItem(${item.id})" class="text-red-600 hover:text-red-800 transition-colors">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Get status badge HTML
const getStatusBadge = (status) => {
    const statusConfig = {
        'in_stock': { text: 'In Stock', class: 'bg-green-100 text-green-800' },
        'low_stock': { text: 'Low Stock', class: 'bg-yellow-100 text-yellow-800' },
        'out_of_stock': { text: 'Out of Stock', class: 'bg-red-100 text-red-800' }
    };
    
    const config = statusConfig[status] || statusConfig.in_stock;
    return `<span class="px-2 py-1 rounded-full text-xs font-semibold ${config.class}">${config.text}</span>`;
}

// Get stock level class for styling
const getStockLevelClass = (currentStock, reorderLevel) => {
    if (currentStock === 0) return 'text-red-600';
    if (currentStock <= reorderLevel) return 'text-yellow-600';
    return 'text-green-600';
}

// Update inventory statistics
const updateInventoryStats = () => {
    const totalItems = inventoryItems.length;
    const inStockItems = inventoryItems.filter(item => item.status === 'in_stock').length;
    const lowStockItems = inventoryItems.filter(item => item.status === 'low_stock').length;
    const outOfStockItems = inventoryItems.filter(item => item.status === 'out_of_stock').length;

    document.getElementById('total-inventory-items').innerHTML = totalItems;
    document.getElementById('in-stock-items').innerHTML = inStockItems;
    document.getElementById('low-stock-items').innerHTML = lowStockItems;
    document.getElementById('out-of-stock-items').innerHTML = outOfStockItems;
}

// Render low stock alerts
const renderLowStockAlerts = () => {
    const alertsContainer = document.getElementById('low-stock-alerts');
    const countElement = document.getElementById('low-stock-count');
    
    if (!alertsContainer) return;

    const lowStockItems = inventoryItems.filter(item => 
        item.status === 'low_stock' || item.status === 'out_of_stock'
    );

    if (lowStockItems.length === 0) {
        alertsContainer.innerHTML = '<p class="text-yellow-700">No low stock alerts at this time.</p>';
        if (countElement) countElement.textContent = '0 items';
        return;
    }

    if (countElement) countElement.textContent = `${lowStockItems.length} items`;

    alertsContainer.innerHTML = '';
    lowStockItems.forEach(item => {
        const alert = document.createElement('div');
        alert.className = 'flex justify-between items-center p-3 bg-yellow-100 rounded-lg';
        alert.innerHTML = `
            <div>
                <span class="font-semibold text-yellow-800">${item.name}</span>
                <span class="text-yellow-700 text-sm ml-2">${item.currentStock} ${item.unit} remaining</span>
            </div>
            <button onclick="reorderItem(${item.id})" class="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded text-sm transition-colors">
                Reorder
            </button>
        `;
        alertsContainer.appendChild(alert);
    });
}

// Modal functions
const openAddItemModal = () => {
    document.getElementById('add-item-modal').classList.remove('hidden');
    document.getElementById('add-item-form').reset();
}

const closeAddItemModal = () => {
    document.getElementById('add-item-modal').classList.add('hidden');
}

const openEditItemModal = (itemId) => {
    const item = inventoryItems.find(i => i.id === itemId);
    if (!item) return;

    document.getElementById('edit-item-id').value = item.id;
    document.getElementById('edit-item-name').value = item.name;
    document.getElementById('edit-item-category').value = item.category;
    document.getElementById('edit-item-stock').value = item.currentStock;
    document.getElementById('edit-item-unit').value = item.unit;
    document.getElementById('edit-item-reorder-level').value = item.reorderLevel;
    document.getElementById('edit-item-supplier').value = item.supplier;

    document.getElementById('edit-item-modal').classList.remove('hidden');
}

const closeEditItemModal = () => {
    document.getElementById('edit-item-modal').classList.add('hidden');
}

// Form handlers
const handleAddItem = (e) => {
    e.preventDefault();
    
    const newItem = {
        id: Date.now(), // Simple ID generation
        name: document.getElementById('item-name').value,
        category: document.getElementById('item-category').value,
        currentStock: parseFloat(document.getElementById('item-stock').value),
        unit: document.getElementById('item-unit').value,
        reorderLevel: parseFloat(document.getElementById('item-reorder-level').value),
        supplier: document.getElementById('item-supplier').value,
        status: 'in_stock'
    };

    // Update status based on stock level
    updateItemStatus(newItem);

    inventoryItems.push(newItem);
    saveInventoryToStorage();
    filterInventory();
    updateInventoryStats();
    renderLowStockAlerts();
    closeAddItemModal();

    showNotification('Item added successfully!', 'success');
}

const handleEditItem = (e) => {
    e.preventDefault();
    
    const itemId = parseInt(document.getElementById('edit-item-id').value);
    const itemIndex = inventoryItems.findIndex(item => item.id === itemId);
    
    if (itemIndex === -1) return;

    inventoryItems[itemIndex] = {
        ...inventoryItems[itemIndex],
        name: document.getElementById('edit-item-name').value,
        category: document.getElementById('edit-item-category').value,
        currentStock: parseFloat(document.getElementById('edit-item-stock').value),
        unit: document.getElementById('edit-item-unit').value,
        reorderLevel: parseFloat(document.getElementById('edit-item-reorder-level').value),
        supplier: document.getElementById('edit-item-supplier').value
    };

    // Update status based on new stock level
    updateItemStatus(inventoryItems[itemIndex]);

    saveInventoryToStorage();
    filterInventory();
    updateInventoryStats();
    renderLowStockAlerts();
    closeEditItemModal();

    showNotification('Item updated successfully!', 'success');
}

// Update item status based on stock level
const updateItemStatus = (item) => {
    if (item.currentStock === 0) {
        item.status = 'out_of_stock';
    } else if (item.currentStock <= item.reorderLevel) {
        item.status = 'low_stock';
    } else {
        item.status = 'in_stock';
    }
}

// Update stock quantity
const updateStock = (itemId, change) => {
    const itemIndex = inventoryItems.findIndex(item => item.id === itemId);
    if (itemIndex === -1) return;

    const newStock = inventoryItems[itemIndex].currentStock + change;
    if (newStock < 0) return;

    inventoryItems[itemIndex].currentStock = newStock;
    updateItemStatus(inventoryItems[itemIndex]);

    saveInventoryToStorage();
    filterInventory();
    updateInventoryStats();
    renderLowStockAlerts();

    showNotification(`Stock updated for ${inventoryItems[itemIndex].name}`, 'success');
}

// Delete item
const deleteItem = (itemId) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    inventoryItems = inventoryItems.filter(item => item.id !== itemId);
    saveInventoryToStorage();
    filterInventory();
    updateInventoryStats();
    renderLowStockAlerts();

    showNotification('Item deleted successfully!', 'success');
}

// Reorder item
const reorderItem = (itemId) => {
    const item = inventoryItems.find(i => i.id === itemId);
    if (!item) return;

    // In a real app, this would trigger a reorder process
    showNotification(`Reorder request sent for ${item.name} to ${item.supplier}`, 'info');
}

// Export inventory
const exportInventory = () => {
    const dataStr = JSON.stringify(inventoryItems, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = 'inventory-export.json';
    link.click();
    
    showNotification('Inventory exported successfully!', 'success');
}

// Refresh inventory
const refreshInventory = () => {
    loadInventoryFromStorage();
    filterInventory();
    updateInventoryStats();
    renderLowStockAlerts();
    showNotification('Inventory refreshed!', 'success');
}

// Show notification
const showNotification = (message, type = 'info') => {
    // Create notification element
    const notification = document.createElement('div');
    const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';
    
    notification.className = `fixed top-4 right-4 ${bgColor} text-white px-4 py-2 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300`;
    notification.innerHTML = `
        <div class="flex items-center gap-2">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => notification.classList.remove('translate-x-full'), 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Make functions globally available
window.initializeInventory = initializeInventory;
window.openAddItemModal = openAddItemModal;
window.closeAddItemModal = closeAddItemModal;
window.openEditItemModal = openEditItemModal;
window.closeEditItemModal = closeEditItemModal;
window.updateStock = updateStock;
window.deleteItem = deleteItem;
window.reorderItem = reorderItem;
window.exportInventory = exportInventory;
window.refreshInventory = refreshInventory;