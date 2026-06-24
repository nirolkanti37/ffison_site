import { useState, useEffect } from 'react';
import { ShoppingBag, X, Check, ArrowRight, Trash2, Plus, Minus, ExternalLink } from 'lucide-react';
import { Product, BrandSettings } from './types';
import { INITIAL_PRODUCTS, DEFAULT_BRAND_SETTINGS } from './data';
import Header from './components/Header';
import ProductCard from './components/ProductCard';
import ProductDetail from './components/ProductDetail';
import StylistChat from './components/StylistChat';
import DesignerDashboard from './components/DesignerDashboard';
import Banner, { HomepageConfig } from './components/Banner';

interface CartItem {
  id: string; // combination of prod_id + size + color
  product: Product;
  size: string;
  color: string;
  quantity: number;
}

export default function App() {
  const [settings, setSettings] = useState<BrandSettings>(DEFAULT_BRAND_SETTINGS);
  const [homepage, setHomepage] = useState<HomepageConfig>({
    bannerTitle: "NOIR & BLANC",
    bannerSubtitle: "A curation of essential silhouettes crafted for the modern minimalist. Summer Edition, Volume 01.",
    bannerImage: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1600",
    buttonLink: "#collection"
  });
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  
  // UI Panels states
  const [cartOpen, setCartOpen] = useState(false);
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const [stylistOpen, setStylistOpen] = useState(false);
  const [isCheckoutMocked, setIsCheckoutMocked] = useState(false);

  // Fetch settings, homepage, and products from server on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch("/api/settings");
        if (response.ok) {
          const data = await response.json();
          // Normalize settings to support both standard fields and Decap CMS snake_case fields
          const normalized: BrandSettings = {
            ...data,
            primaryColor: data.primary_color || data.primaryColor || "#FFFFFF",
            secondaryColor: data.secondary_color || data.secondaryColor || "#A3A3A3",
            logo: data.logo || "",
            logoName: data.logoName || "A N T H E M",
            primary_color: data.primary_color || data.primaryColor || "#FFFFFF",
            secondary_color: data.secondary_color || data.secondaryColor || "#A3A3A3"
          };
          setSettings(normalized);
        }
      } catch (err) {
        console.error("Failed to load settings from server:", err);
      }
    };

    const loadHomepage = async () => {
      try {
        const response = await fetch("/api/homepage");
        if (response.ok) {
          const data = await response.json();
          // Normalize homepage to support Decap CMS fields: heading, subtext, banner
          const normalized: HomepageConfig = {
            ...data,
            bannerTitle: data.heading || data.bannerTitle || "NOIR & BLANC",
            bannerSubtitle: data.subtext || data.bannerSubtitle || "A curation of essential silhouettes crafted for the modern minimalist.",
            bannerImage: data.banner || data.bannerImage || "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1600",
            buttonLink: data.buttonLink || "#collection",
            banner: data.banner || data.bannerImage,
            heading: data.heading || data.bannerTitle,
            subtext: data.subtext || data.bannerSubtitle
          };
          setHomepage(normalized);
        }
      } catch (err) {
        console.error("Failed to load homepage config:", err);
      }
    };

    const loadProducts = async () => {
      try {
        const response = await fetch("/api/products");
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        }
      } catch (err) {
        console.error("Failed to load products from server:", err);
      }
    };

    loadSettings();
    loadHomepage();
    loadProducts();
  }, []);

  // Sync document body styles with dark mode settings
  useEffect(() => {
    const isDark = settings.themeMode === 'dark';
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      document.body.style.backgroundColor = '#0a0a0a';
      document.body.style.color = '#ffffff';
    } else {
      root.classList.remove('dark');
      document.body.style.backgroundColor = '#ffffff';
      document.body.style.color = '#000000';
    }
  }, [settings.themeMode]);

  // Handle saving the brand settings back to server (settings.json)
  const handleSaveSettingsToServer = async (newSettings: BrandSettings): Promise<boolean> => {
    try {
      const payload = {
        ...newSettings,
        primary_color: newSettings.primaryColor,
        secondary_color: newSettings.secondaryColor,
        logo: newSettings.logo || ""
      };
      const response = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        setSettings(payload);
        return true;
      }
      return false;
    } catch (err) {
      console.error("Failed to save brand settings on server:", err);
      return false;
    }
  };

  // Cart operations
  const handleAddToCart = (product: Product, size: string, color: string, quantity: number) => {
    const cartItemId = `${product.id}-${size}-${color}`;
    setCart(prevCart => {
      const existingIndex = prevCart.findIndex(item => item.id === cartItemId);
      if (existingIndex > -1) {
        const newCart = [...prevCart];
        newCart[existingIndex].quantity += quantity;
        return newCart;
      } else {
        return [...prevCart, { id: cartItemId, product, size, color, quantity }];
      }
    });
    setCartOpen(true);
  };

  const handleQuickAdd = (product: Product, size: string, color: string) => {
    handleAddToCart(product, size, color, 1);
  };

  const handleUpdateCartQuantity = (itemId: string, amount: number) => {
    setCart(prevCart => {
      return prevCart.map(item => {
        if (item.id === itemId) {
          const newQty = Math.max(1, item.quantity + amount);
          return { ...item, quantity: newQty };
        }
        return item;
      });
    });
  };

  const handleRemoveFromCart = (itemId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== itemId));
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  // Navigation callbacks
  const handleLogoClick = () => {
    setSelectedProduct(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setStylistOpen(false); // Close stylist if they want to focus on detail
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filter products by category
  const categories = ["ALL", "OUTERWEAR", "TOPS", "PANTS", "KNITWEAR", "DRESSES", "ACCESSORIES"];
  const filteredProducts = categoryFilter === "ALL"
    ? products
    : products.filter(p => p.category.toUpperCase() === categoryFilter);

  // Dynamic Typography Mapping
  const headingFontClass = {
    'Space Grotesk': 'font-space',
    'Playfair Display': 'font-playfair',
    'Inter': 'font-sans',
    'Montserrat': 'font-montserrat',
    'Philosopher': 'font-philosopher'
  }[settings.fontHeading] || 'font-sans';

  const bodyFontClass = {
    'Inter': 'font-sans',
    'JetBrains Mono': 'font-mono'
  }[settings.fontBody] || 'font-sans';

  const isDark = settings.themeMode === 'dark';

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-500 ${bodyFontClass} ${
      isDark ? 'bg-neutral-950 text-white' : 'bg-white text-black'
    }`}>
      
      {/* Header Navigation */}
      <Header
        settings={settings}
        onOpenDashboard={() => setDashboardOpen(true)}
        onOpenStylist={() => setStylistOpen(!stylistOpen)}
        onOpenCart={() => setCartOpen(true)}
        cartCount={getCartCount()}
        onLogoClick={handleLogoClick}
      />

      {/* Main Container */}
      <main className="flex-1 pt-24 pb-20">
        
        {/* VIEW 1: Home Page Catalog (if no product selected) */}
        {!selectedProduct ? (
          <div id="home-view-container" className="w-full">
            
            {/* Hero Banner Section */}
            <Banner
              homepage={homepage}
              settings={settings}
              onShopClick={() => {
                const el = document.getElementById('collection-grid-anchor');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {/* Collection Grid Anchor */}
            <div id="collection-grid-anchor" className="scroll-mt-24 max-w-7xl mx-auto px-6 md:px-12 pt-20">
              
              {/* Section Header */}
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
                <div>
                  <h2 className={`text-xl md:text-3xl font-light tracking-widest uppercase ${headingFontClass}`}>
                    Selected Garments
                  </h2>
                  <p className="text-[10px] tracking-wider text-neutral-400 font-mono mt-1.5 uppercase">
                    Timeless cuts. Refined materials. Ethical construction.
                  </p>
                </div>

                {/* Filter Tabs */}
                <div className="flex flex-wrap gap-2 md:gap-4 mt-6 md:mt-0 overflow-x-auto pb-2 scrollbar-none">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      id={`filter-tab-${cat.toLowerCase()}`}
                      onClick={() => setCategoryFilter(cat)}
                      className={`text-[10px] tracking-widest uppercase py-1 px-3 border transition-all duration-300 ${
                        categoryFilter === cat
                          ? isDark
                            ? 'border-white bg-white text-black font-medium'
                            : 'border-black bg-black text-white font-medium'
                          : isDark
                            ? 'border-neutral-900 text-neutral-400 hover:text-white'
                            : 'border-neutral-100 text-neutral-500 hover:text-black'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Products Grid */}
              <div
                id="products-catalog-grid"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16"
              >
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    settings={settings}
                    onSelect={handleSelectProduct}
                    onQuickAdd={handleQuickAdd}
                  />
                ))}
              </div>

              {filteredProducts.length === 0 && (
                <div className="text-center py-20">
                  <p className="text-xs text-neutral-400 font-mono tracking-widest uppercase">
                    No articles found in this category.
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* VIEW 2: Product Detail Page */
          <div id="detail-view-container" className="max-w-7xl mx-auto px-6 md:px-12">
            <ProductDetail
              product={selectedProduct}
              settings={settings}
              onBack={() => setSelectedProduct(null)}
              onAddToCart={handleAddToCart}
            />
          </div>
        )}
      </main>

      {/* FOOTER SECTION */}
      <footer className={`border-t py-12 ${
        isDark ? 'bg-neutral-950 border-neutral-900 text-neutral-500' : 'bg-neutral-50 border-neutral-100 text-neutral-400'
      }`}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <h4 className={`text-xs tracking-widest font-bold uppercase mb-4 text-neutral-800 dark:text-neutral-200 ${headingFontClass}`}>
              {settings.logoName}
            </h4>
            <p className="text-[11px] leading-relaxed max-w-sm font-light">
              We design and construct premium garments centering clean geometry, neutral chromatics, and traceably-sourced fibers. Produced in small, ethical runs.
            </p>
          </div>
          <div>
            <h4 className={`text-xs tracking-widest font-bold uppercase mb-4 text-neutral-800 dark:text-neutral-200 ${headingFontClass}`}>
              Information
            </h4>
            <ul className="space-y-2 text-[11px] font-light">
              <li><span className="hover:text-black dark:hover:text-white cursor-pointer transition-colors">Sizing Reference</span></li>
              <li><span className="hover:text-black dark:hover:text-white cursor-pointer transition-colors">Traceable Sustainability</span></li>
              <li><span className="hover:text-black dark:hover:text-white cursor-pointer transition-colors">Shipping & Returns</span></li>
              <li><span className="hover:text-black dark:hover:text-white cursor-pointer transition-colors">Decap CMS Documentation</span></li>
            </ul>
          </div>
          <div>
            <h4 className={`text-xs tracking-widest font-bold uppercase mb-4 text-neutral-800 dark:text-neutral-200 ${headingFontClass}`}>
              Contact
            </h4>
            <p className="text-[11px] font-light mb-1.5">ANTHEM ATELIER / COPENHAGEN</p>
            <p className="text-[11px] font-mono">info@anthemminimalist.com</p>
            <div className="mt-4 flex items-center space-x-4">
              <span className="text-[10px] tracking-widest uppercase hover:text-black dark:hover:text-white cursor-pointer font-medium transition-colors">Instagram</span>
              <span className="text-[10px] tracking-widest uppercase hover:text-black dark:hover:text-white cursor-pointer font-medium transition-colors">Pinterest</span>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 md:px-12 mt-12 pt-6 border-t border-neutral-200 dark:border-neutral-900 flex flex-col sm:flex-row items-center justify-between text-[10px] font-mono uppercase tracking-wider">
          <p>© {new Date().getFullYear()} {settings.logoName}. All Rights Reserved.</p>
          <p className="mt-2 sm:mt-0 flex items-center space-x-1">
            <span>Hosted Static Page</span>
            <ExternalLink className="w-3 h-3" />
          </p>
        </div>
      </footer>

      {/* SHOPPING BAG DRAWER OVERLAY */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <div
            id="cart-backdrop"
            onClick={() => setCartOpen(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-500"
          />

          {/* Drawer container */}
          <div className="absolute inset-y-0 right-0 max-w-full flex">
            <div
              id="cart-drawer-container"
              className={`w-screen max-w-md flex flex-col border-l shadow-2xl transition-all duration-500 ease-out fade-in ${
                isDark 
                  ? 'bg-neutral-950 border-neutral-900 text-white' 
                  : 'bg-white border-neutral-200 text-black'
              }`}
            >
              {/* Header */}
              <div className={`p-6 border-b flex items-center justify-between ${isDark ? 'border-neutral-900' : 'border-neutral-100'}`}>
                <div className="flex items-center space-x-2">
                  <ShoppingBag className="w-4 h-4 text-neutral-400" />
                  <span className="text-xs tracking-widest font-bold uppercase font-space">
                    Your Shopping Bag ({getCartCount()})
                  </span>
                </div>
                <button
                  id="cart-drawer-close-btn"
                  onClick={() => {
                    setCartOpen(false);
                    setIsCheckoutMocked(false);
                  }}
                  className={`p-1.5 transition-colors hover:opacity-70 ${isDark ? 'text-neutral-400 hover:text-white' : 'text-neutral-500 hover:text-black'}`}
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              {/* Cart Content list */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {isCheckoutMocked ? (
                  <div id="checkout-completed-screen" className="text-center py-12 space-y-4 fade-in">
                    <div className="w-12 h-12 rounded-full border border-green-500 flex items-center justify-center mx-auto text-green-500">
                      <Check className="w-6 h-6" />
                    </div>
                    <h3 className="text-sm tracking-widest uppercase font-bold font-space">Order Committed</h3>
                    <p className="text-xs font-light text-neutral-400 leading-relaxed">
                      Thank you. We have received your order details of our capsule collection. Your garments will be crafted and shipped using our traceably sustainable pipelines.
                    </p>
                    <button
                      onClick={() => {
                        setCart([]);
                        setIsCheckoutMocked(false);
                        setCartOpen(false);
                      }}
                      className="text-[10px] tracking-widest uppercase border px-6 py-3 hover:text-white transition-all"
                      style={{ borderColor: settings.primaryColor }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = settings.primaryColor}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      Clear Bag & Return
                    </button>
                  </div>
                ) : cart.length > 0 ? (
                  cart.map((item) => (
                    <div
                      key={item.id}
                      id={`cart-item-node-${item.id}`}
                      className="flex items-start space-x-4 border-b pb-4 last:border-none last:pb-0"
                      style={{ borderColor: isDark ? '#1C1C1E' : '#F5F5F5' }}
                    >
                      {/* Thumbnail */}
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-16 aspect-[3/4] object-cover bg-neutral-100 cursor-pointer"
                        onClick={() => {
                          setSelectedProduct(item.product);
                          setCartOpen(false);
                        }}
                      />
                      
                      {/* Product specifications & name */}
                      <div className="flex-1 min-w-0">
                        <h4
                          className="text-[11px] tracking-widest uppercase font-medium truncate cursor-pointer hover:opacity-75"
                          onClick={() => {
                            setSelectedProduct(item.product);
                            setCartOpen(false);
                          }}
                        >
                          {item.product.name}
                        </h4>
                        
                        <p className="text-[10px] text-neutral-400 font-mono mt-1 uppercase">
                          {item.size} / {item.color}
                        </p>

                        <p className="text-[11px] text-neutral-600 dark:text-neutral-300 font-light mt-1.5">
                          ${item.product.price}
                        </p>

                        {/* Interactive Quantity control */}
                        <div className="flex items-center space-x-1.5 mt-2">
                          <button
                            id={`cart-qty-dec-${item.id}`}
                            onClick={() => handleUpdateCartQuantity(item.id, -1)}
                            className="p-1 border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
                          >
                            <Minus className="w-2.5 h-2.5" />
                          </button>
                          <span className="px-2 text-[10px] font-mono">{item.quantity}</span>
                          <button
                            id={`cart-qty-inc-${item.id}`}
                            onClick={() => handleUpdateCartQuantity(item.id, 1)}
                            className="p-1 border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
                          >
                            <Plus className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      </div>

                      {/* Remove item button */}
                      <button
                        id={`cart-remove-item-${item.id}`}
                        onClick={() => handleRemoveFromCart(item.id)}
                        className="text-neutral-400 hover:text-red-500 p-1.5 transition-colors"
                        title="Remove Article"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-20 space-y-3">
                    <p className="text-xs text-neutral-400 font-mono tracking-widest uppercase">
                      Your bag is empty.
                    </p>
                    <button
                      onClick={() => setCartOpen(false)}
                      className="text-[9px] tracking-widest uppercase border border-neutral-200 dark:border-neutral-800 px-4 py-2 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
                    >
                      Return to Lookbook
                    </button>
                  </div>
                )}
              </div>

              {/* Checkout Panel Footer */}
              {cart.length > 0 && !isCheckoutMocked && (
                <div className={`p-6 border-t space-y-4 bg-neutral-50 dark:bg-neutral-950 ${
                  isDark ? 'border-neutral-900' : 'border-neutral-100'
                }`}>
                  <div className="flex items-center justify-between text-xs tracking-widest uppercase">
                    <span className="font-light">Subtotal Balance</span>
                    <span className="font-bold">${getCartTotal().toFixed(2)}</span>
                  </div>
                  <p className="text-[9px] text-neutral-400 leading-relaxed font-mono uppercase">
                    Shipping & import duties calculated on confirmation. Fully biodegradable premium packaging.
                  </p>
                  <button
                    id="cart-checkout-btn"
                    onClick={() => setIsCheckoutMocked(true)}
                    className="w-full py-4 text-xs tracking-widest uppercase font-medium text-white flex items-center justify-center space-x-2 transition-all hover:opacity-90 active:translate-y-0.5"
                    style={{ backgroundColor: settings.primaryColor }}
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* DESIGNER CUSTOMIZER DASHBOARD DRAWER */}
      <DesignerDashboard
        settings={settings}
        isOpen={dashboardOpen}
        onClose={() => setDashboardOpen(false)}
        onUpdateSettings={(newSettings) => setSettings(newSettings)}
        onSaveToServer={handleSaveSettingsToServer}
      />

      {/* FLOATING STYLIST CHAT DIALOG CONTAINER */}
      <StylistChat
        products={products}
        settings={settings}
        isOpen={stylistOpen}
        onClose={() => setStylistOpen(!stylistOpen)}
        onSelectProduct={handleSelectProduct}
      />

    </div>
  );
}
