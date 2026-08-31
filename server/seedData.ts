export interface ProductItem {
  id: string;
  name: string;
  slug: string;
  category: 'Men' | 'Women' | 'Kids' | 'Footwear' | 'Accessories';
  price: number;
  originalPrice: number;
  discountPercent: number;
  badge?: 'OFFER' | 'HOT' | 'NEW';
  image: string;
  gallery: string[];
  description: string;
  details: string;
  sizes: string[];
  colors: { name: string; hex: string; image?: string }[];
  stock: number;
  rating: number;
  reviewsCount: number;
  isFeatured?: boolean;
  isBestDeal?: boolean;
  isFlashSale?: boolean;
  isTrending?: boolean;
  isNewArrival?: boolean;
  isTopRated?: boolean;
  isBestSeller?: boolean;
  tags: string[];
}

export const INITIAL_PRODUCTS: ProductItem[] = [
  {
    id: "prod-1",
    name: "Premium Sunglasses",
    slug: "premium-sunglasses",
    category: "Accessories",
    price: 1290,
    originalPrice: 1590,
    discountPercent: 19,
    badge: "OFFER",
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1508296695146-257a814070b4?w=800&auto=format&fit=crop&q=80"
    ],
    description: "Iconic metal frame round sunglasses with UV400 polarized optical protection.",
    details: "Lightweight titanium alloy frame with scratch-resistant anti-reflective lenses. Perfect for everyday sun protection and outdoor fashion.",
    sizes: ["Standard", "Large"],
    colors: [
      { name: "Gold / Green", hex: "#d4af37", image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80" },
      { name: "Black / Dark", hex: "#1f2937", image: "https://images.unsplash.com/photo-1508296695146-257a814070b4?w=800&auto=format&fit=crop&q=80" }
    ],
    stock: 15,
    rating: 4.8,
    reviewsCount: 34,
    isFeatured: true,
    isBestDeal: true,
    isFlashSale: true,
    isTrending: true,
    isTopRated: true,
    tags: ["eyewear", "sunglasses", "summer", "accessories"]
  },
  {
    id: "prod-2",
    name: "Kids Graphic T-Shirt Pack",
    slug: "kids-graphic-t-shirt-pack",
    category: "Kids",
    price: 990,
    originalPrice: 1200,
    discountPercent: 18,
    badge: "OFFER",
    image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80"
    ],
    description: "Fun printed graphic tees for everyday comfort and casual school wear.",
    details: "100% combed breathable organic cotton. Double-stitched seams with bio-washed fabric to prevent shrinking.",
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Black", hex: "#111827", image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80" },
      { name: "White", hex: "#f3f4f6", image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80" }
    ],
    stock: 20,
    rating: 4.6,
    reviewsCount: 19,
    isFeatured: true,
    isBestDeal: true,
    isFlashSale: true,
    isTrending: true,
    isTopRated: true,
    tags: ["kids", "t-shirt", "cotton", "casual"]
  },
  {
    id: "prod-3",
    name: "Slim Fit Denim Jeans",
    slug: "slim-fit-denim-jeans",
    category: "Men",
    price: 1890,
    originalPrice: 2200,
    discountPercent: 14,
    badge: "OFFER",
    image: "https://images.unsplash.com/photo-1542272604-780c96856592?w=800&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1542272604-780c96856592?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&auto=format&fit=crop&q=80"
    ],
    description: "Durable stretch denim pants featuring classic five-pocket styling and vintage fade.",
    details: "98% Cotton, 2% Elastane for slight stretch. Antique copper rivets, YKK zipper fly, and reinforced belt loops.",
    sizes: ["30", "32", "34", "36"],
    colors: [
      { name: "Dark Indigo", hex: "#1e3a8a" },
      { name: "Washed Black", hex: "#1f2937" },
      { name: "Light Blue", hex: "#60a5fa" }
    ],
    stock: 14,
    rating: 4.7,
    reviewsCount: 42,
    isFeatured: true,
    isBestDeal: true,
    isFlashSale: true,
    isBestSeller: true,
    tags: ["jeans", "denim", "men", "pants"]
  },
  {
    id: "prod-4",
    name: "Classic White Sneakers",
    slug: "classic-white-sneakers",
    category: "Footwear",
    price: 2490,
    originalPrice: 2990,
    discountPercent: 17,
    badge: "HOT",
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&auto=format&fit=crop&q=80"
    ],
    description: "Timeless low-top streetwear leather sneakers with cushioned rubber sole.",
    details: "Supple synthetic leather upper with padded collar, breathable textile lining, and vulcanized non-slip rubber tread.",
    sizes: ["40", "41", "42", "43", "44"],
    colors: [
      { name: "White / Brown", hex: "#d97706" },
      { name: "Triple White", hex: "#ffffff" },
      { name: "White / Navy", hex: "#1e3a8a" }
    ],
    stock: 18,
    rating: 4.9,
    reviewsCount: 88,
    isFeatured: true,
    isBestDeal: true,
    isFlashSale: false,
    isTrending: true,
    isTopRated: true,
    isBestSeller: true,
    tags: ["shoes", "sneakers", "footwear", "streetwear"]
  },
  {
    id: "prod-5",
    name: "Elegant Saree Collection",
    slug: "elegant-saree-collection",
    category: "Women",
    price: 3200,
    originalPrice: 3800,
    discountPercent: 16,
    badge: "HOT",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800&auto=format&fit=crop&q=80"
    ],
    description: "Traditional Silk Saree with intricately woven zari border and contrasting blouse piece.",
    details: "Premium blended silk with golden thread embroidery along the pallu. Light, flowy drape suitable for festivals and wedding receptions.",
    sizes: ["Free Size (6.3m)"],
    colors: [
      { name: "Royal Purple", hex: "#581c87" },
      { name: "Crimson Red", hex: "#991b1b" },
      { name: "Emerald Green", hex: "#065f46" }
    ],
    stock: 8,
    rating: 4.9,
    reviewsCount: 56,
    isFeatured: true,
    isBestDeal: true,
    isTrending: true,
    isTopRated: true,
    isBestSeller: true,
    tags: ["saree", "traditional", "women", "festive"]
  },
  {
    id: "prod-6",
    name: "Men's Leather Jacket",
    slug: "mens-leather-jacket",
    category: "Men",
    price: 5490,
    originalPrice: 6200,
    discountPercent: 11,
    badge: "NEW",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1520975916090-3105956dac38?w=800&auto=format&fit=crop&q=80"
    ],
    description: "Classic biker cut genuine leather jacket with silver hardware and asymmetric zip.",
    details: "Supple nappa leather exterior with soft quilted satin interior lining. Includes 4 exterior zip pockets and 2 interior stash pockets.",
    sizes: ["M", "L", "XL", "XXL"],
    colors: [
      { name: "Matte Black", hex: "#111827" },
      { name: "Vintage Brown", hex: "#78350f" }
    ],
    stock: 9,
    rating: 4.9,
    reviewsCount: 67,
    isFeatured: true,
    isBestDeal: true,
    isNewArrival: true,
    isTrending: true,
    tags: ["jacket", "leather", "biker", "winter", "men"]
  },
  {
    id: "prod-7",
    name: "Classic Cotton T-Shirt",
    slug: "classic-cotton-t-shirt",
    category: "Men",
    price: 890,
    originalPrice: 1100,
    discountPercent: 19,
    badge: "HOT",
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&auto=format&fit=crop&q=80"
    ],
    description: "Premium regular fit crewneck t-shirt in pure organic cotton.",
    details: "180 GSM ring-spun cotton. Pre-shrunk, ultra-soft hand feel, and ribbed crew collar that holds its shape wash after wash.",
    sizes: ["L", "M", "XL"],
    colors: [
      { name: "Black", hex: "#111827", image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80" },
      { name: "Navy", hex: "#1e3a8a", image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&auto=format&fit=crop&q=80" },
      { name: "Red", hex: "#dc2626", image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80" }
    ],
    stock: 12,
    rating: 4.8,
    reviewsCount: 112,
    isFeatured: true,
    isBestDeal: true,
    isBestSeller: true,
    tags: ["t-shirt", "cotton", "basics", "men"]
  },
  {
    id: "prod-8",
    name: "Leather Crossbody Bag",
    slug: "leather-crossbody-bag",
    category: "Accessories",
    price: 1890,
    originalPrice: 2300,
    discountPercent: 18,
    badge: "OFFER",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80"
    ],
    description: "Compact quilted crossbody bag with adjustable gold chain strap.",
    details: "Signature chevron quilting with polished gold-toned hardware, interior zip compartment, and magnetic snap closure.",
    sizes: ["One Size"],
    colors: [
      { name: "Black", hex: "#111827" },
      { name: "Cream Beige", hex: "#fef3c7" },
      { name: "Burgundy", hex: "#881337" }
    ],
    stock: 11,
    rating: 4.9,
    reviewsCount: 47,
    isFeatured: true,
    isBestDeal: false,
    isNewArrival: true,
    isTrending: true,
    isTopRated: true,
    tags: ["bag", "crossbody", "leather", "accessories", "women"]
  },
  {
    id: "prod-9",
    name: "Floral Summer Dress",
    slug: "floral-summer-dress",
    category: "Women",
    price: 2450,
    originalPrice: 2900,
    discountPercent: 15,
    badge: "NEW",
    image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&auto=format&fit=crop&q=80"
    ],
    description: "Breezy chiffon red maxi dress with flowy pleated silhouette and waist sash.",
    details: "Lightweight breathable crepe georgette with subtle floral accents and soft cotton inner lining.",
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Ruby Red", hex: "#e11d48" },
      { name: "Pastel Blue", hex: "#93c5fd" }
    ],
    stock: 14,
    rating: 4.8,
    reviewsCount: 29,
    isFeatured: true,
    isNewArrival: true,
    isTrending: true,
    isTopRated: true,
    tags: ["dress", "summer", "women", "maxi"]
  },
  {
    id: "prod-10",
    name: "Formal Polo Shirt",
    slug: "formal-polo-shirt",
    category: "Men",
    price: 1150,
    originalPrice: 1400,
    discountPercent: 18,
    badge: "NEW",
    image: "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=800&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=800&auto=format&fit=crop&q=80"
    ],
    description: "Premium pique cotton polo shirt with mother-of-pearl buttons.",
    details: "Breathable honeycomb cotton knit with ribbed collar and cuffs. Tailored slim fit for both office and casual weekends.",
    sizes: ["M", "L", "XL", "XXL"],
    colors: [
      { name: "Peach Coral", hex: "#fb923c" },
      { name: "Jade Green", hex: "#10b981" },
      { name: "Slate Grey", hex: "#64748b" }
    ],
    stock: 22,
    rating: 4.7,
    reviewsCount: 38,
    isFeatured: false,
    isNewArrival: true,
    isTrending: true,
    tags: ["polo", "shirt", "formal", "men"]
  },
  {
    id: "prod-11",
    name: "Women's Casual Blazer",
    slug: "womens-casual-blazer",
    category: "Women",
    price: 2890,
    originalPrice: 3400,
    discountPercent: 15,
    badge: "HOT",
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&auto=format&fit=crop&q=80"
    ],
    description: "Structured relaxed blazer with notched lapels and flap pockets.",
    details: "Lightweight linen-blend suiting fabric. Tailored drape with shoulder pads for a sharp, modern silhouette.",
    sizes: ["S", "M", "L"],
    colors: [
      { name: "Sky Chambray", hex: "#38bdf8" },
      { name: "Oatmeal Beige", hex: "#e2e8f0" }
    ],
    stock: 7,
    rating: 4.8,
    reviewsCount: 22,
    isFeatured: false,
    isNewArrival: true,
    isTrending: true,
    isTopRated: true,
    tags: ["blazer", "outerwear", "women", "office"]
  },
  {
    id: "prod-12",
    name: "Kids Hoodie",
    slug: "kids-hoodie",
    category: "Kids",
    price: 1290,
    originalPrice: 1500,
    discountPercent: 14,
    badge: "OFFER",
    image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80"
    ],
    description: "Cozy fleece-lined pullover sweatshirt with front kangaroo pocket.",
    details: "Soft brushed fleece cotton with ribbed cuffs and elasticated hem. Keeps kids warm and comfortable all day.",
    sizes: ["4-5 Y", "6-7 Y", "8-9 Y", "10-12 Y"],
    colors: [
      { name: "Black", hex: "#111827" },
      { name: "Heather Grey", hex: "#9ca3af" }
    ],
    stock: 16,
    rating: 4.7,
    reviewsCount: 15,
    isFeatured: false,
    isNewArrival: false,
    isTrending: true,
    isTopRated: true,
    tags: ["kids", "hoodie", "winter", "sweatshirt"]
  }
];

export const CATEGORIES_DATA = [
  {
    id: "cat-1",
    name: "Footwear",
    itemCount: 1,
    iconColor: "bg-amber-500",
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "cat-2",
    name: "Accessories",
    itemCount: 2,
    iconColor: "bg-purple-600",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "cat-3",
    name: "Men",
    itemCount: 4,
    iconColor: "bg-slate-700",
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "cat-4",
    name: "Women",
    itemCount: 3,
    iconColor: "bg-rose-500",
    image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "cat-5",
    name: "Kids",
    itemCount: 2,
    iconColor: "bg-cyan-500",
    image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&auto=format&fit=crop&q=80",
  }
];
