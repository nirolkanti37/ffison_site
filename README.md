# ShopEase - Modern E-Commerce Website

## 🚀 GitHub Pages Deployment Guide

### Step 1: Create GitHub Repository
- Go to GitHub → New Repository → Name it `shopease`

### Step 2: Upload Files
Upload these files to your repository:
- `index.html` - Main HTML file
- `style_part1.css` - CSS Part 1: Variables, Base, Header, Mega Menu
- `style_part2.css` - CSS Part 2: Hero Slider, Categories, Products, Flash Sale
- `style_part3.css` - CSS Part 3: Promo, Testimonials, Newsletter, Footer, Cart
- `style_part4.css` - CSS Part 4: Breadcrumb, Filter, Product Detail, Responsive
- `script.js` - JavaScript functionality
- `products.json` - Product data
- `products.xlsx` - Excel file to manage products
- `convert.html` - Browser-based Excel to JSON converter

### Step 3: Enable GitHub Pages
- Go to Settings → Pages
- Source: Deploy from a branch
- Select `main` branch
- Click Save

### Step 4: Access Your Site
Your site will be live at:
```
https://YOUR_USERNAME.github.io/shopease
```

## 📊 Managing Products via Excel

1. Open `products.xlsx`
2. Edit product details (name, price, stock, image URL, etc.)
3. Save the file
4. Open `convert.html` in browser
5. Upload the Excel file
6. Download updated `products.json`
7. Replace old `products.json` with new one
8. Commit and push to GitHub

## 🎨 CSS File Structure

| File | Contents |
|------|----------|
| `style_part1.css` | CSS Variables, Base Reset, Top Bar, Header, Search, Mega Menu |
| `style_part2.css` | Hero Slider, Section Headers, Categories, Product Cards, Flash Sale |
| `style_part3.css` | Promo Banners, Brands, Testimonials, Newsletter, Footer, Cart, Quick View |
| `style_part4.css` | Breadcrumb, Filter Sidebar, Product Detail, Tabs, Checkout, Responsive, Animations |

## ✨ Features
- 🔍 Advanced Search with Category Filter
- 🏷️ Mega Menu with Subcategories
- 🎠 Auto-playing Hero Slider
- 📂 Product Categories Grid
- 🛍️ Modern Product Cards with Hover Effects
- ⚡ Flash Sale with Countdown Timer
- 🎁 Promo Banners
- 💬 Customer Testimonials
- 📧 Newsletter Subscription
- 🛒 Shopping Cart with LocalStorage
- 📱 Fully Responsive Design
- 🎨 Smooth Animations & Transitions
- 🔔 Toast Notifications
- 🇧🇩 Bengali UI

## 📝 Product Excel Columns
| Column | Description |
|--------|-------------|
| id | Unique product ID |
| name | Product name |
| price | Current price (৳) |
| original_price | Original price for discount |
| category | Product category |
| image | Product image URL |
| description | Short description |
| rating | Rating (1-5) |
| stock | Available stock |
| badge | Special badge (Bestseller/New/Sale/Hot) |

---
Made with ❤️ for Bengali developers
