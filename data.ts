import { Product, BrandSettings } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: "cashmere-coat",
    name: "The Tailored Cashmere Coat",
    price: 420,
    category: "Outerwear",
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=800",
    alternateImage: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&q=80&w=800",
    description: "An elegant, long coat meticulously tailored from a luxurious double-faced wool and cashmere blend. Designed with clean drape, minimal seams, and a subtle self-tie waist belt for unstructured sophistication.",
    details: [
      "85% Virgin Wool, 15% Cashmere",
      "Double-breasted unstructured silhouette",
      "Concealed seam-pockets",
      "Unlined finish for effortless drape",
      "Dry clean only"
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { name: "Oatmeal", hex: "#E3DCCF" },
      { name: "Charcoal", hex: "#3A3B3C" },
      { name: "Noir", hex: "#1A1A1A" }
    ],
    featured: true
  },
  {
    id: "silk-shirt",
    name: "The Classic Silk Shirt",
    price: 185,
    category: "Tops",
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=800",
    alternateImage: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&q=80&w=800",
    description: "An essential addition to the modern wardrobe. This collarless drape shirt is crafted from heavy sandwashed mulberry silk, giving it a soft, peach-skin finish and a liquid-like drape.",
    details: [
      "100% Mulberry Silk (22 momme)",
      "Sandwashed texture",
      "Hidden front button placket",
      "Extended cuffs with mother-of-pearl buttons",
      "Hand wash cold"
    ],
    sizes: ["XS", "S", "M", "L"],
    colors: [
      { name: "Ivory", hex: "#FDFBF7" },
      { name: "Sable", hex: "#A69B8F" },
      { name: "Noir", hex: "#1A1A1A" }
    ],
    featured: true
  },
  {
    id: "wool-blazer",
    name: "The Structured Wool Blazer",
    price: 310,
    category: "Outerwear",
    image: "https://images.unsplash.com/photo-1548624149-f9b1859aa730?auto=format&fit=crop&q=80&w=800",
    alternateImage: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=800",
    description: "A sharp, sculptural blazer designed with a modern minimalist sensibility. Featuring clean single-button closure, razor-sharp peak lapels, and fully padded shoulders for an empowering, structured fit.",
    details: [
      "100% Traceable Merino Wool",
      "Structured shoulder pads",
      "Single horn-button closure",
      "Fully lined with 100% organic cotton",
      "Made in Portugal"
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Noir", hex: "#1A1A1A" },
      { name: "Soft Grey", hex: "#C8C8C8" }
    ],
    featured: true
  },
  {
    id: "linen-trouser",
    name: "The Pleated Linen Trouser",
    price: 190,
    category: "Pants",
    image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=800",
    alternateImage: "https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&q=80&w=800",
    description: "A relaxed, wide-leg trouser featuring sharp front pleats. Crafted from Belgian flax linen and organic cotton, they strike the perfect balance between casual breathability and high-end drape.",
    details: [
      "60% Flax Linen, 40% Organic Cotton",
      "High-rise with a relaxed wide leg",
      "Pressed front crease",
      "Adjustable inner button tabs",
      "Invisibly hemmed stitching"
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { name: "Sand", hex: "#D2B48C" },
      { name: "Olive", hex: "#4A5D4E" },
      { name: "Ivory", hex: "#FDFBF7" }
    ]
  },
  {
    id: "cashmere-sweater",
    name: "The Pure Cashmere Sweater",
    price: 260,
    category: "Knitwear",
    image: "https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&q=80&w=800",
    alternateImage: "https://images.unsplash.com/photo-1574164904299-3a102b110380?auto=format&fit=crop&q=80&w=800",
    description: "A classic crewneck sweater made of exceptionally soft 2-ply Mongolian cashmere. It features a dense, warm knit with finely ribbed neck, cuffs, and hem, designed for a relaxed, lifetime-lasting fit.",
    details: [
      "100% Grade-A Mongolian Cashmere",
      "Durable 2-ply tight knit",
      "Slightly dropped shoulders",
      "Ribbed collar, cuffs, and waist",
      "Ethically sourced yarn"
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Camel", hex: "#C19A6B" },
      { name: "Off-White", hex: "#F5F2EB" },
      { name: "Slate Grey", hex: "#708090" }
    ],
    featured: true
  },
  {
    id: "leather-tote",
    name: "The Minimalist Leather Tote",
    price: 350,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=800",
    alternateImage: "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&q=80&w=800",
    description: "The ultimate minimalist carryall. Hand-crafted from full-grain Italian vegetable-tanned leather. Features an unlined raw interior, simple top handles, and a secure internal zip pocket for essentials.",
    details: [
      "100% Vegetable-Tanned Italian Leather",
      "Raw interior with hanging zip pouch",
      "Reinforced top handles with 10\" drop",
      "Hand-painted edge finishing",
      "Dimensions: 14\" H x 18\" W x 6\" D"
    ],
    sizes: ["One Size"],
    colors: [
      { name: "Noir", hex: "#1A1A1A" },
      { name: "Cognac", hex: "#9E5B38" }
    ]
  },
  {
    id: "ribbed-dress",
    name: "The Ribbed Silk Dress",
    price: 210,
    category: "Dresses",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=800",
    alternateImage: "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&q=80&w=800",
    description: "A form-skimming midi dress with a delicate ribbed texture. Fabricated from a heavy silk-blend yarn, this dress moves beautifully with the body, delivering a sophisticated silhouette for day or evening.",
    details: [
      "55% Mulberry Silk, 45% Organic Cotton",
      "Finely ribbed body-contour knit",
      "Elegant scoop neckline",
      "Flared bottom hem",
      "Mid-calf length"
    ],
    sizes: ["XS", "S", "M", "L"],
    colors: [
      { name: "Noir", hex: "#1A1A1A" },
      { name: "Sable", hex: "#A69B8F" }
    ]
  }
];

export const DEFAULT_BRAND_SETTINGS: BrandSettings = {
  primaryColor: "#FFFFFF",
  secondaryColor: "#A3A3A3",
  bannerImage: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1600",
  bannerTitle: "NOIR & BLANC",
  bannerSubtitle: "A curation of essential silhouettes crafted for the modern minimalist. Summer Edition, Volume 01.",
  logoName: "A N T H E M",
  fontHeading: "Philosopher",
  fontBody: "Inter",
  themeMode: "dark"
};
