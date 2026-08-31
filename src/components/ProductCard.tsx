import React from "react";
import { Heart, Eye, Plus, Minus, Trash2, Star, Sparkles } from "lucide-react";
import { Product } from "../types";
import { useAppDispatch, useAppSelector } from "../store";
import {
  addToCart,
  incrementQuantity,
  decrementQuantity,
  removeFromCart,
} from "../store/slices/cartSlice";
import { toggleWishlist } from "../store/slices/wishlistSlice";
import { setSelectedProduct } from "../store/slices/productSlice";
import { openQuickView, showToast } from "../store/slices/uiSlice";

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  const wishlistItems = useAppSelector((state) => state.wishlist.items);

  const isWishlisted = wishlistItems.some((item) => item.id === product.id);
  const cartItem = cartItems.find((item) => item.productId === product.id);
  const cartQuantity = cartItem ? cartItem.quantity : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(
      addToCart({
        product,
        quantity: 1,
        size: product.sizes?.[0] || "Standard",
        color: product.colors?.[0]?.name || "Standard",
      })
    );
    dispatch(
      showToast({
        message: `Added ${product.name} to Cart`,
        type: "success",
      })
    );
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (cartItem) {
      dispatch(incrementQuantity(cartItem.id));
    } else {
      handleAddToCart(e);
    }
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (cartItem) {
      dispatch(decrementQuantity(cartItem.id));
      if (cartItem.quantity === 1) {
        dispatch(
          showToast({
            message: `Removed ${product.name} from Cart`,
            type: "info",
          })
        );
      }
    }
  };

  const handleDeleteFromCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (cartItem) {
      dispatch(removeFromCart(cartItem.id));
      dispatch(
        showToast({
          message: `Deleted ${product.name} from Cart`,
          type: "info",
        })
      );
    }
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(toggleWishlist(product));
    dispatch(
      showToast({
        message: isWishlisted ? `Removed from Wishlist` : `Saved to Wishlist!`,
        type: "success",
      })
    );
  };

  const handleOpenDetail = () => {
    dispatch(setSelectedProduct(product));
    dispatch(openQuickView());
  };

  const getBadgeColor = (badge?: string) => {
    switch (badge) {
      case "OFFER":
        return "bg-rose-500 text-white";
      case "HOT":
        return "bg-amber-500 text-slate-950";
      case "NEW":
        return "bg-emerald-600 text-white";
      default:
        return "bg-slate-800 text-white";
    }
  };

  return (
    <div
      onClick={handleOpenDetail}
      className="group bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-xl hover:border-emerald-300 transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer relative"
    >
      {/* Top Image Container */}
      <div className="relative w-full aspect-square bg-slate-100 overflow-hidden">
        {/* Badges (Top Left) */}
        <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1 items-start">
          {product.badge && (
            <span
              className={`text-[10px] font-extrabold px-2 py-0.5 rounded shadow-xs uppercase tracking-wider ${getBadgeColor(
                product.badge
              )}`}
            >
              {product.badge}
            </span>
          )}
          {product.discountPercent > 0 && (
            <span className="bg-rose-600 text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded shadow-xs">
              -{product.discountPercent}%
            </span>
          )}
        </div>

        {/* Wishlist & Quick View Actions (Top Right) */}
        <div className="absolute top-2.5 right-2.5 z-10 flex flex-col gap-1.5 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={handleToggleWishlist}
            className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md shadow-md transition-all ${
              isWishlisted
                ? "bg-rose-500 text-white"
                : "bg-white/90 text-slate-700 hover:bg-rose-500 hover:text-white"
            }`}
            title="Wishlist"
            aria-label="Wishlist"
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? "fill-white" : ""}`} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleOpenDetail();
            }}
            className="w-8 h-8 rounded-full bg-white/90 text-slate-700 hover:bg-emerald-600 hover:text-white flex items-center justify-center backdrop-blur-md shadow-md transition-all"
            title="Quick View"
            aria-label="Quick View"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {/* Product Image with Hover Scale */}
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500"
          loading="lazy"
        />

        {/* Stock / Flash indicator */}
        {product.stock <= 10 && (
          <div className="absolute bottom-2 left-2 z-10 bg-black/60 backdrop-blur-xs text-white text-[10px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping"></span>
            Only {product.stock} left
          </div>
        )}
      </div>

      {/* Card Info Details */}
      <div className="p-3.5 flex flex-col flex-1 justify-between">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
            <span className="font-semibold uppercase text-emerald-600">
              {product.category}
            </span>
            <div className="flex items-center gap-1 text-amber-500 font-bold">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{product.rating}</span>
              <span className="text-slate-400 font-normal">({product.reviewsCount})</span>
            </div>
          </div>

          {/* Product Title */}
          <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2 group-hover:text-emerald-600 transition-colors">
            {product.name}
          </h3>
        </div>

        {/* Price & Add / Delete / Quantity Redux Control */}
        <div className="pt-3 border-t border-slate-100 mt-3 flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="font-extrabold text-slate-950 text-base text-emerald-700">
                ৳{product.price.toLocaleString()}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-xs text-slate-400 line-through">
                  ৳{product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
            {product.discountPercent > 0 && (
              <span className="text-[10px] text-emerald-600 font-bold">
                Save ৳{(product.originalPrice - product.price).toLocaleString()}
              </span>
            )}
          </div>

          {/* Interactive Add / Delete Redux Actions */}
          {cartQuantity === 0 ? (
            <button
              onClick={handleAddToCart}
              className="w-8 h-8 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow-xs transition-transform active:scale-90"
              title="Add to Cart"
              aria-label="Add to cart"
            >
              <Plus className="w-4 h-4" />
            </button>
          ) : (
            <div
              onClick={(e) => e.stopPropagation()}
              className="flex items-center bg-emerald-50 border border-emerald-300 rounded-xl p-0.5 shadow-xs"
            >
              <button
                onClick={handleDecrement}
                className="w-6 h-6 rounded-lg bg-white text-emerald-700 hover:bg-rose-100 hover:text-rose-700 flex items-center justify-center text-xs font-bold transition-colors"
                title={cartQuantity === 1 ? "Remove" : "Decrease"}
              >
                {cartQuantity === 1 ? <Trash2 className="w-3 h-3 text-rose-500" /> : <Minus className="w-3 h-3" />}
              </button>
              <span className="px-2 text-xs font-extrabold text-emerald-950">
                {cartQuantity}
              </span>
              <button
                onClick={handleIncrement}
                className="w-6 h-6 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 flex items-center justify-center text-xs font-bold transition-colors"
                title="Increase"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
