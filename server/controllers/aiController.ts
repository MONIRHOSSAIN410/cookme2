import { Request, Response } from "express";
import { GoogleGenAI } from "@google/genai";
import { memoryProducts } from "../models/Product.js";

// Initialize Gemini Client safely
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    try {
      aiClient = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    } catch (err) {
      console.warn("Gemini client initialization failed:", err);
    }
  }
  return aiClient;
}

export async function chatWithAi(req: Request, res: Response) {
  try {
    const { message, history } = req.body;

    if (!message || typeof message !== "string" || message.trim() === "") {
      return res.status(400).json({ success: false, message: "Message is required" });
    }

    const catalogSummary = memoryProducts
      .slice(0, 10)
      .map((p) => `- ${p.name} (Category: ${p.category}, Price: ৳${p.price}, Original: ৳${p.originalPrice}, Discount: ${p.discountPercent}%, Stock: ${p.stock})`)
      .join("\n");

    const systemInstruction = `You are the AI Shopping & Styling Assistant for 'CookMe Fashion & Lifestyle Store' (Bangladesh).
You assist customers with product recommendations, outfit coordination, size guidance, delivery info (Inside Dhaka ৳60 / Outside Dhaka ৳120, Cash on Delivery available), and placing orders.
Always mention Bangladeshi Taka (৳) when referring to prices.
Be polite, warm, engaging, and provide concise, stylish advice with relevant product recommendations from our store.

Our Current Top Catalog Items:
${catalogSummary}

Customer Support Numbers: 01711254089, 01911970994.`;

    const ai = getGeminiClient();

    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: "gemini-3.7-flash",
          contents: message,
          config: {
            systemInstruction,
            temperature: 0.7,
          },
        });

        const reply = response.text || "Hello! I am your CookMe assistant. How can I help you style your look or shop today?";

        // Recommend matching product IDs from catalog if applicable
        const lowerMsg = message.toLowerCase();
        const recommended = memoryProducts
          .filter((p) => lowerMsg.includes(p.name.toLowerCase()) || lowerMsg.includes(p.category.toLowerCase()) || lowerMsg.includes("recommend") || lowerMsg.includes("best") || lowerMsg.includes("dress") || lowerMsg.includes("t-shirt") || lowerMsg.includes("sneaker"))
          .slice(0, 3);

        return res.json({
          success: true,
          reply,
          recommendedProducts: recommended
        });
      } catch (geminiError: any) {
        console.warn("Gemini API error, falling back to smart local response:", geminiError.message);
      }
    }

    // Smart Local Fallback Response Engine
    const lower = message.toLowerCase();
    let reply = "Welcome to CookMe! I can help you find fashionable clothes, stylish sunglasses, sneakers, kids wear, and track orders across Bangladesh.";
    let recommended = memoryProducts.slice(0, 2);

    if (lower.includes("saree") || lower.includes("women") || lower.includes("dress") || lower.includes("blazer")) {
      reply = "Our Women's Collection features the best-selling **Floral Summer Dress (৳2,450)**, **Elegant Saree Collection (৳3,200)**, and **Casual Linen Blazer (৳2,890)**. Perfect for parties, festivals, and office wear!";
      recommended = memoryProducts.filter((p) => p.category === "Women");
    } else if (lower.includes("t-shirt") || lower.includes("shirt") || lower.includes("men") || lower.includes("jacket") || lower.includes("jean")) {
      reply = "For Men, we highly recommend our **Classic Cotton T-Shirt (৳890)**, **Slim Fit Denim Jeans (৳1,890)**, and the **Genuine Biker Leather Jacket (৳5,490)** with 11% OFF!";
      recommended = memoryProducts.filter((p) => p.category === "Men");
    } else if (lower.includes("shoe") || lower.includes("sneaker") || lower.includes("footwear")) {
      reply = "Our **Classic White Streetwear Sneakers (৳2,490)** are currently trending! Lightweight, cushioned, and perfect for all-day comfort.";
      recommended = memoryProducts.filter((p) => p.category === "Footwear");
    } else if (lower.includes("sunglass") || lower.includes("bag") || lower.includes("accessor")) {
      reply = "Check out our **Premium UV400 Sunglasses (৳1,290)** and **Quilted Leather Crossbody Bag (৳1,890)**. Both have high customer ratings!";
      recommended = memoryProducts.filter((p) => p.category === "Accessories");
    } else if (lower.includes("delivery") || lower.includes("shipping") || lower.includes("dhaka") || lower.includes("cost")) {
      reply = "🚚 **Delivery Info**: Inside Dhaka standard delivery is only **৳60** (1-2 days). Outside Dhaka nationwide delivery is **৳120** (2-4 days). Cash on Delivery is available!";
    } else if (lower.includes("number") || lower.includes("phone") || lower.includes("contact") || lower.includes("support")) {
      reply = "📞 You can reach our direct order & helpline numbers at **01711254089** and **01911970994**. We will also send instant SMS confirmations to these numbers when you order!";
    }

    return res.json({
      success: true,
      reply,
      recommendedProducts: recommended
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || "Failed to process chat" });
  }
}
