// ============================================
// ShopEase Modern E-Commerce JavaScript
// ============================================

// Global Variables
let products = [];
let cart = JSON.parse(localStorage.getItem('shopease_cart')) || [];
let currentSlide = 0;
let slideInterval;
let countdownInterval;

// Product Data (Fallback)
const defaultProducts = [
    { id: 1, name: "Wireless Bluetooth Headphones", price: 2499, original_price: 3499, category: "Electronics", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400", description: "Premium wireless headphones with noise cancellation and 30-hour battery life.", rating: 4.5, stock: 15, badge: "Bestseller" },
    { id: 2, name: "Smart Watch Pro", price: 5999, original_price: 7999, category: "Electronics", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400", description: "Advanced fitness tracking, heart rate monitor, and 7-day battery life.", rating: 4.8, stock: 8, badge: "New" },
    { id: 3, name: "Portable Power Bank 20000mAh", price: 1899, original_price: 2499, category: "Electronics", image: "https://images.unsplash.com/photo-1609592809794-8534f7d175d4?w=400", description: "High-capacity power bank with fast charging support for all devices.", rating: 4.3, stock: 25, badge: "Sale" },
    { id: 4, name: "LED Desk Lamp", price: 1299, original_price: 1999, category: "Home", image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400", description: "Modern LED desk lamp with adjustable brightness and color temperature.", rating: 4.6, stock: 12, badge: "" },
    { id: 5, name: "Mechanical Keyboard RGB", price: 4599, original_price: 5999, category: "Electronics", image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400", description: "RGB backlit mechanical keyboard with blue switches for gaming.", rating: 4.7, stock: 5, badge: "Hot" },
    { id: 6, name: "USB-C Hub 7-in-1", price: 3299, original_price: 4499, category: "Electronics", image: "https://images.unsplash.com/photo-1625723044792-44de16ccb4e9?w=400", description: "7-in-1 USB-C hub with HDMI, USB 3.0, SD card reader and more.", rating: 4.4, stock: 18, badge: "New" },
    { id: 7, name: "Wireless Mouse", price: 899, original_price: 1299, category: "Electronics", image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400", description: "Ergonomic wireless mouse with precision tracking and long battery life.", rating: 4.2, stock: 30, badge: "Sale" },
    { id: 8, name: "Phone Stand Adjustable", price: 499, original_price: 799, category: "Accessories", image: "https://images.unsplash.com/photo-1586105251261-72a756497a11?w=400", description: "Adjustable phone stand compatible with all smartphones and tablets.", rating: 4.5, stock: 40, badge: "" },
    { id: 9, name: "Laptop Stand Aluminum", price: 1599, original_price: 2299, category: "Accessories", image: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=400", description: "Premium aluminum laptop stand with adjustable height and angle.", rating: 4.6, stock: 20, badge: "New" },
    { id: 10, name: "Webcam HD 1080p", price: 3499, original_price: 4999, category: "Electronics", image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400", description: "Full HD webcam with built-in microphone for video calls and streaming.", rating: 4.4, stock: 15, badge: "Bestseller" }
];

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    initSlider();
    initCountdown();
    initScrollEffects();
    updateCartUI();
});

// Load Products
async function loadProducts() {
    try {
        const response = await fetch('products.json');
        products = await response.json();
    } catch (error) {
        products = defaultProducts;
    }
    renderFeaturedProducts();
    renderFlashSaleProducts();
    renderNewArrivals();
}

// Render Product Card
function createProductCard(product) {
    const discount = Math.round(((product.original_price - product.price) / product.original_price) * 100);
    const stars = '★'.repeat(Math.floor(product.rating)) + '☆'.repeat(5 - Math.floor(product.rating));
    const stockPercent = (product.stock / 50) * 100;
    const stockClass = product.stock <= 5 ? 'low' : '';

    return `
        <div class="product-card" data-id="${product.id}">
            <div class="product-image-wrapper">
                <img src="${product.image}" alt="${product.name}" class="product-image" loading="lazy">
                ${product.badge ? `<div class="product-badges"><span class="badge badge-${product.badge.toLowerCase()}">${product.badge}</span></div>` : ''}
                <div class="product-actions">
                    <button class="product-action-btn" onclick="quickView(${product.id})" title="Quick View"><i class="fas fa-eye"></i></button>
                    <button class="product-action-btn" onclick="addToWishlist(${product.id})" title="Add to Wishlist"><i class="far fa-heart"></i></button>
                    <button class="product-action-btn" onclick="compareProduct(${product.id})" title="Compare"><i class="fas fa-exchange-alt"></i></button>
                </div>
            </div>
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <h3 class="product-name"><a href="#">${product.name}</a></h3>
                <div class="product-rating">
                    <span class="stars">${stars}</span>
                    <span class="rating-count">(${product.rating})</span>
                </div>
                <div class="product-price">
                    <span class="price-current">৳${product.price.toLocaleString()}</span>
                    <span class="price-original">৳${product.original_price.toLocaleString()}</span>
                    ${discount > 0 ? `<span class="price-discount">-${discount}%</span>` : ''}
                </div>
                <div class="product-stock">
                    <i class="fas ${product.stock <= 5 ? 'fa-exclamation-circle' : 'fa-check-circle'}"></i>
                    <span>${product.stock <= 5 ? `শুধু ${product.stock}টি বাকি!` : `${product.stock}টি স্টকে`}</span>
                    <div class="stock-progress">
                        <div class="stock-progress-bar ${stockClass}" style="width: ${stockPercent}%"></div>
                    </div>
                </div>
                <button class="add-to-cart" onclick="addToCart(${product.id})">
                    <i class="fas fa-cart-plus"></i> কার্টে যোগ করুন
                </button>
            </div>
        </div>
    `;
}

// Render Sections
function renderFeaturedProducts() {
    const container = document.getElementById('featuredProducts');
    if (!container) return;
    container.innerHTML = products.slice(0, 8).map(createProductCard).join('');
}

function renderFlashSaleProducts() {
    const container = document.getElementById('flashSaleProducts');
    if (!container) return;
    const saleProducts = products.filter(p => p.badge === 'Sale' || p.badge === 'Hot');
    container.innerHTML = saleProducts.slice(0, 5).map(createProductCard).join('');
}

function renderNewArrivals() {
    const container = document.getElementById('newArrivals');
    if (!container) return;
    const newProducts = products.filter(p => p.badge === 'New');
    container.innerHTML = newProducts.slice(0, 5).map(createProductCard).join('');
}

// Slider
function initSlider() {
    const slides = document.querySelectorAll('.hero-slide');
    if (slides.length === 0) return;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
        document.querySelectorAll('.slider-dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
        currentSlide = index;
        resetProgress();
    }

    window.nextSlide = () => showSlide((currentSlide + 1) % slides.length);
    window.prevSlide = () => showSlide((currentSlide - 1 + slides.length) % slides.length);
    window.goToSlide = (index) => showSlide(index);

    function resetProgress() {
        const progress = document.getElementById('sliderProgress');
        if (!progress) return;
        progress.style.transition = 'none';
        progress.style.width = '0%';
        setTimeout(() => {
            progress.style.transition = 'width 5s linear';
            progress.style.width = '100%';
        }, 50);
    }

    slideInterval = setInterval(nextSlide, 5000);
    resetProgress();

    const slider = document.getElementById('heroSlider');
    if (slider) {
        slider.addEventListener('mouseenter', () => clearInterval(slideInterval));
        slider.addEventListener('mouseleave', () => {
            slideInterval = setInterval(nextSlide, 5000);
        });
    }
}

// Countdown Timer
function initCountdown() {
    let hours = 2, minutes = 30, seconds = 45;

    countdownInterval = setInterval(() => {
        seconds--;
        if (seconds < 0) { seconds = 59; minutes--; }
        if (minutes < 0) { minutes = 59; hours--; }
        if (hours < 0) { hours = 23; minutes = 59; seconds = 59; }

        const h = document.getElementById('hours');
        const m = document.getElementById('minutes');
        const s = document.getElementById('seconds');

        if (h) h.textContent = String(hours).padStart(2, '0');
        if (m) m.textContent = String(minutes).padStart(2, '0');
        if (s) s.textContent = String(seconds).padStart(2, '0');
    }, 1000);
}

// Cart Functions
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
        cart.push({ id: product.id, name: product.name, price: product.price, image: product.image, quantity: 1, stock: product.stock });
    }

    saveCart();
    updateCartUI();
    showToast(`${product.name} কার্টে যোগ হয়েছে!`);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;

    const newQuantity = item.quantity + change;
    if (newQuantity <= 0) { removeFromCart(productId); return; }
    if (newQuantity > item.stock) { showToast('স্টকে এতোটি পণ্য নেই!', 'error'); return; }

    item.quantity = newQuantity;
    saveCart();
    updateCartUI();
}

function saveCart() {
    localStorage.setItem('shopease_cart', JSON.stringify(cart));
}

function updateCartUI() {
    const cartCount = document.getElementById('cartCount');
    const cartTotalHeader = document.getElementById('cartTotalHeader');
    const cartItems = document.getElementById('cartItems');
    const cartSubtotal = document.getElementById('cartSubtotal');
    const cartTotal = document.getElementById('cartTotal');

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    if (cartCount) cartCount.textContent = totalItems;
    if (cartTotalHeader) cartTotalHeader.textContent = totalPrice.toLocaleString();
    if (cartSubtotal) cartSubtotal.textContent = '৳' + totalPrice.toLocaleString();
    if (cartTotal) cartTotal.textContent = '৳' + totalPrice.toLocaleString();

    if (cartItems) {
        if (cart.length === 0) {
            cartItems.innerHTML = `
                <div class="cart-empty">
                    <i class="fas fa-shopping-basket"></i>
                    <h3>কার্ট খালি</h3>
                    <p>কিছু প্রোডাক্ট যোগ করুন</p>
                </div>`;
        } else {
            cartItems.innerHTML = cart.map(item => `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="cart-item-info">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">৳${item.price.toLocaleString()}</div>
                        <div class="quantity-control">
                            <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)"><i class="fas fa-minus"></i></button>
                            <span class="qty-value">${item.quantity}</span>
                            <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)"><i class="fas fa-plus"></i></button>
                        </div>
                    </div>
                    <button class="remove-item" onclick="removeFromCart(${item.id})"><i class="fas fa-trash"></i></button>
                </div>
            `).join('');
        }
    }
}

function toggleCart() {
    document.getElementById('cartOverlay').classList.toggle('active');
    document.getElementById('cartSidebar').classList.toggle('active');
}

function checkout() {
    if (cart.length === 0) { showToast('কার্ট খালি!', 'error'); return; }
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    alert(`🎉 অর্ডার সফল!\n\nমোট: ৳${total.toLocaleString()}\n\nধন্যবাদ আমাদের সাথে শপিং করার জন্য!`);
    cart = [];
    saveCart();
    updateCartUI();
    toggleCart();
}

// Toast Notifications
function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <div class="toast-icon"><i class="fas ${type === 'error' ? 'fa-exclamation-circle' : type === 'warning' ? 'fa-exclamation-triangle' : 'fa-check-circle'}"></i></div>
        <div class="toast-content"><h4>${type === 'error' ? 'ত্রুটি!' : type === 'warning' ? 'সতর্কতা!' : 'সফল!'}</h4><p>${message}</p></div>
        <button class="toast-close" onclick="this.parentElement.remove()"><i class="fas fa-times"></i></button>
    `;

    container.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 400); }, 3000);
}

// Scroll Effects
function initScrollEffects() {
    const backToTop = document.getElementById('backToTop');
    const header = document.querySelector('.main-header');

    window.addEventListener('scroll', () => {
        if (backToTop) {
            backToTop.classList.toggle('visible', window.scrollY > 500);
        }
        if (header) {
            header.classList.toggle('header-scrolled', window.scrollY > 100);
        }
    });
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Mobile Menu
function toggleMobileMenu() {
    document.getElementById('navLinks').classList.toggle('active');
}

function toggleMegaMenu() {
    // Mega menu toggle for mobile
}

// Quick View
function quickView(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    showToast(`${product.name} - কুইক ভিউ আসছে!`);
}

// Wishlist
function addToWishlist(productId) {
    showToast('উইশলিস্টে যোগ হয়েছে!');
}

// Compare
function compareProduct(productId) {
    showToast('কম্পেয়ার লিস্টে যোগ হয়েছে!');
}

// Search
document.getElementById('searchInput')?.addEventListener('input', function() {
    // Search functionality
});
