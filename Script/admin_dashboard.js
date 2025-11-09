
        // Global variables
        let cartArray = [];
        let currentItems = [];
        let allCategories = [];

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

            // Initialize menu page with your JSON data
            function initializeMenuPage() {
                categoryFetch();
                fetchMenuAll();
            }

            // Fetch all categories from your JSON
            function categoryFetch() {
                fetch('./Json Data/All.json')
                    .then(res => res.json())
                    .then(data => {
                        allCategories = data.restaurant.categories;
                        categoryDisplay(allCategories);
                    })
                    .catch(error => {
                        console.error('Error loading categories:', error);
                        // Fallback mock data
                        const mockCategories = [
                            { id: 0, name: "All Items" },
                            { id: 1, name: "Appetizers" },
                            { id: 2, name: "Main Course" },
                            { id: 3, name: "Desserts" },
                            { id: 4, name: "Beverages" }
                        ];
                        allCategories = mockCategories;
                        categoryDisplay(mockCategories);
                    });
            }

            function categoryDisplay(category) {
                const parent = document.getElementById('menu-catagory');
                parent.innerHTML = '';
                
                // Add "All Items" button
                const allButton = document.createElement('button');
                allButton.className = 'category-btn active bg-orange-500 text-white px-4 py-2 rounded-lg font-semibold transition-colors';
                allButton.innerHTML = 'All Items';
                allButton.onclick = () => {
                    document.querySelectorAll('.category-btn').forEach(btn => {
                        btn.classList.remove('active', 'bg-orange-500', 'text-white');
                        btn.classList.add('bg-white', 'text-gray-700');
                    });
                    allButton.classList.add('active', 'bg-orange-500', 'text-white');
                    allButton.classList.remove('bg-white', 'text-gray-700');
                    fetchMenuAll();
                };
                parent.appendChild(allButton);

                // Add other categories
                category.forEach(c => {
                    const child = document.createElement('button');
                    child.className = 'category-btn bg-white px-4 py-2 rounded-lg font-semibold text-gray-700 hover:bg-orange-500 hover:text-white transition-colors';
                    child.innerHTML = c.name;
                    child.onclick = () => {
                        // Remove active class from all buttons
                        document.querySelectorAll('.category-btn').forEach(btn => {
                            btn.classList.remove('active', 'bg-orange-500', 'text-white');
                            btn.classList.add('bg-white', 'text-gray-700');
                        });
                        // Add active class to clicked button
                        child.classList.add('active', 'bg-orange-500', 'text-white');
                        child.classList.remove('bg-white', 'text-gray-700');
                        
                        fetchMenuCategoriewise(c.id);
                    };
                    parent.appendChild(child);
                });
            }

            // Fetch items by category from your JSON files
            function fetchMenuCategoriewise(id) {
                fetch(`./Json Data/Catagory-${id}.json`)
                    .then(res => res.json())
                    .then(data => showMenuCategoriewise(data.items))
                    .catch(error => {
                        console.error(`Error loading category ${id}:`, error);
                        // Fallback mock data
                        const mockItems = getMockItemsByCategory(id);
                        showMenuCategoriewise(mockItems);
                    });
            }

            function showMenuCategoriewise(item) {
                currentItems = item;
                const parent = document.getElementById('cart-conteiner');
                parent.innerHTML = '';

                item.forEach((i, index) => {
                    const child = document.createElement('div');
                    child.className = 'menu-card bg-white rounded-lg shadow-lg overflow-hidden';
                    child.innerHTML = `
                        <img class="h-48 w-full object-cover" src="${i.image}" alt="${i.name}" onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop'">
                        <div class="p-5 space-y-4">
                            <div class="flex justify-between items-start">
                                <h1 class="text-xl font-semibold text-gray-800">${i.name}</h1>
                                <span class="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">Available</span>
                            </div>
                            <p class="text-gray-600 text-sm">${i.description}</p>
                            <div class="flex justify-between items-center">
                                <h5 class="text-orange-500 text-xl font-bold">${i.price} Taka</h5>
                                <button onclick="addToCart(${index})" class="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors">
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    `;
                    parent.appendChild(child);
                });

                updateMenuStats();
            }

            // Fetch and show all items initially from your JSON
            function fetchMenuAll() {
                fetch("./Json Data/Catagory-0.json")
                    .then(res => res.json())
                    .then(data => showMenuAll(data.items))
                    .catch(error => {
                        console.error('Error loading all items:', error);
                        // Fallback mock data
                        const mockItems = getMockItems();
                        showMenuAll(mockItems);
                    });
            }

            function showMenuAll(item) {
                currentItems = item;
                const parent = document.getElementById('cart-conteiner');
                parent.innerHTML = '';

                item.forEach((i, index) => {
                    const child = document.createElement('div');
                    child.className = 'menu-card bg-white rounded-lg shadow-lg overflow-hidden';
                    child.innerHTML = `
                        <img class="h-48 w-full object-cover" src="${i.image}" alt="${i.name}" onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop'">
                        <div class="p-5 space-y-4">
                            <div class="flex justify-between items-start">
                                <h1 class="text-xl font-semibold text-gray-800">${i.name}</h1>
                                <span class="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">Available</span>
                            </div>
                            <p class="text-gray-600 text-sm">${i.description}</p>
                            <div class="flex justify-between items-center">
                                <h5 class="text-orange-500 text-xl font-bold">${i.price} Taka</h5>
                                <button onclick="addToCart(${index})" class="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors">
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    `;
                    parent.appendChild(child);
                });

                updateMenuStats();
            }

            function updateMenuStats() {
                document.getElementById('total-items').textContent = currentItems.length;
                document.getElementById('total-categories').textContent = allCategories.length;
                document.getElementById('available-items').textContent = currentItems.length;
                document.getElementById('out-of-stock').textContent = '0';
            }

            // Order filter tabs (for orders page)
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

        // Cart functionality
        function addToCart(index) {
            const item = currentItems[index];
            cartArray.push({
                name: item.name,
                price: item.price
            });
            displayCartFunction(cartArray);
        }

        function displayCartFunction(array) {
            const parent = document.getElementById('cart-holder');
            let totalMoney = 0;
            
            if (array.length === 0) {
                parent.innerHTML = '<p class="text-gray-500 text-center py-8">Your cart is empty</p>';
            } else {
                parent.innerHTML = '';
                array.forEach((i, index) => {
                    const child = document.createElement('div');
                    child.className = 'flex justify-between p-3 items-center bg-gray-100 rounded-xl';
                    child.innerHTML = `
                        <div>
                            <h1 class="font-medium">${i.name}</h1>
                            <h2 class="text-orange-500 font-semibold">${i.price} Taka</h2>
                        </div>
                        <button onclick="deleteFromCart(${index})" class="text-gray-500 hover:text-red-500 transition-colors">
                            <i class="fas fa-times"></i>
                        </button>
                    `;
                    totalMoney = totalMoney + i.price;
                    parent.appendChild(child);
                });
            }
            
            document.getElementById('cart-total').textContent = `${totalMoney} Taka`;
        }

        function deleteFromCart(index) {
            cartArray.splice(index, 1);
            displayCartFunction(cartArray);
        }

        // Fallback mock data functions
        function getMockItems() {
            return [
                {
                    id: 1,
                    name: "Grilled Salmon",
                    description: "Fresh salmon grilled to perfection with herbs",
                    price: 24.99,
                    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop"
                },
                {
                    id: 2,
                    name: "Caesar Salad",
                    description: "Crisp romaine lettuce with Caesar dressing and croutons",
                    price: 12.99,
                    image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop"
                },
                {
                    id: 3,
                    name: "Beef Burger",
                    description: "Juicy beef patty with fresh vegetables and cheese",
                    price: 16.99,
                    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop"
                },
                {
                    id: 4,
                    name: "Chocolate Cake",
                    description: "Rich chocolate cake with chocolate frosting",
                    price: 8.99,
                    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop"
                }
            ];
        }

        function getMockItemsByCategory(categoryId) {
            // Return different items based on category
            const itemsByCategory = {
                1: [ // Appetizers
                    {
                        id: 5,
                        name: "Garlic Bread",
                        description: "Toasted bread with garlic butter and herbs",
                        price: 6.99,
                        image: "https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=400&h=300&fit=crop"
                    }
                ],
                2: [ // Main Course
                    {
                        id: 1,
                        name: "Grilled Salmon",
                        description: "Fresh salmon grilled to perfection with herbs",
                        price: 24.99,
                        image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop"
                    }
                ],
                3: [ // Desserts
                    {
                        id: 4,
                        name: "Chocolate Cake",
                        description: "Rich chocolate cake with chocolate frosting",
                        price: 8.99,
                        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop"
                    }
                ],
                4: [ // Beverages
                    {
                        id: 6,
                        name: "Fresh Orange Juice",
                        description: "Freshly squeezed orange juice",
                        price: 4.99,
                        image: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&h=300&fit=crop"
                    }
                ]
            };
            
            return itemsByCategory[categoryId] || getMockItems();
        }

        // Analytics functionality
        function showAnalytics(type) {
            document.getElementById('sales-view').classList.add('hidden');
            document.getElementById('orders-view').classList.add('hidden');
            document.getElementById('menu-view').classList.add('hidden');
            document.getElementById(`${type}-view`).classList.remove('hidden');
        }
    