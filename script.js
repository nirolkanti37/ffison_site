// ShopEase - E-Commerce JavaScript

// Global Variables
let products = [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let filteredProducts = [];

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    updateCartUI();

    // Search with debounce
    let searchTimeout;
    document.getElementById('searchInput').addEventListener('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(applyFilters, 300);
    });
});

// Load Products from JSON
async function loadProducts() {
    try {
        const response = await fetch('products.json');
        products = await response.json();
        filteredProducts = [...products];
        populateCategories();
        renderProducts();
    } catch (error) {
        console.error('Error loading products:', error);
        // Fallback data if JSON fails to load
        products = [
            {
                "id": 1,
                "name": "Wireless Bluetooth Headphones",
                "price": 2499,
                "original_price": 3499,
                "category": "Electronics",
                "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
                "description": "Premium wireless headphones with noise cancellation and 30-hour battery life.",
                "rating": 4.5,
                "stock": 15,
                "badge": "Bestseller"
            },
            {
                "id": 2,
                "name": "Smart Watch Pro",
                "price": 5999,
                "original_price": 7999,
                "category": "Electronics",
                "image": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
                "description": "Advanced fitness tracking, heart rate monitor, and 7-day battery life.",
                "rating": 4.8,
                "stock": 8,
                "badge": "New"
            },
            {
                "id": 3,
                "name": "Portable Power Bank 20000mAh",
                "price": 1899,
                "original_price": 2499,
                "category": "Electronics",
                "image": "https://images.unsplash.com/photo-1609592809794-8534f7d175d4?w=400",
                "description": "High-capacity power bank with fast charging support for all devices.",
                "rating": 4.3,
                "stock": 25,
                "badge": "Sale"
            },
            {
                "id": 4,
                "name": "LED Desk Lamp",
                "price": 1299,
                "original_price": 1999,
                "category": "Home",
                "image": "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400",
                "description": "Modern LED desk lamp with adjustable brightness and color temperature.",
                "rating": 4.6,
                "stock": 12,
                "badge": ""
            },
            {
                "id": 5,
                "name": "Mechanical Keyboard RGB",
                "price": 4599,
                "original_price": 5999,
                "category": "Electronics",
                "image": "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400",
                "description": "RGB backlit mechanical keyboard with blue switches for gaming.",
                "rating": 4.7,
                "stock": 5,
                "badge": "Hot"
            },
            {
                "id": 6,
                "name": "USB-C Hub 7-in-1",
                "price": 3299,
                "original_price": 4499,
                "category": "Electronics",
                "image": "https://images.unsplash.com/photo-1625723044792-44de16ccb4e9?w=400",
                "description": "7-in-1 USB-C hub with HDMI, USB 3.0, SD card reader and more.",
                "rating": 4.4,
                "stock": 18,
                "badge": "New"
            },
            {
                "id": 7,
                "name": "Wireless Mouse",
                "price": 899,
                "original_price": 1299,
                "category": "Electronics",
                "image": "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400",
                "description": "Ergonomic wireless mouse with precision tracking and long battery life.",
                "rating": 4.2,
                "stock": 30,
                "badge": "Sale"
            },
            {
                "id": 8,
                "name": "Phone Stand Adjustable",
                "price": 499,
                "original_price": 799,
                "category": "Accessories",
                "image": "https://images.unsplash.com/photo-1586105251261-72a756497a11?w=400",
                "description": "Adjustable phone stand compatible with all smartphones and tablets.",
                "rating": 4.5,
                "stock": 40,
                "badge": ""
            }
        ];
        filteredProducts = [...products];
        populateCategories();
        renderProducts();
    }
}

// Populate Category Filter
function populateCategories() {
    const categories = [...new Set(products.map(p => p.category))];
    const select = document.getElementById('categoryFilter');
    categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat;
        select.appendChild(option);
    });
}

// Render Products
function renderProducts() {
    const container = document.getElementById('productsContainer');

    if (filteredProducts.length === 0) {
        container.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <h2>কোনো প্রোডাক্ট পাওয়া যায়নি</h2>
                <p>অন্য কিছু সার্চ করুন</p>
            </div>
        `;
        return;
    }

    container.innerHTML = filteredProducts.map(product => {
        const discount = Math.round(((product.original_price - product.price) / product.original_price) * 100);
        const badgeClass = product.badge ? `badge-${product.badge.toLowerCase()}` : '';
        const stockClass = product.stock <= 5 ? 'low' : '';
        const stars = '★'.repeat(Math.floor(product.rating)) + '☆'.repeat(5 - Math.floor(product.rating));

        return `
            <div class="product-card">
                <div class="image-wrapper">
                    <img src="${product.image}" alt="${product.name}" class="product-image" loading="lazy">
                    ${product.badge ? `<span class="badge ${badgeClass}">${product.badge}</span>` : ''}
                </div>
                <div class="product-info">
                    <div class="product-category">${product.category}</div>
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    <div class="product-rating">
                        <span class="stars">${stars}</span>
                        <span class="rating-value">${product.rating}</span>
                    </div>
                    <div class="product-price">
                        <span class="current-price">৳${product.price.toLocaleString()}</span>
                        <span class="original-price">৳${product.original_price.toLocaleString()}</span>
                        ${discount > 0 ? `<span class="discount-badge">-${discount}%</span>` : ''}
                    </div>
                    <div class="stock-info ${stockClass}">
                        <i class="fas ${product.stock <= 5 ? 'fa-exclamation-circle' : 'fa-check-circle'}"></i>
                        ${product.stock <= 5 ? `শুধু ${product.stock}টি বাকি!` : `${product.stock}টি স্টকে আছে`}
                    </div>
                    <button class="add-to-cart" onclick="addToCart(${product.id})">
                        <i class="fas fa-cart-plus"></i> কার্টে যোগ করুন
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// Apply Filters
function applyFilters() {
    const search = document.getElementById('searchInput').value.toLowerCase();
    const category = document.getElementById('categoryFilter').value;
    const sort = document.getElementById('sortFilter').value;
    const minPrice = parseFloat(document.getElementById('minPrice').value) || 0;
    const maxPrice = parseFloat(document.getElementById('maxPrice').value) || Infinity;

    filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(search) ||
                            product.description.toLowerCase().includes(search);
        const matchesCategory = category === 'all' || product.category === category;
        const matchesPrice = product.price >= minPrice && product.price <= maxPrice;
        return matchesSearch && matchesCategory && matchesPrice;
    });

    // Sort
    switch(sort) {
        case 'price-low':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'rating':
            filteredProducts.sort((a, b) => b.rating - a.rating);
            break;
        case 'name':
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
    }

    renderProducts();
}

// Add to Cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        if (existingItem.quantity < product.stock) {
            existingItem.quantity++;
        } else {
            showToast('দুঃখিত, স্টক শেষ!', 'error');
            return;
        }
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1,
            stock: product.stock
        });
    }

    saveCart();
    updateCartUI();
    showToast(`${product.name} কার্টে যোগ হয়েছে!`);
}

// Remove from Cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
}

// Update Quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;

    const newQuantity = item.quantity + change;
    if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
    }
    if (newQuantity > item.stock) {
        showToast('স্টকে এতোটি পণ্য নেই!', 'error');
        return;
    }

    item.quantity = newQuantity;
    saveCart();
    updateCartUI();
}

// Save Cart to LocalStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Update Cart UI
function updateCartUI() {
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    cartCount.textContent = totalItems;
    cartTotal.textContent = '৳' + totalPrice.toLocaleString();

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="cart-empty">
                <i class="fas fa-shopping-basket"></i>
                <p>কার্ট খালি</p>
            </div>
        `;
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">৳${item.price.toLocaleString()}</div>
                    <div class="quantity-control">
                        <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span class="qty-value">${item.quantity}</span>
                        <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </div>
                <button class="remove-item" onclick="removeFromCart(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
    }
}

// Toggle Cart
function toggleCart() {
    document.getElementById('cartOverlay').classList.toggle('active');
    document.getElementById('cartSidebar').classList.toggle('active');
}

// Show Toast
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    toastMessage.textContent = message;
    toast.querySelector('i').className = type === 'error' ? 'fas fa-exclamation-circle' : 'fas fa-check-circle';
    toast.querySelector('i').style.color = type === 'error' ? 'var(--danger)' : 'var(--success)';
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

// Checkout
function checkout() {
    if (cart.length === 0) {
        showToast('কার্ট খালি!', 'error');
        return;
    }
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    alert(`🎉 অর্ডার সফল!\n\nমোট: ৳${total.toLocaleString()}\n\nধন্যবাদ আমাদের সাথে শপিং করার জন্য!`);
    cart = [];
    saveCart();
    updateCartUI();
    toggleCart();
}
