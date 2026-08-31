import { Request, Response } from "express";
import { memoryProducts, ProductModel } from "../models/Product.js";
import { CATEGORIES_DATA } from "../seedData.js";

export async function getProducts(req: Request, res: Response) {
  try {
    const {
      category,
      search,
      minPrice,
      maxPrice,
      minRating,
      sort,
      section
    } = req.query;

    let products = [...memoryProducts];

    // Filter by Section
    if (section === "featured") {
      products = products.filter((p) => p.isFeatured);
    } else if (section === "bestDeals") {
      products = products.filter((p) => p.isBestDeal);
    } else if (section === "flashSale") {
      products = products.filter((p) => p.isFlashSale);
    } else if (section === "trending") {
      products = products.filter((p) => p.isTrending);
    } else if (section === "newArrivals") {
      products = products.filter((p) => p.isNewArrival || p.badge === 'NEW');
    } else if (section === "topRated") {
      products = products.filter((p) => p.isTopRated || p.rating >= 4.7);
    } else if (section === "bestSeller") {
      products = products.filter((p) => p.isBestSeller || p.reviewsCount > 30);
    }

    // Filter by Category
    if (category && category !== "All" && category !== "all") {
      products = products.filter(
        (p) => p.category.toLowerCase() === (category as string).toLowerCase()
      );
    }

    // Filter by Search Query
    if (search && typeof search === "string" && search.trim() !== "") {
      const q = search.toLowerCase().trim();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Filter by Price Range
    if (minPrice) {
      products = products.filter((p) => p.price >= Number(minPrice));
    }
    if (maxPrice) {
      products = products.filter((p) => p.price <= Number(maxPrice));
    }

    // Filter by Min Rating
    if (minRating) {
      products = products.filter((p) => p.rating >= Number(minRating));
    }

    // Sort products
    if (sort) {
      switch (sort) {
        case "price_asc":
        case "Price: Low -> High":
          products.sort((a, b) => a.price - b.price);
          break;
        case "price_desc":
        case "Price: High -> Low":
          products.sort((a, b) => b.price - a.price);
          break;
        case "rating":
        case "Highest Rated":
          products.sort((a, b) => b.rating - a.rating);
          break;
        case "name_asc":
        case "Name: A-Z":
          products.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case "offers":
        case "Offers First":
          products.sort((a, b) => b.discountPercent - a.discountPercent);
          break;
        case "newest":
        case "Newest First":
          products.sort((a, b) => (b.badge === 'NEW' ? 1 : 0) - (a.badge === 'NEW' ? 1 : 0));
          break;
        default:
          break;
      }
    }

    return res.json({
      success: true,
      count: products.length,
      products
    });
  } catch (error: any) {
    console.error("Get products error:", error);
    return res.status(500).json({ success: false, message: error.message || "Failed to fetch products" });
  }
}

export async function getProductById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const product = memoryProducts.find((p) => p.id === id || p.slug === id);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Related products (same category or general)
    const relatedProducts = memoryProducts
      .filter((p) => p.id !== product.id && (p.category === product.category || p.isFeatured))
      .slice(0, 4);

    return res.json({
      success: true,
      product,
      relatedProducts
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function getCategories(req: Request, res: Response) {
  return res.json({
    success: true,
    categories: CATEGORIES_DATA
  });
}

export async function addProduct(req: Request, res: Response) {
  try {
    const { name, category, price, originalPrice, description, image, sizes, colors, tags } = req.body;

    if (!name || !category || !price || !image) {
      return res.status(400).json({ success: false, message: "Missing required fields (name, category, price, image)" });
    }

    const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;
    const newProduct = {
      id: `prod-${Date.now()}`,
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      category,
      price: Number(price),
      originalPrice: Number(originalPrice || price),
      discountPercent: discount,
      badge: discount > 15 ? "OFFER" : "NEW",
      image,
      gallery: [image],
      description: description || "Authentic quality lifestyle product.",
      details: "Quality guaranteed by CookMe Bangladesh.",
      sizes: sizes || ["Standard"],
      colors: colors || [{ name: "Standard", hex: "#111827" }],
      stock: 15,
      rating: 5.0,
      reviewsCount: 1,
      isFeatured: true,
      isBestDeal: discount > 15,
      isFlashSale: false,
      isTrending: true,
      isNewArrival: true,
      isTopRated: true,
      isBestSeller: false,
      tags: tags || [category.toLowerCase()]
    };

    memoryProducts.unshift(newProduct as any);

    return res.status(201).json({
      success: true,
      message: "Product added successfully",
      product: newProduct
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function deleteProduct(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const index = memoryProducts.findIndex((p) => p.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const deleted = memoryProducts.splice(index, 1)[0];
    return res.json({
      success: true,
      message: `Product '${deleted.name}' deleted successfully`,
      deletedId: id
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
}
