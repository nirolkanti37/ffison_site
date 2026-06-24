export interface ColorOption {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  alternateImage: string;
  description: string;
  details: string[];
  sizes: string[];
  colors: ColorOption[];
  featured?: boolean;
}

export interface BrandSettings {
  primaryColor: string;
  secondaryColor: string;
  bannerImage: string;
  bannerTitle: string;
  bannerSubtitle: string;
  logoName: string;
  fontHeading: 'Space Grotesk' | 'Playfair Display' | 'Inter' | 'Montserrat' | 'Philosopher';
  fontBody: 'Inter' | 'JetBrains Mono';
  themeMode: 'light' | 'dark';
  primary_color?: string;
  secondary_color?: string;
  logo?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'stylist';
  text: string;
  timestamp: string;
}
