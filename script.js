/* ============================================
 ShopEase CMS - JSON Data Controller
 Reads all site data from ShopEase_CMS_Data.json
 ============================================ */

class ShopEaseCMS {
    constructor() {
        this.data = null;
        this.settings = {};
        this.categories = [];
        this.products = [];
        this.heroSlides = [];
        this.promoBanners = [];
        this.testimonials = [];
        this.pages = [];
        this.navLinks = [];
    }

    async init() {
        try {
            const response = await fetch('ShopEase_CMS_Data.json');
            this.data = await response.json();
            this.parseData();
            console.log('✅ ShopEase CMS loaded successfully');
            return true;
        } catch (error) {
            console.error('❌ Failed to load CMS data:', error);
            return false;
        }
    }

    parseData() {
        // Parse Settings into key-value pairs
        if (this.data.Settings) {
            this.data.Settings.forEach(item => {
                if (item.KEY && item.VALUE !== undefined) {
                    this.settings[item.KEY] = item.VALUE;
                }
            });
        }

        this.categories = this.data.Categories || [];
        this.products = this.data.Products || [];
        this.heroSlides = this.data['Hero Slides'] || [];
        this.promoBanners = this.data['Promo Banners'] || [];
        this.testimonials = this.data.Testimonials || [];
        this.pages = this.data.Pages || [];
        this.navLinks = this.data['Nav Links'] || [];
    }

    // ===== SETTINGS HELPERS =====
    getSetting(key, defaultValue = '') {
        return this.settings[key] !== undefined ? this.settings[key] : defaultValue;
    }

    getSiteName() { return this.getSetting('site_name', 'ShopEase'); }
    getSiteTagline() { return this.getSetting('site_tagline', 'Modern Online Store'); }
    getPhone() { return this.getSetting('phone', '01712-345678'); }
    getEmail() { return this.getSetting('email', 'support@shopease.com'); }
    getCurrencySymbol() { return this.getSetting('currency_symbol', '৳'); }
    getPrimaryColor() { return this.getSetting('primary_color', '#6366f1'); }
    getSecondaryColor() { return this.getSetting('secondary_color', '#ec4899'); }
    getAccentColor() { return this.getSetting('accent_color', '#f59e0b'); }

    isFeatureEnabled(key) {
        return this.getSetting(key, 'No') === 'Yes';
    }

    // ===== CATEGORIES =====
    getActiveCategories() {
        return this.categories.filter(c => c.STATUS === 'Active');
    }

    getFeaturedCategories() {
        return this.categories.filter(c => c.STATUS === 'Active' && c.FEATURED === 'Yes');
    }

    getMenuCategories() {
        return this.categories.filter(c => c.STATUS === 'Active' && c.MENU === 'Yes');
    }

    getHomepageCategories() {
        return this.categories.filter(c => c.STATUS === 'Active' && c.HOMEPAGE === 'Yes');
    }

    getCategoryBySlug(slug) {
        return this.categories.find(c => c.SLUG === slug && c.STATUS === 'Active');
    }

    // ===== PRODUCTS =====
    getActiveProducts() {
        return this.products.filter(p => p.STATUS === 'Active');
    }

    getFeaturedProducts() {
        return this.getActiveProducts().filter(p => p.FEATURED === 'Yes');
    }

    getNewArrivals() {
        return this.getActiveProducts().filter(p => p.NEW === 'Yes');
    }

    getBestSellers() {
        return this.getActiveProducts().filter(p => p.BESTSELLER === 'Yes');
    }

    getFlashSaleProducts() {
        return this.getActiveProducts().filter(p => p.FLASH_SALE === 'Yes');
    }

    getProductsByCategory(categorySlug) {
        return this.getActiveProducts().filter(p => p.CATEGORY === categorySlug);
    }

    getProductById(id) {
        return this.products.find(p => p.ID == id && p.STATUS === 'Active');
    }

    getProductBySlug(slug) {
        return this.products.find(p => p.SLUG === slug && p.STATUS === 'Active');
    }

    // ===== HERO SLIDES =====
    getActiveHeroSlides() {
        return this.heroSlides.filter(s => s.ACTIVE === 'Yes').sort((a, b) => a.SORT - b.SORT);
    }

    // ===== PROMO BANNERS =====
    getActivePromoBanners() {
        return this.promoBanners.filter(b => b.ACTIVE === 'Yes').sort((a, b) => a.SORT - b.SORT);
    }

    // ===== TESTIMONIALS =====
    getActiveTestimonials() {
        return this.testimonials.filter(t => t.ACTIVE === 'Yes').sort((a, b) => a.SORT - b.SORT);
    }

    // ===== PAGES (NEW) =====
    getActivePages() {
        return this.pages.filter(p => p.STATUS === 'Active');
    }

    getPageBySlug(slug) {
        return this.pages.find(p => p.SLUG === slug && p.STATUS === 'Active');
    }

    getVisiblePages() {
        return this.pages.filter(p => p.STATUS === 'Active' && p.IS_VISIBLE === 'Yes');
    }

    getFooterPages() {
        return this.pages.filter(p => p.STATUS === 'Active' && p.SHOW_IN_FOOTER === 'Yes');
    }

    getHeaderPages() {
        return this.pages.filter(p => p.STATUS === 'Active' && p.SHOW_IN_HEADER === 'Yes');
    }

    // ===== NAV LINKS (NEW) =====
    getHeaderNavLinks() {
        return this.navLinks.filter(l => l.POSITION === 'header' && l.IS_ACTIVE === 'Yes').sort((a, b) => a.SORT_ORDER - b.SORT_ORDER);
    }

    getFooterNavLinks() {
        return this.navLinks.filter(l => l.POSITION === 'footer' && l.IS_ACTIVE === 'Yes').sort((a, b) => a.SORT_ORDER - b.SORT_ORDER);
    }

    getSocialLinks() {
        return this.navLinks.filter(l => l.POSITION === 'social' && l.IS_ACTIVE === 'Yes').sort((a, b) => a.SORT_ORDER - b.SORT_ORDER);
    }

    // ===== PRICE FORMATTING =====
    formatPrice(price) {
        const symbol = this.getCurrencySymbol();
        const decimal = parseInt(this.getSetting('decimal_places', 0));
        const formatted = parseFloat(price).toFixed(decimal);
        return `${symbol}${formatted}`;
    }

    // ===== THEME CSS VARIABLES =====
    applyTheme() {
        const root = document.documentElement;
        root.style.setProperty('--primary', this.getPrimaryColor());
        root.style.setProperty('--secondary', this.getSecondaryColor());
        root.style.setProperty('--accent', this.getAccentColor());
        root.style.setProperty('--success', this.getSetting('success_color', '#22c55e'));
        root.style.setProperty('--danger', this.getSetting('danger_color', '#ef4444'));
        root.style.setProperty('--warning', this.getSetting('warning_color', '#f59e0b'));
        root.style.setProperty('--dark', this.getSetting('dark_color', '#0f172a'));
        root.style.setProperty('--light', this.getSetting('light_color', '#f9fafb'));

        const fontFamily = this.getSetting('font_family', 'Hind Siliguri');
        root.style.setProperty('--font-sans', `'${fontFamily}', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`);
    }
}

// Global instance
const cms = new ShopEaseCMS();

// Initialize on page load
document.addEventListener('DOMContentLoaded', async () => {
    await cms.init();
    cms.applyTheme();

    // Update site title
    document.title = cms.getSiteName();

    // Update logo text
    const logoText = document.querySelector('.logo-text');
    if (logoText) logoText.textContent = cms.getSiteName();

    // Update contact info
    const phoneEl = document.querySelector('.top-bar-phone');
    if (phoneEl) phoneEl.textContent = cms.getPhone();

    const emailEl = document.querySelector('.top-bar-email');
    if (emailEl) emailEl.textContent = cms.getEmail();

    // Load dynamic content
    loadNavLinks();
    loadHeroSlides();
    loadCategories();
    loadProducts();
    loadPromoBanners();
    loadTestimonials();
    loadFooterPages();
    loadSocialLinks();
});

// ===== NAV LINKS =====
function loadNavLinks() {
    const headerLinks = cms.getHeaderNavLinks();
    const navContainer = document.querySelector('.nav-links');
    if (navContainer) {
        navContainer.innerHTML = headerLinks.map(link => `
            <a href="${link.URL}" class="nav-link" ${link.TARGET === '_blank' ? 'target="_blank"' : ''}>
                ${link.ICON ? `<i class="fas ${link.ICON}"></i>` : ''}
                ${link.LABEL}
                ${link.SHOW_BADGE === 'Yes' ? `<span class="nav-badge" style="background: ${link.BADGE_COLOR}">${link.BADGE_TEXT}</span>` : ''}
            </a>
        `).join('');
    }
}

// ===== FOOTER PAGES =====
function loadFooterPages() {
    const footerPages = cms.getFooterPages();
    const footerContainer = document.querySelector('.footer-links');
    if (footerContainer) {
        footerContainer.innerHTML = footerPages.map(page => `
            <a href="#/page/${page.SLUG}" class="footer-link" onclick="loadPage('${page.SLUG}'); return false;">${page.TITLE}</a>
        `).join('');
    }
}

// ===== SOCIAL LINKS =====
function loadSocialLinks() {
    const socialLinks = cms.getSocialLinks();
    const socialContainer = document.querySelector('.social-links');
    if (socialContainer) {
        socialContainer.innerHTML = socialLinks.map(link => `
            <a href="${link.URL}" class="social-link" target="_blank" title="${link.LABEL}">
                <i class="fab ${link.ICON}"></i>
            </a>
        `).join('');
    }
}

// ===== PAGE LOADER (NEW) =====
function loadPage(slug) {
    const page = cms.getPageBySlug(slug);
    if (!page) {
        showToast('Page not found!', 'error');
        return;
    }

    // Update page title
    document.title = page.META_TITLE || page.TITLE;

    // Update meta tags
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.content = page.META_DESC || '';

    // Load page content
    const contentContainer = document.querySelector('.page-content') || document.querySelector('main');
    if (contentContainer) {
        contentContainer.innerHTML = `
            <div class="page-banner" style="background: ${page.BANNER_IMAGE ? `url(${page.BANNER_IMAGE})` : 'linear-gradient(135deg, #6366f1, #ec4899)'}; background-size: cover;">
                <div class="page-banner-overlay">
                    <h1>${page.TITLE}</h1>
                </div>
            </div>
            <div class="page-body">
                ${page.CONTENT}
            </div>
        `;
    }

    // Update URL hash
    window.location.hash = `/page/${slug}`;

    // Scroll to top
    window.scrollTo(0, 0);
}

// ===== HERO SLIDES =====
function loadHeroSlides() {
    const slides = cms.getActiveHeroSlides();
    const container = document.querySelector('.hero-slider');
    if (!container || slides.length === 0) return;

    container.innerHTML = slides.map((slide, index) => `
        <div class="hero-slide ${index === 0 ? 'active' : ''}" data-index="${index}">
            <img src="${slide.IMAGE}" alt="${slide.TITLE}" class="hero-slide-bg">
            <div class="hero-slide-overlay"></div>
            <div class="hero-slide-content">
                <div class="hero-slide-text">
                    <span class="hero-tag"><i class="fas fa-star"></i> ${slide.TAG}</span>
                    <h1 class="hero-title">${slide.TITLE}</h1>
                    <p class="hero-description">${slide.DESCRIPTION}</p>
                    <div class="hero-price">
                        ${slide.PRICE_CURRENT ? `<span class="hero-price-current">${cms.formatPrice(slide.PRICE_CURRENT)}</span>` : ''}
                        ${slide.PRICE_ORIGINAL ? `<span class="hero-price-original">${cms.formatPrice(slide.PRICE_ORIGINAL)}</span>` : ''}
                        ${slide.DISCOUNT ? `<span class="hero-price-discount">-${slide.DISCOUNT}%</span>` : ''}
                    </div>
                    <div class="hero-buttons">
                        <a href="${slide.BUTTON_LINK}" class="hero-btn-primary">${slide.BUTTON_TEXT} <i class="fas fa-arrow-right"></i></a>
                        <a href="${slide.PRODUCT_LINK}" class="hero-btn-secondary">View Details <i class="fas fa-eye"></i></a>
                    </div>
                </div>
                <div class="hero-slide-image">
                    <img src="${slide.IMAGE}" alt="${slide.TITLE}">
                </div>
            </div>
        </div>
    `).join('');
}

// ===== CATEGORIES =====
function loadCategories() {
    const categories = cms.getHomepageCategories();
    const container = document.querySelector('.categories-grid');
    if (!container) return;

    container.innerHTML = categories.map(cat => `
        <div class="category-card ${cat.SLUG}">
            <div class="category-icon"><i class="fas ${cat.ICON}"></i></div>
            <h3 class="category-name">${cat.NAME}</h3>
            <p class="category-count">${cat.PRODUCT_COUNT}+ Products</p>
        </div>
    `).join('');
}

// ===== PRODUCTS =====
function loadProducts() {
    const products = cms.getFeaturedProducts().slice(0, 8);
    const container = document.querySelector('.products-grid');
    if (!container) return;

    container.innerHTML = products.map(product => `
        <div class="product-card" data-id="${product.ID}">
            <div class="product-image-wrapper">
                <img src="${product.IMAGE}" alt="${product.NAME}" class="product-image">
                ${product.BADGE ? `<div class="product-badges"><span class="badge badge-${product.BADGE.toLowerCase()}">${product.BADGE}</span></div>` : ''}
                <div class="product-actions">
                    <button class="product-action-btn" onclick="addToWishlist(${product.ID})"><i class="fas fa-heart"></i></button>
                    <button class="product-action-btn" onclick="quickView(${product.ID})"><i class="fas fa-eye"></i></button>
                    <button class="product-action-btn" onclick="addToCompare(${product.ID})"><i class="fas fa-exchange-alt"></i></button>
                </div>
            </div>
            <div class="product-info">
                <p class="product-category">${product.CATEGORY}</p>
                <h3 class="product-name"><a href="/product/${product.SLUG}">${product.NAME}</a></h3>
                <div class="product-rating">
                    <div class="stars">${'★'.repeat(Math.floor(product.RATING))}${'☆'.repeat(5 - Math.floor(product.RATING))}</div>
                    <span class="rating-count">(${product.REVIEWS} reviews)</span>
                </div>
                <div class="product-price">
                    <span class="price-current">${cms.formatPrice(product.PRICE)}</span>
                    ${product.ORIGINAL_PRICE ? `<span class="price-original">${cms.formatPrice(product.ORIGINAL_PRICE)}</span>` : ''}
                    ${product.DISCOUNT ? `<span class="price-discount">-${product.DISCOUNT}%</span>` : ''}
                </div>
                <div class="product-stock ${product.STOCK < 10 ? 'low' : ''}">
                    <i class="fas fa-check-circle"></i> ${product.STOCK < 10 ? `Only ${product.STOCK} left!` : 'In Stock'}
                    <div class="stock-progress"><div class="stock-progress-bar ${product.STOCK < 10 ? 'low' : ''}" style="width: ${Math.min(100, (product.STOCK / 50) * 100)}%"></div></div>
                </div>
                <button class="add-to-cart" onclick="addToCart(${product.ID})">
                    <i class="fas fa-shopping-cart"></i> Add to Cart
                </button>
            </div>
        </div>
    `).join('');
}

// ===== PROMO BANNERS =====
function loadPromoBanners() {
    const banners = cms.getActivePromoBanners();
    const container = document.querySelector('.promo-banners');
    if (!container) return;

    container.innerHTML = banners.map(banner => `
        <div class="promo-banner ${banner.ID === 1 ? 'promo-banner-large' : ''}">
            <img src="${banner.IMAGE}" alt="${banner.TITLE}">
            <div class="promo-banner-overlay">
                <span class="promo-banner-tag">${banner.SUBTITLE}</span>
                <h3 class="promo-banner-title">${banner.TITLE}</h3>
                <p class="promo-banner-desc">${banner.DESCRIPTION}</p>
                <a href="${banner.BUTTON_LINK}" class="promo-banner-btn">${banner.BUTTON_TEXT} <i class="fas fa-arrow-right"></i></a>
            </div>
        </div>
    `).join('');
}

// ===== TESTIMONIALS =====
function loadTestimonials() {
    const testimonials = cms.getActiveTestimonials();
    const container = document.querySelector('.testimonials-grid');
    if (!container) return;

    container.innerHTML = testimonials.map(t => `
        <div class="testimonial-card">
            <div class="testimonial-quote">"</div>
            <p class="testimonial-text">${t.REVIEW}</p>
            <div class="testimonial-author">
                <img src="${t.AVATAR}" alt="${t.NAME}">
                <div class="testimonial-author-info">
                    <h4>${t.NAME}</h4>
                    <p>${t.LOCATION}</p>
                </div>
                <div class="testimonial-rating">${'★'.repeat(t.RATING)}${'☆'.repeat(5 - t.RATING)}</div>
            </div>
        </div>
    `).join('');
}

// ===== CART FUNCTIONS =====
function addToCart(productId, quantity = 1) {
    const product = cms.getProductById(productId);
    if (!product) return;
    showToast('Product added to cart!', 'success');
    updateCartCount();
}

function addToWishlist(productId) {
    showToast('Added to wishlist!', 'success');
}

function quickView(productId) {
    const product = cms.getProductById(productId);
    if (!product) return;
    console.log('Quick view:', product);
}

function updateCartCount() {
    // Update cart badge count
}

// ===== TOAST NOTIFICATIONS =====
function showToast(message, type = 'info') {
    const container = document.querySelector('.toast-container') || createToastContainer();
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <div class="toast-icon"><i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'times' : 'info'}"></i></div>
        <div class="toast-content"><h4>${type.charAt(0).toUpperCase() + type.slice(1)}</h4><p>${message}</p></div>
        <button class="toast-close" onclick="this.parentElement.remove()"><i class="fas fa-times"></i></button>
    `;
    container.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}

function createToastContainer() {
    const container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
    return container;
}

// ===== SEARCH =====
function searchProducts(query) {
    const q = query.toLowerCase();
    return cms.getActiveProducts().filter(p => 
        p.NAME.toLowerCase().includes(q) ||
        p.DESCRIPTION.toLowerCase().includes(q) ||
        p.CATEGORY.toLowerCase().includes(q) ||
        p.TAGS.toLowerCase().includes(q)
    );
}

// ===== EXPORT FOR USE IN OTHER SCRIPTS =====
window.ShopEaseCMS = ShopEaseCMS;
window.cms = cms;
window.loadPage = loadPage;
