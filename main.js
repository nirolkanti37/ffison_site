// Shopping Cart - Local Storage
class ShoppingCart {
  constructor() {
    this.cartKey = 'ecommerce_cart';
    this.cart = this.getCart();
  }

  getCart() {
    const cart = localStorage.getItem(this.cartKey);
    return cart ? JSON.parse(cart) : [];
  }

  saveCart() {
    localStorage.setItem(this.cartKey, JSON.stringify(this.cart));
    this.updateCartUI();
  }

  addItem(product, quantity = 1) {
    const existingItem = this.cart.find(item => item.id === product.id);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.cart.push({ ...product, quantity });
    }
    this.saveCart();
  }

  removeItem(productId) {
    this.cart = this.cart.filter(item => item.id !== productId);
    this.saveCart();
  }

  updateQuantity(productId, quantity) {
    const item = this.cart.find(item => item.id === productId);
    if (item) {
      item.quantity = quantity;
      this.saveCart();
    }
  }

  getTotal() {
    return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  getCount() {
    return this.cart.reduce((count, item) => count + item.quantity, 0);
  }

  clearCart() {
    this.cart = [];
    this.saveCart();
  }

  updateCartUI() {
    const cartCount = document.querySelector('#cart-count');
    if (cartCount) {
      cartCount.textContent = this.getCount();
    }
  }
}

// Wishlist - Local Storage
class Wishlist {
  constructor() {
    this.wishlistKey = 'ecommerce_wishlist';
    this.wishlist = this.getWishlist();
  }

  getWishlist() {
    const wishlist = localStorage.getItem(this.wishlistKey);
    return wishlist ? JSON.parse(wishlist) : [];
  }

  saveWishlist() {
    localStorage.setItem(this.wishlistKey, JSON.stringify(this.wishlist));
    this.updateWishlistUI();
  }

  toggleItem(product) {
    const index = this.wishlist.findIndex(item => item.id === product.id);
    if (index > -1) {
      this.wishlist.splice(index, 1);
    } else {
      this.wishlist.push(product);
    }
    this.saveWishlist();
  }

  updateWishlistUI() {
    const wishlistCount = document.querySelector('#wishlist-count');
    if (wishlistCount) {
      wishlistCount.textContent = this.wishlist.length;
    }
  }
}

// Theme Toggle
function initTheme() {
  const theme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', theme);
  updateThemeIcon(theme);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  updateThemeIcon(next);
}

function updateThemeIcon(theme) {
  const icon = document.querySelector('#theme-icon');
  if (icon) {
    icon.innerHTML = theme === 'light' 
      ? '<svg><!-- moon icon --></svg>' 
      : '<svg><!-- sun icon --></svg>';
  }
}

// Product Fetching
async function fetchProducts() {
  try {
    const response = await fetch('https://username.github.io/blogger-ecommerce/assets/data/products.json');
    const products = await response.json();
    renderProducts(products);
  } catch (error) {
    console.error('Failed to fetch products:', error);
  }
}

function renderProducts(products) {
  const grid = document.getElementById('product-grid');
  if (!grid) return;
  
  grid.innerHTML = products.map(product => `
    <div class="product-card glassmorphism" data-product-id="${product.id}">
      <img src="${product.image}" alt="${product.title}" class="product-image" loading="lazy">
      <div class="product-info">
        <h3 class="product-title">${product.title}</h3>
        <div class="product-price">
          $${product.price}
          ${product.oldPrice ? `<span class="product-old-price">$${product.oldPrice}</span>` : ''}
        </div>
        <button class="btn-primary add-to-cart" onclick="addToCart('${product.id}')">Add to Cart</button>
        <button class="btn-whatsapp" onclick="orderViaWhatsApp('${product.id}')">WhatsApp</button>
      </div>
    </div>
  `).join('');
  
  initializeLazyLoading();
}

// WhatsApp Order
function orderViaWhatsApp(productId) {
  const cart = new ShoppingCart();
  const product = cart.cart.find(item => item.id == productId) || 
                  JSON.parse(localStorage.getItem('products_cache'))?.find(p => p.id == productId);
  
  if (product) {
    const message = encodeURIComponent(`Hi, I want to order: ${product.title} - $${product.price}`);
    window.open(`https://wa.me/1234567890?text=${message}`, '_blank');
  }
}

// Coupon System
function applyCoupon(couponCode) {
  const coupons = {
    'WELCOME10': 0.10,
    'SAVE20': 0.20,
    'FREESHIP': 0 // Free shipping coupon
  };
  
  return coupons[couponCode.toUpperCase()] || 0;
}

// Lazy Loading
function initializeLazyLoading() {
  const images = document.querySelectorAll('img[loading="lazy"]');
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.src = entry.target.dataset.src || entry.target.src;
        observer.unobserve(entry.target);
      }
    });
  });
  
  images.forEach(img => imageObserver.observe(img));
}

// Mobile Navigation
function initMobileNav() {
  const mobileNav = document.querySelector('.mobile-nav');
  if (window.innerWidth <= 768) {
    mobileNav?.classList.add('active');
  }
}

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  window.cart = new ShoppingCart();
  window.wishlist = new Wishlist();
  initTheme();
  fetchProducts();
  initMobileNav();
});

function addToCart(productId) {
  const product = JSON.parse(localStorage.getItem('products_cache'))?.find(p => p.id == productId);
  if (product) {
    cart.addItem(product);
  }
}