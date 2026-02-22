class Product {
    constructor(id, name, price, Details, image) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.Details = Details;
        this.image = image;
        this.isInCart = false;
        this.isFavorite = false;
        this.quantity = 1;
    }
}

const products = [
    new Product(1, 'Slot Knife Sharpener', 50, 'Safe, stable & easy to clean', 'pic/pic1.jpg'),
    new Product(2, 'Digital Kitchen Scale (10kg)', 135, 'Sleek, simple & easy to use', 'pic/pic2.jpg'),
    new Product(3, 'Waterproof Wash Machine Cover', 70, 'Soft, durable & imported material', 'pic/pic3.jpg'),
    new Product(4, 'Stainless Steel Scrubbing Glove', 40, 'Waterproof glove with stainless steel', 'pic/pic4.jpg'),
    new Product(5, '2-in-1 Double-Faced Soap Holder', 50, '3 hooks for soap & sponge storage', 'pic/pic5.jpg'),
    new Product(6, 'Decorative Trash Bin (8.5L)', 185, 'Perfect for any room and so flexible', 'pic/pic6.jpg'),
    new Product(7, 'Mood The Cup', 450, 'Dual sip openings & silicone straw', 'pic/pic7.jpg'),
    new Product(8, 'Mini Multi-Purpose Drawer', 35, 'Easy install with double-sided tape', 'pic/pic8.jpg'),
    new Product(9, 'Morning Glass Mug (400ml)', 55, 'Perfect for hot & cold drinks', 'pic/pic9.jpg'),
];



function simpleHash(password) {
    return Array.from(password).reduce((hash, char) => hash + char.charCodeAt(0), 0).toString();
}

function showAlert(message, type) {
    Swal.fire({
        icon: type, 
        title: message,
        showConfirmButton: false,
        timer: 2000
    });
}

function renderProducts(productList) {
    const productsRow = document.getElementById('products-row');
    if (!productsRow) return;
    productsRow.innerHTML = '';
    if (productList.length === 0) {
        productsRow.innerHTML = '<p style="text-align: center;">No products found.</p>';
        return;
    }
    productList.forEach(product => {
        const productCard = `
            <div class="col-md-4 mb-4">
                <div class="card">
                    <img src="${product.image}" class="card-img-top" alt="${product.name} onclick="openImageModal('${product.image}')">
                    <div class="card-body">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text"><b>Price:</b> ${product.price} EGP</p>
                        <p class="card-text"><b>Details:</b> ${product.Details}</p>
                        <div class="action-container">
                            <button class="btn btn-primary ${product.isInCart ? 'active' : ''}" onclick="toggleCart(${product.id})">
                                ${product.isInCart ? 'Remove from Cart' : 'Add to Cart'}
                            </button>
                            <i class="fas fa-heart ${product.isFavorite ? 'active' : ''}" onclick="toggleFavorite(${product.id})"></i>
                        </div>
                    </div>
                </div>
            </div>`;
        productsRow.insertAdjacentHTML('beforeend', productCard);
    });
}

function searchProducts() {
    const searchType = document.getElementById('searchType')?.value;
    const searchText = document.getElementById('searchBox')?.value.toLowerCase() || '';
    const filteredProducts = products.filter(product => {
        if (searchType === 'name') {
            return product.name.toLowerCase().includes(searchText);
        } else if (searchType === 'Details') {
            return product.Details.toLowerCase().includes(searchText);
        }
        return false;
    });
    renderProducts(filteredProducts);
}

function redirectTo(url) {
    window.location.href = url;
}

function login(e) {
    console.log('Login function called'); 
    if (e) e.preventDefault();
    const email = document.getElementById('email')?.value;
    const password = document.getElementById('password')?.value;
    console.log('Login attempt:', email, password); 
    if (!email || !password) {
        showAlert('Please fill all fields.', 'warning');
        return;
    }
    let users = JSON.parse(localStorage.getItem('users'));
    if (!users || !Array.isArray(users)) {
        users = []; 
    }
    console.log('Users from localStorage:', users); 
    const hashedPassword = simpleHash(password);
    const user = users.find(u => u.email === email && u.password === hashedPassword);
    console.log('Found user:', user); 
    if (user) {
        localStorage.setItem('loggedInUser', JSON.stringify(user));
        localStorage.setItem('loggedIn', JSON.stringify(true));
        showAlert('Login successful!', 'success');
        setTimeout(() => redirectTo('index.html'), 2000);
    } else {
        showAlert('Your account is not registered, please register an account', 'danger');
    }
}

function register(e) {
    console.log('Register function called'); 
    if (e) e.preventDefault();
    const firstName = document.getElementById('firstName')?.value;
    const lastName = document.getElementById('lastName')?.value;
    const email = document.getElementById('email')?.value;
    const password = document.getElementById('password')?.value;
    console.log('Register attempt:', firstName, lastName, email, password); // Debug
    if (!firstName || !lastName || !email || !password) {
        showAlert('Please fill all fields.', 'warning');
        return;
    }
    let users = JSON.parse(localStorage.getItem('users'));
    if (!users || !Array.isArray(users)) {
        users = []; 
    }
    if (users.find(u => u.email === email)) {
        showAlert('Email already registered.', 'danger');
        return;
    }
    const hashedPassword = simpleHash(password);
    const newUser = { firstName, lastName, email, password: hashedPassword };
    users.push(newUser); 
    localStorage.setItem('users', JSON.stringify(users));
    console.log('New user saved:', newUser); 
    console.log('Updated users:', users); 
    showAlert('Registration is successful', 'success');
    setTimeout(() => redirectTo('login.html'), 2000);
}

function logout() {
    localStorage.removeItem('loggedInUser');
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('cart');
    localStorage.removeItem('favorites');
    showAlert('Logged out successfully.', 'success');
    setTimeout(() => redirectTo('index.html'), 2000);
}

function toggleCart(productId) {
    const isLoggedIn = JSON.parse(localStorage.getItem('loggedIn'));
    if (!isLoggedIn) {
        showAlert('Please login to add items to cart.', 'warning');
        setTimeout(() => redirectTo('login.html'), 2000);
        return;
    }
    const product = products.find(p => p.id === productId);
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (product.isInCart) {
        product.isInCart = false;
        product.quantity = 1;
        const index = cart.findIndex(p => p.id === productId);
        if (index > -1) cart.splice(index, 1);
    } else {
        product.isInCart = true;
        product.quantity = 1;
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: product.quantity,
            Details: product.Details
        });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    saveCartAndFavorites();
    updateCartCount();
    updateCartDropdown();
    renderProducts(products);
}

function toggleFavorite(productId) {
    const isLoggedIn = JSON.parse(localStorage.getItem('loggedIn'));
    if (!isLoggedIn) {
        showAlert('Please login to add items to favorites.', 'warning');
        setTimeout(() => redirectTo('login.html'), 2000);
        return;
    }
    const product = products.find(p => p.id === productId);
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    if (product.isFavorite) {
        product.isFavorite = false;
        const index = favorites.findIndex(p => p.id === productId);
        if (index > -1) favorites.splice(index, 1);
    } else {
        product.isFavorite = true;
        favorites.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            Details: product.Details
        });
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
    renderProducts(products);
    if (window.location.href.includes('cart.html')) {
        renderFavoriteItems();
    }
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    const cartCountElement = document.getElementById('cartCount');
    if (cartCountElement) cartCountElement.textContent = cartCount;
}

function updateCartDropdown() {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const cartDropdownItems = document.getElementById('cartDropdownItems');
    if (!cartDropdownItems) return;

    cartDropdownItems.innerHTML = '';
    if (cartItems.length === 0) {
        cartDropdownItems.innerHTML = '<p style="text-align: center;">Your cart is empty.</p>';
        return;
    }

    cartItems.forEach(item => {
        const cartItem = `
            <div class="cart-item_dd justify-content-between align-items-center mb-2 p-2">
                <div class="ml-2 d-flex flex-column">
                    <h6 class="mb-0">${item.name}</h6>
                    <p class="mb-0">Price: <span id="itemPrice${item.id}">${item.price * item.quantity} EGP</span></p>
                </div>
                <div class="d-flex align-items-center">
                    <button class="btn btn-sm btn-outline-secondary" onclick="decreaseQuantity(${item.id})">-</button>
                    <span id="itemQuantity${item.id}" class="mx-2">${item.quantity}</span>
                    <button class="btn btn-sm btn-outline-secondary" onclick="increaseQuantity(${item.id})">+</button>
                </div>
            </div>`;
        cartDropdownItems.insertAdjacentHTML('beforeend', cartItem);
    });

    // زرار Go to Cart
    cartDropdownItems.insertAdjacentHTML('beforeend', `
        <div class="text-center mt-3">
            <button class="btn btn-primary btn-sm" onclick="redirectTo('cart.html')">Go to Cart</button>
        </div>
    `);

    updateCartCount();
}


function toggleCartDropdown() {
    const cartDropdown = document.getElementById('cartDropdownItems');
    if (cartDropdown) cartDropdown.classList.toggle('show');

}

function renderCartItems() {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsContainer = document.getElementById('cart-items');
    if (!cartItemsContainer) return;
    cartItemsContainer.innerHTML = '';
    if (cartItems.length === 0) {
        cartItemsContainer.innerHTML = '<p style="text-align: center;">Your cart is empty.</p>';
        return;
    }
    const cartItemsHtml = cartItems.map(item => `
        <div class="col-md-6 mb-4">
            <div class="card d-flex flex-row align-items-center" data-product-id="${item.id}">
                <img src="${item.image}" class="card-img-left" alt="${item.name}" style="width: 100px; height: auto;">
                <div class="card-body">
                    <h5 class="card-title">${item.name}</h5>
                    <p class="card-text">Details: ${item.Details}</p>
                    <p class="card-text">Price: <span id="itemPrice${item.id}">${item.price * item.quantity} EGP</span></p>
                    <div class="d-flex align-items-center">
                        <button class="btn btn-sm btn-outline-secondary" onclick="decreaseQuantity(${item.id})">-</button>
                        <span id="itemQuantity${item.id}" class="mx-2">${item.quantity}</span>
                        <button class="btn btn-sm btn-outline-secondary" onclick="increaseQuantity(${item.id})">+</button>
                        <button class="btn btn-danger ml-3" onclick="removeFromCart(${item.id})">Remove</button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
    cartItemsContainer.innerHTML = `<div class="row">${cartItemsHtml}</div>`;
    updateTotalPrice();
}

function renderFavoriteItems() {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const favoriteItemsContainer = document.getElementById('favorite-items');
    if (!favoriteItemsContainer) return;
    favoriteItemsContainer.innerHTML = '';
    if (favorites.length === 0) {
        favoriteItemsContainer.innerHTML = '<p class="text-center">You have no favorite items.</p>';
        return;
    }
    const favoriteItemsHtml = favorites.map(item => `
        <div class="card card_fav" data-product-id="${item.id}">
            <img src="${item.image}" class="card-img-top" alt="${item.name}">
            <div class="card-body">
                <h5 class="card-title">${item.name}</h5>
                <p class="card-text">Details: ${item.Details}</p>
                <i class="fas fa-heart active" onclick="toggleFavorite(${item.id})"></i>
            </div>
        </div>
    `).join('');
    favoriteItemsContainer.innerHTML = favoriteItemsHtml;
}

function increaseQuantity(productId) {
    const product = products.find(p => p.id === productId);
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    product.quantity++;
    const cartItem = cart.find(p => p.id === productId);
    if (cartItem) {
        cartItem.quantity = product.quantity;
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    if (document.getElementById(`itemQuantity${productId}`)) {
        document.getElementById(`itemQuantity${productId}`).textContent = product.quantity;
        document.getElementById(`itemPrice${productId}`).textContent = product.price * product.quantity + ' EGP';
    }
    updateCartDropdown();
    renderCartItems();
    updateTotalPrice();
}

function decreaseQuantity(productId) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const product = products.find(p => p.id === productId);
    if (product && product.isInCart) {
        product.quantity--;
        if (product.quantity <= 0) {
            product.isInCart = false;
            const index = cart.findIndex(p => p.id === productId);
            if (index > -1) cart.splice(index, 1);
            const productCardButton = document.querySelector(`button[onclick="toggleCart(${productId})"]`);
            if (productCardButton) {
                productCardButton.textContent = 'Add to Cart';
                productCardButton.classList.remove('active');
            }
        } else {
            const cartItem = cart.find(p => p.id === productId);
            if (cartItem) {
                cartItem.quantity = product.quantity;
            }
            if (document.getElementById(`itemQuantity${productId}`)) {
                document.getElementById(`itemQuantity${productId}`).textContent = product.quantity;
                document.getElementById(`itemPrice${productId}`).textContent = product.price * product.quantity + ' EGP';
            }
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartDropdown();
        renderCartItems();
        updateTotalPrice();
    }
}

function updateTotalPrice() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    const totalPriceElement = document.getElementById('totalPrice');
    if (totalPriceElement) totalPriceElement.textContent = totalPrice.toFixed(2) + ' EGP';
}

function removeFromCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        product.isInCart = false;
        product.quantity = 1;
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const index = cart.findIndex(p => p.id === productId);
        if (index > -1) cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCartItems();
        updateCartDropdown();
        updateTotalPrice();
        updateCartCount();
        renderProducts(products);
    }
}

function saveCartAndFavorites() {
    const cart = products.filter(product => product.isInCart).map(product => ({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: product.quantity,
        Details: product.Details
    }));
    const favorites = products.filter(product => product.isFavorite).map(product => ({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        Details: product.Details
    }));
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

function loadCartAndFavorites() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    products.forEach(product => {
        const cartProduct = cart.find(p => p.id === product.id);
        const favoriteProduct = favorites.find(p => p.id === product.id);
        if (cartProduct) {
            product.isInCart = true;
            product.quantity = cartProduct.quantity;
        } else {
            product.isInCart = false;
            product.quantity = 1;
        }
        product.isFavorite = !!favoriteProduct;
    });
}

function updateUserDisplay() {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    const isLoggedIn = JSON.parse(localStorage.getItem('loggedIn'));
    const usernameDisplay = document.getElementById('usernameDisplay');
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    if (loggedInUser && isLoggedIn && usernameDisplay) {
        usernameDisplay.textContent = `Hello, ${loggedInUser.firstName}`;
        if (loginBtn) loginBtn.classList.add('d-none');
        if (registerBtn) registerBtn.classList.add('d-none');
        if (logoutBtn) logoutBtn.classList.remove('d-none');
    } else {
        if (usernameDisplay) usernameDisplay.textContent = '';
        if (loginBtn) loginBtn.classList.remove('d-none');
        if (registerBtn) registerBtn.classList.remove('d-none');
        if (logoutBtn) logoutBtn.classList.add('d-none');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing...'); 
    renderProducts(products);
    loadCartAndFavorites();
    updateCartCount();
    updateCartDropdown();
    updateUserDisplay();
    if (window.location.href.includes('cart.html')) {
        renderCartItems();
        renderFavoriteItems();
    }
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        console.log('Login form found, adding listener'); 
        loginForm.addEventListener('submit', login);
    } else {
        console.log('Login form not found'); 
    }
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        console.log('Register form found, adding listener'); 
        registerForm.addEventListener('submit', register);
    } else {
        console.log('Register form not found'); 
    }
});


  
  

