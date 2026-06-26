# 🛒 GitHub + Google Sheets Shop

A complete e-commerce website using **GitHub Pages** for hosting and **Google Sheets** for CMS/Control Panel.

---

## 📁 Project Structure

```
github-sheets-shop/
├── index.html              # Homepage
├── products.html           # Product listing page
├── product-detail.html     # Single product page
├── checkout.html           # Checkout page
├── order-success.html      # Order confirmation
├── about.html             # About page
├── contact.html           # Contact page
├── css/
│   ├── main.css           # Main styles
│   └── theme.css          # Dynamic theme variables
├── js/
│   ├── app.js             # Core application logic
│   └── cart.js            # Shopping cart functionality
├── data/                   # All data controlled by Google Sheets
│   ├── config.json        # Site settings
│   ├── products.json      # Product catalog
│   ├── categories.json    # Product categories
│   ├── coupons.json       # Discount codes
│   ├── shipping.json      # Shipping rules
│   ├── orders.json        # Orders (auto-generated)
│   ├── customers.json     # Customers (auto-generated)
│   └── pages.json         # Static pages content
└── assets/                # Images, logos, favicons
```

---

## 🚀 How to Run Locally

### Method 1: Direct Open (Limited)
Just double-click `index.html` — but some features won't work due to browser security (CORS).

### Method 2: Local Server (Recommended)

**Using Python:**
```bash
cd github-sheets-shop
python -m http.server 8000
```
Then open: `http://localhost:8000`

**Using VS Code:**
Install "Live Server" extension → Right-click `index.html` → "Open with Live Server"

**Using Node.js:**
```bash
npx serve github-sheets-shop
```

---

## 🌐 Deploy to GitHub Pages

### Step 1: Create GitHub Repository
1. Go to [github.com](https://github.com)
2. Click **New Repository**
3. Name: `github-sheets-shop`
4. Make it **Public**
5. Click **Create**

### Step 2: Upload Files
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/github-sheets-shop.git
git push -u origin main
```

### Step 3: Enable GitHub Pages
1. Go to repository → **Settings** → **Pages**
2. **Source**: Deploy from a branch
3. **Branch**: `main` / `(root)`
4. Click **Save**
5. Wait 2-3 minutes
6. Your site: `https://YOUR_USERNAME.github.io/github-sheets-shop`

---

## 📊 Google Sheets Setup

### Step 1: Create Spreadsheet
1. Go to [sheets.google.com](https://sheets.google.com)
2. Create new spreadsheet: `Shop CMS`
3. Create these sheets:
   - Settings
   - Products
   - Categories
   - Coupons
   - Shipping
   - Orders
   - Customers
   - Pages

### Step 2: Add Sample Data

**Settings Sheet:**
| Key | Value |
|-----|-------|
| site_name | My Shop |
| primary_color | #FF6B6B |
| contact_email | admin@myshop.com |

**Products Sheet:**
| id | title | price | stock | category | image_main |
|----|-------|-------|-------|----------|------------|
| PROD-001 | T-Shirt | 29.99 | 50 | mens-clothing | image_url |

### Step 3: Add Apps Script
1. **Extensions** → **Apps Script**
2. Paste the script from `apps-script/` folder
3. Add GitHub Token to Script Properties
4. Set up triggers

---

## 🔑 GitHub Token Setup

1. Go to [github.com/settings/tokens](https://github.com/settings/tokens)
2. Click **Generate new token** → **Fine-grained token**
3. Token name: `sheets-sync`
4. Repository access: Select your repo
5. Permissions: **Contents** → Read and Write
6. Click **Generate**
7. Copy the token
8. In Apps Script: **Project Settings** → **Script Properties** → Add `GITHUB_TOKEN`

---

## 🔄 How It Works

```
Google Sheets (CMS)
    ↓ onEdit trigger
Google Apps Script
    ↓ GitHub API
GitHub Repository (data/*.json)
    ↓ GitHub Pages
Website (Live!)
```

---

## 🎨 Customize Your Shop

### Change Colors
Edit `data/config.json` → `primary_color`, `secondary_color`

### Add Products
Edit `data/products.json` or use Google Sheets

### Change Logo
Replace `assets/logo.png`

### Add Pages
Edit `data/pages.json`

---

## 💰 Cost

| Service | Cost |
|---------|------|
| GitHub Pages | **FREE** |
| Google Sheets | **FREE** |
| Google Apps Script | **FREE** |
| Domain (optional) | ~$12/year |

**Total: $0/year!**

---

## ⚠️ Limitations

- No real-time inventory (5 min delay via jsDelivr)
- No built-in payment gateway (use COD or external)
- GitHub Pages = static hosting only
- Max ~1000 products recommended

---

## 📞 Support

For issues or questions, create an issue on GitHub or contact: admin@myshop.com

---

Made with ❤️ using GitHub + Google Sheets
