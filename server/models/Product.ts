import mongoose, { Schema, Document } from "mongoose";
import { INITIAL_PRODUCTS, ProductItem } from "../seedData.js";

export interface IProduct extends Document {
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
  isFeatured: boolean;
  isBestDeal: boolean;
  isFlashSale: boolean;
  isTrending: boolean;
  isNewArrival: boolean;
  isTopRated: boolean;
  isBestSeller: boolean;
  tags: string[];
}

const ProductSchema: Schema<IProduct> = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    category: { type: String, required: true, enum: ['Men', 'Women', 'Kids', 'Footwear', 'Accessories'] },
    price: { type: Number, required: true },
    originalPrice: { type: Number, required: true },
    discountPercent: { type: Number, default: 0 },
    badge: { type: String, enum: ['OFFER', 'HOT', 'NEW'] },
    image: { type: String, required: true },
    gallery: [{ type: String }],
    description: { type: String, required: true },
    details: { type: String },
    sizes: [{ type: String }],
    colors: [
      {
        name: { type: String },
        hex: { type: String },
        image: { type: String }
      }
    ],
    stock: { type: Number, default: 10 },
    rating: { type: Number, default: 4.5 },
    reviewsCount: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    isBestDeal: { type: Boolean, default: false },
    isFlashSale: { type: Boolean, default: false },
    isTrending: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
    isTopRated: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
    tags: [{ type: String }]
  },
  { timestamps: true }
);

// Fallback in-memory database store
export const memoryProducts: ProductItem[] = [...INITIAL_PRODUCTS];

export const ProductModel = mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);
