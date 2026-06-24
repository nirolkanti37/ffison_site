import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Body parser
  app.use(express.json());

  // GET brand settings
  app.get("/api/settings", (req, res) => {
    try {
      const settingsPath = path.join(process.cwd(), "content", "settings.json");
      if (fs.existsSync(settingsPath)) {
        const data = fs.readFileSync(settingsPath, "utf-8");
        return res.json(JSON.parse(data));
      }
      const defaults = {
        logoName: "A N T H E M",
        primaryColor: "#FFFFFF",
        secondaryColor: "#A3A3A3",
        themeMode: "dark",
        fontHeading: "Playfair Display",
        fontBody: "Inter",
        announcementText: "Complimentary worldwide delivery on orders exceeding $300."
      };
      return res.json(defaults);
    } catch (e: any) {
      console.error("Error loading settings:", e);
      return res.status(500).json({ error: "Failed to read settings" });
    }
  });

  // POST brand settings
  app.post("/api/settings", (req, res) => {
    try {
      const settingsPath = path.join(process.cwd(), "content", "settings.json");
      fs.writeFileSync(settingsPath, JSON.stringify(req.body, null, 2), "utf-8");
      return res.json({ success: true, settings: req.body });
    } catch (e: any) {
      console.error("Error saving settings:", e);
      return res.status(500).json({ error: "Failed to save settings" });
    }
  });

  // GET homepage details
  app.get("/api/homepage", (req, res) => {
    try {
      const homepagePath = path.join(process.cwd(), "content", "homepage.json");
      if (fs.existsSync(homepagePath)) {
        const data = fs.readFileSync(homepagePath, "utf-8");
        return res.json(JSON.parse(data));
      }
      const defaults = {
        bannerTitle: "NOIR & BLANC",
        bannerSubtitle: "A curation of essential silhouettes crafted for the modern minimalist. Summer Edition, Volume 01.",
        bannerImage: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1600",
        buttonLink: "#collection"
      };
      return res.json(defaults);
    } catch (e: any) {
      console.error("Error loading homepage config:", e);
      return res.status(500).json({ error: "Failed to read homepage config" });
    }
  });

  // POST homepage details
  app.post("/api/homepage", (req, res) => {
    try {
      const homepagePath = path.join(process.cwd(), "content", "homepage.json");
      fs.writeFileSync(homepagePath, JSON.stringify(req.body, null, 2), "utf-8");
      return res.json({ success: true, homepage: req.body });
    } catch (e: any) {
      console.error("Error saving homepage config:", e);
      return res.status(500).json({ error: "Failed to save homepage config" });
    }
  });

  // GET products catalog from files (managed by CMS)
  app.get("/api/products", (req, res) => {
    try {
      const productsDir = path.join(process.cwd(), "content", "products");
      if (!fs.existsSync(productsDir)) {
        fs.mkdirSync(productsDir, { recursive: true });
      }

      // If directory is empty, seed it with defaults
      let files = fs.readdirSync(productsDir).filter(f => f.endsWith(".json"));
      if (files.length === 0) {
        const seedProducts = [
          {
            id: "cashmere-coat",
            title: "The Tailored Cashmere Coat",
            price: 420,
            image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=800",
            category: "Outerwear",
            alternateImage: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&q=80&w=800",
            description: "An elegant, long coat meticulously tailored from a luxurious double-faced wool and cashmere blend. Designed with clean drape, minimal seams, and a subtle self-tie waist belt for unstructured sophistication.",
            details: ["85% Virgin Wool, 15% Cashmere", "Double-breasted unstructured silhouette", "Concealed seam-pockets", "Unlined finish for effortless drape", "Dry clean only"],
            sizes: ["XS", "S", "M", "L", "XL"],
            colors: [{ name: "Oatmeal", hex: "#E3DCCF" }, { name: "Charcoal", hex: "#3A3B3C" }, { name: "Noir", hex: "#1A1A1A" }],
            featured: true
          },
          {
            id: "silk-shirt",
            title: "The Classic Silk Shirt",
            price: 185,
            image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=800",
            category: "Tops",
            alternateImage: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&q=80&w=800",
            description: "An essential addition to the modern wardrobe. This collarless drape shirt is crafted from heavy sandwashed mulberry silk, giving it a soft, peach-skin finish and a liquid-like drape.",
            details: ["100% Mulberry Silk (22 momme)", "Sandwashed texture", "Hidden front button placket", "Extended cuffs with mother-of-pearl buttons", "Hand wash cold"],
            sizes: ["XS", "S", "M", "L"],
            colors: [{ name: "Ivory", hex: "#FDFBF7" }, { name: "Sable", hex: "#A69B8F" }, { name: "Noir", hex: "#1A1A1A" }],
            featured: true
          },
          {
            id: "wool-blazer",
            title: "The Structured Wool Blazer",
            price: 310,
            image: "https://images.unsplash.com/photo-1548624149-f9b1859aa730?auto=format&fit=crop&q=80&w=800",
            category: "Outerwear",
            alternateImage: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=800",
            description: "A sharp, sculptural blazer designed with a modern minimalist sensibility. Featuring clean single-button closure, razor-sharp peak lapels, and fully padded shoulders for an empowering, structured fit.",
            details: ["100% Traceable Merino Wool", "Structured shoulder pads", "Modern peak lapels", "Single horn-button closure", "Fully lined in luxury cupro"],
            sizes: ["XS", "S", "M", "L", "XL"],
            colors: [{ name: "Sable", hex: "#A69B8F" }, { name: "Noir", hex: "#1A1A1A" }],
            featured: true
          }
        ];
        for (const p of seedProducts) {
          fs.writeFileSync(path.join(productsDir, `${p.id}.json`), JSON.stringify(p, null, 2), "utf-8");
        }
        files = fs.readdirSync(productsDir).filter(f => f.endsWith(".json"));
      }

      const productsList = files.map(filename => {
        const fileContent = fs.readFileSync(path.join(productsDir, filename), "utf-8");
        const parsed = JSON.parse(fileContent);
        return {
          ...parsed,
          id: parsed.id || filename.replace(".json", ""),
          name: parsed.title || parsed.name || "Unnamed Product",
          title: parsed.title || parsed.name || "Unnamed Product",
          price: Number(parsed.price) || 0,
          category: parsed.category || "Uncategorized",
          image: parsed.image || "",
          alternateImage: parsed.alternateImage || parsed.image || "",
          description: parsed.description || "",
          details: parsed.details || [],
          sizes: parsed.sizes || ["S", "M", "L"],
          colors: parsed.colors || [{ name: "Default", hex: "#000000" }],
          featured: parsed.featured !== undefined ? parsed.featured : true
        };
      });

      return res.json(productsList);
    } catch (e: any) {
      console.error("Error reading products:", e);
      return res.status(500).json({ error: "Failed to read products" });
    }
  });

  // POST to create / update a product (e.g. from app dashboard or custom forms)
  app.post("/api/products", (req, res) => {
    try {
      const product = req.body;
      if (!product.id) {
        return res.status(400).json({ error: "Product id is required." });
      }
      const productsDir = path.join(process.cwd(), "content", "products");
      if (!fs.existsSync(productsDir)) {
        fs.mkdirSync(productsDir, { recursive: true });
      }
      fs.writeFileSync(path.join(productsDir, `${product.id}.json`), JSON.stringify(product, null, 2), "utf-8");
      return res.json({ success: true, product });
    } catch (e: any) {
      console.error("Error saving product:", e);
      return res.status(500).json({ error: "Failed to save product" });
    }
  });

  // POST styling assistant
  app.post("/api/stylist", async (req, res) => {
    try {
      const { messages, products } = req.body;
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Messages array is required." });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.includes("MY_")) {
        return res.json({
          text: "I am The Stylist at ANTHEM. I am here to elevate your wardrobe curation. (Note: Live styling advice is active with a simulated luxury responses engine because the system secret key is initializing. To customize your look, I recommend our 'Tailored Cashmere Coat' draped over 'The Classic Silk Shirt' in Ivory for a crisp, high-contrast, structured feel.)"
        });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const catalogInfo = products.map((p: any) => 
        `- Product ID: ${p.id}
         Name: ${p.name}
         Price: $${p.price}
         Category: ${p.category}
         Colors: ${p.colors.map((c: any) => c.name).join(", ")}
         Sizes: ${p.sizes.join(", ")}
         Description: ${p.description}
         Details: ${p.details.join("; ")}`
      ).join("\n\n");

      const systemInstruction = `You are 'The Fashion Stylist', an elite personal wardrobe stylist and shopping assistant for ANTHEM, a high-end minimalist luxury label. 
Our aesthetics resemble Jil Sander, Lemaire, Cos, and Zara with rigorous high-end tailoring.

Your Characteristics:
- Speak with quiet authority, design-literacy, and calm poise.
- NEVER use exclamation marks, salesman hyperbole, or enthusiastic greetings like "Awesome!" or "Great choice!".
- Keep the language clean, modern, and focused on textures, fibers, weights of fabrics, drape, and visual balance.
- Focus on the capsule wardrobe philosophy: quality over quantity, investing in timeless structural silhouettes, and layering monochrome tones.

Available Brand Catalog:
${catalogInfo}

Your Goal:
- Welcome the customer with polished elegance.
- Offer direct, ultra-sophisticated styling recommendations.
- Select products from our catalogue by their exact names to suggest.
- Give constructive, beautiful design-driven combinations. Keep responses to 2-3 short, clean, elegant paragraphs.`;

      const conversationTranscript = messages.map((m: any) => {
        const roleName = m.sender === 'user' ? 'Client' : 'Stylist';
        return `${roleName}: ${m.text}`;
      }).join("\n");

      const promptText = `${conversationTranscript}\nStylist:`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: promptText,
        config: {
          systemInstruction,
          temperature: 0.6,
        }
      });

      const replyText = response.text || "I am at your disposal. Let us discuss the silhouettes and materials you wish to explore today.";
      return res.json({ text: replyText });
    } catch (err: any) {
      console.error("Gemini API Error:", err);
      return res.json({
        text: "I am currently meditating on the details of our new cashmere weave. For now, let me advise styling our Structured Wool Blazer with the fluid sandwashed Mulberry Silk Shirt for a timeless silhouette."
      });
    }
  });

  // Serve static assets and handle Vite in development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
