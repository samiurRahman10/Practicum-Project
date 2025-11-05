let cartArray = [];
let currentItems = [];

// Fetch all categories
const categoryFetch = () => {
    fetch('../Json Data/All.json')
        .then(res => res.json())
        .then(data => categoryDisplay(data.restaurant.categories));
}

const categoryDisplay = (category) => {
    const parent = document.getElementById('menu-catagory');
    parent.innerHTML = '';
    category.forEach(c => {
        const child = document.createElement('div');
        child.innerHTML = `
      <button onclick="fetchMenuCategoriewise(${c.id})" class="font-semibold">
        ${c.name}
      </button>`;
        parent.appendChild(child);
    });
}

categoryFetch();

// Fetch items by category
const fetchMenuCategoriewise = (id) => {
    fetch(`../Json Data/Catagory-${id}.json`)
        .then(res => res.json())
        .then(d => showMenuCategoriewise(d.items));
}

const showMenuCategoriewise = (item) => {
    currentItems = item;
    const parent = document.getElementById('cart-conteiner');
    parent.innerHTML = '';

    item.forEach((i, index) => {
        const child = document.createElement('div');
        child.innerHTML = `
      <div class="max-w-[500px] shadow-2xl rounded-lg">
        <img class="h-80 w-full rounded-t-2xl" src="${i.image}" alt="">
        <div class="p-5 space-y-6">
          <h1 class="text-2xl font-medium text-gray-700">${i.name}</h1>
          <h2>${i.description}</h2>
          <div class="flex justify-between">
            <h5 class="text-orange-500 text-2xl font-semibold">${i.price} Taka</h5>
            <button onclick="addToCart(${index})" class="bg-orange-500 text-white px-5 py-3 rounded-lg">
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
    fetch("../Json Data/Catagory-0.json")
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
      <div class="max-w-[500px] shadow-2xl rounded-lg">
        <img class="h-80 w-full rounded-t-2xl" src="${i.image}" alt="">
        <div class="p-5 space-y-6">
          <h1 class="text-2xl font-medium text-gray-700">${i.name}</h1>
          <h2>${i.description}</h2>
          <div class="flex justify-between">
            <h5 class="text-orange-500 text-2xl font-semibold">${i.price} Taka</h5>
            <button onclick="addToCart(${index})" class="bg-orange-500 text-white px-5 py-3 rounded-lg">
              Add to Cart
            </button>
          </div>
        </div>
      </div>`;
        parent.appendChild(child);
    });
}

fetchMenuAll();

//Add To Cart Function 
const addToCart = (index) => {
    const item = currentItems[index];
    cartArray.push({
        name: item.name,
        price: item.price
    });
    displayCartFunction(cartArray);
}

// Display to Cart Function

const displayCartFunction = (array) => {
    const parent = document.getElementById('cart-holder');
    parent.innerHTML = '';
    let totalMoney = 0;
    array.forEach((i, index) => {
        const child = document.createElement('div');
        child.innerHTML = `
         <div class="flex justify-between p-3 items-center bg-gray-100 rounded-xl">
                            <div>
                                <h1>${i.name}</h1>
                                <h2>${i.price}</h2>
                            </div>
                             <button onclick="deleteFromCart(${index})" class="text-gray-500 "><i class="fa-solid fa-xmark"></i></button>
                        </div>
      `
        totalMoney = totalMoney + i.price;
        parent.appendChild(child);
    })
    if (totalMoney > 0) {
        const child2 = document.createElement('h1');
        child2.innerHTML = `<div class="flex justify-end">
       <h1 class="font-bold">Total:<i class="fa-solid fa-bangladeshi-taka-sign"></i> ${totalMoney}</h1>
       </div>`
        parent.appendChild(child2);
    }
}
const deleteFromCart = (index)=> {
    cartArray.splice(index, 1);
    displayCartFunction(cartArray);
}