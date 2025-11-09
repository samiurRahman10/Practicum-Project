// Menu functionality
let currentItems = [];
let allCategories = [];
let currentCategoryId = null; // Track current category

// Fetch all categories
const categoryFetch = () => {
    fetch('./Json Data/All.json')
        .then(res => res.json())
        .then(data => categoryDisplay(data.restaurant.categories));
}

const categoryDisplay = (category) => {
    const parent = document.getElementById('menu-catagory');
    parent.innerHTML = '';

    // Add "All" category button
    // const allButton = document.createElement('div');
    // allButton.innerHTML = `
    //     <button onclick="showAllCategories()" class="font-semibold px-4 py-2 rounded-lg transition-all duration-300 bg-orange-500 text-white">
    //         All
    //     </button>`;
    // parent.appendChild(allButton);

    // Add individual category buttons
    category.forEach(c => {
        const child = document.createElement('div');
        child.innerHTML = `
            <button onclick="fetchMenuCategoriewise(${c.id})" class="font-semibold px-4 py-2 rounded-lg transition-all duration-300 hover:bg-orange-500 hover:text-white">
                ${c.name}
            </button>`;
        parent.appendChild(child);
    });
}

// Show all categories (reset to all items)
const showAllCategories = () => {
    currentCategoryId = null;
    updateCategoryButtons();
    fetchMenuAll();
}

// Update category button styles based on current selection
const updateCategoryButtons = () => {
    const buttons = document.querySelectorAll('#menu-catagory button');
    buttons.forEach(button => {
        if ((currentCategoryId === null && button.textContent.trim() === 'All') ||
            (button.textContent.trim() !== 'All' && button.onclick && button.onclick.toString().includes(currentCategoryId))) {
            button.classList.add('bg-orange-500', 'text-white');
            button.classList.remove('hover:bg-orange-500', 'hover:text-white', 'bg-gray-200');
        } else {
            button.classList.remove('bg-orange-500', 'text-white');
            button.classList.add('bg-gray-200', 'hover:bg-orange-500', 'hover:text-white');
        }
    });
}

// Fetch items by category
const fetchMenuCategoriewise = (id) => {
    currentCategoryId = id;
    updateCategoryButtons();
    fetch(`./Json Data/Catagory-${id}.json`)
        .then(res => res.json())
        .then(d => showMenuCategoriewise(d.items));
}

const showMenuCategoriewise = (item) => {
    currentItems = item;
    const parent = document.getElementById('cart-conteiner');
    parent.innerHTML = '';

    if (item.length === 0) {
        parent.innerHTML = '<p class="text-center text-gray-500 col-span-3">No items available in this category.</p>';
        return;
    }

    item.forEach((i, index) => {
        const child = document.createElement('div');
        child.innerHTML = `
            <div class="bg-white shadow-lg rounded-md hover:scale-105 h-[385px]">
           <img class="h-48 w-full object-cover rounded-t-lg" src="${i.image}" alt="${i.name}" onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop'">
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
           </div>`;
        parent.appendChild(child);
    });
}

// Fetch and show all items initially
const fetchMenuAll = () => {
    fetch("./Json Data/Catagory-0.json")
        .then(res => res.json())
        .then(d => showMenuAll(d.items));
}

const showMenuAll = (item) => {
    currentItems = item;
    const parent = document.getElementById('cart-conteiner');
    parent.innerHTML = '';

    item.forEach((i, index) => {
        const child = document.createElement('div');
        child.innerHTML = `
           <div class="bg-white shadow-lg hover:scale-105 rounded-md h-[385px] ">
           <img class="h-48 w-full object-cover rounded-t-lg" src="${i.image}" alt="${i.name}" onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop'">
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
           </div>`;
        parent.appendChild(child);
    });
}

// Initialize menu page
function initializeMenuPage() {
    categoryFetch();
    fetchMenuAll();
}

// Cart functionality
let cartArray = [];

// Add To Cart Function 
const addToCart = (index) => {
    const item = currentItems[index];

    // Check if item already exists in cart
    const existingItemIndex = cartArray.findIndex(cartItem => cartItem.name === item.name);

    if (existingItemIndex !== -1) {
        // Item exists, increase quantity
        cartArray[existingItemIndex].quantity += 1;
        showCartNotification(`${item.name} quantity updated!`, 'info');
    } else {
        // Add new item to cart
        cartArray.push({
            name: item.name,
            price: item.price,
            quantity: 1,
            image: item.image
        });
        showCartNotification(`${item.name} added to cart!`, 'success');
    }

    displayCartFunction(cartArray);
    updateCartCounter();
}

// Show cart notification
const showCartNotification = (message, type) => {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg text-white font-semibold z-50 transform transition-transform duration-300 ${type === 'success' ? 'bg-green-500' : 'bg-blue-500'
        }`;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.classList.add('translate-x-0');
    }, 100);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Update cart counter in header
const updateCartCounter = () => {
    const counter = document.getElementById('cart-counter');
    const totalItems = cartArray.reduce((total, item) => total + item.quantity, 0);

    if (counter) {
        counter.textContent = totalItems;
        counter.classList.toggle('hidden', totalItems === 0);
    }
}

// Display Cart Function
const displayCartFunction = (array) => {
    const parent = document.getElementById('cart-holder');
    const emptyCart = document.getElementById('empty-cart');
    const cartTotal = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');

    parent.innerHTML = '';

    if (array.length === 0) {
        emptyCart.classList.remove('hidden');
        cartTotal.classList.add('hidden');
        checkoutBtn.classList.add('hidden');
        return;
    }

    emptyCart.classList.add('hidden');
    cartTotal.classList.remove('hidden');
    checkoutBtn.classList.remove('hidden');

    let totalMoney = 0;

    array.forEach((i, index) => {
        const itemTotal = i.price * i.quantity;
        totalMoney += itemTotal;

        const child = document.createElement('div');
        child.className = 'flex justify-between items-center p-4 bg-white rounded-xl shadow-sm border';
        child.innerHTML = `
            <div class="flex items-center space-x-3">
                <img src="${i.image}" alt="${i.name}" class="w-12 h-12 rounded-lg object-cover">
                <div>
                    <h1 class="font-semibold text-gray-800">${i.name}</h1>
                    <h2 class="text-orange-500 font-medium">${i.price} Taka</h2>
                </div>
            </div>
            <div class="flex items-center space-x-3">
                <div class="flex items-center space-x-2">
                    <button onclick="decreaseQuantity(${index})" class="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors">
                        <i class="fa-solid fa-minus text-xs"></i>
                    </button>
                    <span class="font-semibold w-8 text-center">${i.quantity}</span>
                    <button onclick="increaseQuantity(${index})" class="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors">
                        <i class="fa-solid fa-plus text-xs"></i>
                    </button>
                </div>
                <button onclick="deleteFromCart(${index})" class="text-red-500 hover:text-red-700 transition-colors p-2">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        `;
        parent.appendChild(child);
    });

    // Update total
    document.getElementById('total-amount').textContent = totalMoney;
}

// Increase item quantity
const increaseQuantity = (index) => {
    cartArray[index].quantity += 1;
    displayCartFunction(cartArray);
    updateCartCounter();
}

// Decrease item quantity
const decreaseQuantity = (index) => {
    if (cartArray[index].quantity > 1) {
        cartArray[index].quantity -= 1;
    } else {
        deleteFromCart(index);
        return;
    }
    displayCartFunction(cartArray);
    updateCartCounter();
}

// Delete item from cart
const deleteFromCart = (index) => {
    const itemName = cartArray[index].name;
    cartArray.splice(index, 1);
    displayCartFunction(cartArray);
    updateCartCounter();
    showCartNotification(`${itemName} removed from cart!`, 'info');
}

// Clear entire cart
const clearCart = () => {
    if (cartArray.length > 0) {
        cartArray = [];
        displayCartFunction(cartArray);
        updateCartCounter();
        showCartNotification('Cart cleared!', 'info');
    }
}

// Checkout function
const checkout = () => {
    if (cartArray.length === 0) {
        showCartNotification('Your cart is empty!', 'info');
        return;
    }

    const total = cartArray.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    showCartNotification(`Order placed! Total: ${total} Taka`, 'success');

    // In a real app, you would send this data to a server
    console.log('Order Details:', {
        items: cartArray,
        total: total,
        timestamp: new Date().toISOString()
    });

    // Clear cart after successful checkout
    cartArray = [];
    displayCartFunction(cartArray);
    updateCartCounter();
}

// Toggle cart visibility (for mobile/responsive design)
const toggleCart = () => {
    const cartSection = document.getElementById('cart-section');
    cartSection.classList.toggle('hidden');
}