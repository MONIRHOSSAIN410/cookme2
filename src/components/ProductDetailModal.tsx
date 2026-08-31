import React, { useState } from "react";
import {
  X,
  Star,
  ShieldCheck,
  Truck,
  RefreshCw,
  Heart,
  Plus,
  Minus,
  Check,
  ShoppingBag,
  Zap,
  Share2,
  Phone
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../store";
import { closeQuickView, openCheckoutModal, showToast } from "../store/slices/uiSlice";
import { addToCart } from "../store/slices/cartSlice";
import { toggleWishlist } from "../store/slices/wishlistSlice";
import { setSelectedProduct } from "../store/slices/productSlice";

export const ProductDetailModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isQuickViewOpen } = useAppSelector((state) => state.ui);
  const { selectedProduct: product, products } = useAppSelector((state) => state.products);
  const wishlistItems = useAppSelector((state) => state.wishlist.items);

  const [selectedImage, setSelectedImage] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'reviews'>('desc');

  // New review state
  const [reviewsList, setReviewsList] = useState<{ name: string; rating: number; comment: string; date: string }[]>([
    {
      name: "Tariqul Islam",
      rating: 5,
      comment: "Super fast delivery in Dhaka! Fabric quality and finish is 100% authentic as shown.",
      date: "2 days ago"
    },
    {
      name: "Sabrina Rahman",
      rating: 5,
      comment: "Loved the fitting and stitching. Received SMS confirmation right away after ordering.",
      date: "1 week ago"
    }
  ]);
  const [newReviewName, setNewReviewName] = useState("");
  const [newReviewComment, setNewReviewComment] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(5);

  if (!isQuickViewOpen || !product) return null;

  const currentMainImage = selectedImage || product.gallery?.[0] || product.image;
  const currentSize = selectedSize || product.sizes?.[0] || "Standard";
  const currentColor = selectedColor || product.colors?.[0]?.name || "Standard";
  const isWishlisted = wishlistItems.some((item) => item.id === product.id);

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        product,
        quantity,
        size: currentSize,
        color: currentColor,
      })
    );
    dispatch(
      showToast({
        message: `Added ${quantity}x ${product.name} (${currentSize}, ${currentColor}) to cart!`,
        type: "success",
      })
    );
    dispatch(closeQuickView());
  };

  const handleBuyNow = () => {
    dispatch(
      addToCart({
        product,
        quantity,
        size: currentSize,
        color: currentColor,
      })
    );
    dispatch(closeQuickView());
    dispatch(openCheckoutModal());
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewName.trim() || !newReviewComment.trim()) return;
    setReviewsList([
      {
        name: newReviewName.trim(),
        rating: newReviewRating,
        comment: newReviewComment.trim(),
        date: "Just now"
      },
      ...reviewsList
    ]);
    setNewReviewName("");
    setNewReviewComment("");
    dispatch(showToast({ message: "Thank you! Your review has been submitted.", type: "success" }));
  };

  const relatedProducts = products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[90vh] flex flex-col">
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-slate-100 bg-slate-50/50">
          <div className="text-xs text-slate-500 font-medium">
            <span>Home</span> <span className="mx-1">/</span>
            <span className="text-slate-700 font-semibold">{product.category}</span> <span className="mx-1">/</span>
            <span className="text-emerald-700 font-bold truncate max-w-[200px] inline-block align-bottom">{product.name}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                dispatch(toggleWishlist(product));
                dispatch(showToast({ message: isWishlisted ? "Removed from Wishlist" : "Added to Wishlist", type: "info" }));
              }}
              className={`p-2 rounded-xl transition-colors ${
                isWishlisted ? "bg-rose-50 text-rose-600" : "bg-slate-100 text-slate-600 hover:text-rose-600"
              }`}
              title="Wishlist"
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? "fill-rose-500 text-rose-500" : ""}`} />
            </button>
            <button
              onClick={() => dispatch(closeQuickView())}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="overflow-y-auto p-6 space-y-8 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Gallery Column */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative aspect-square rounded-2xl bg-slate-100 overflow-hidden border border-slate-200 shadow-xs">
                <img
                  src={currentMainImage}
                  alt={product.name}
                  className="w-full h-full object-cover object-center"
                />
                {product.badge && (
                  <span className="absolute top-3 left-3 bg-rose-500 text-white text-xs font-black px-2.5 py-1 rounded-lg uppercase shadow-xs">
                    {product.badge}
                  </span>
                )}
              </div>

              {/* Thumbnails */}
              {product.gallery && product.gallery.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-1">
                  {product.gallery.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(img)}
                      className={`w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                        currentMainImage === img
                          ? "border-emerald-600 shadow-md ring-2 ring-emerald-500/20"
                          : "border-slate-200 opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details Column */}
            <div className="space-y-5 flex flex-col justify-between">
              <div>
                <span className="inline-block bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded uppercase tracking-wider mb-2">
                  {product.category}
                </span>

                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug">
                  {product.name}
                </h1>

                {/* Rating & Stock */}
                <div className="flex items-center gap-4 mt-2 text-xs">
                  <div className="flex items-center gap-1 text-amber-500 font-bold">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < Math.floor(product.rating)
                              ? "fill-amber-400 text-amber-400"
                              : "text-slate-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-slate-800 ml-1">{product.rating}</span>
                    <span className="text-slate-400 font-normal">
                      ({product.reviewsCount} reviews)
                    </span>
                  </div>

                  <span className="text-slate-300">|</span>

                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    In Stock ({product.stock} units left)
                  </span>
                </div>

                {/* Price Display in ৳ */}
                <div className="mt-4 p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider">
                      Special Offer Price
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl sm:text-3xl font-black text-emerald-950">
                        ৳{product.price.toLocaleString()}
                      </span>
                      {product.originalPrice > product.price && (
                        <span className="text-sm text-slate-400 line-through">
                          ৳{product.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>

                  {product.discountPercent > 0 && (
                    <div className="bg-rose-500 text-white text-xs font-black px-3 py-1.5 rounded-xl shadow-xs text-center">
                      SAVE ৳{(product.originalPrice - product.price).toLocaleString()}
                      <div className="text-[10px] font-bold text-rose-100">
                        ({product.discountPercent}% OFF)
                      </div>
                    </div>
                  )}
                </div>

                {/* Short Description */}
                <p className="text-xs text-slate-600 mt-4 leading-relaxed">
                  {product.description}
                </p>

                {/* Size Selector */}
                {product.sizes && product.sizes.length > 0 && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                        Select Size: <span className="text-emerald-700">{currentSize}</span>
                      </span>
                      <span className="text-[11px] text-slate-500 hover:underline cursor-pointer">
                        Size Guide
                      </span>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {product.sizes.map((sz) => (
                        <button
                          key={sz}
                          onClick={() => setSelectedSize(sz)}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                            currentSize === sz
                              ? "bg-slate-900 text-white shadow-md shadow-slate-900/20"
                              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                          }`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Color Selector */}
                {product.colors && product.colors.length > 0 && (
                  <div className="mt-4">
                    <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider block mb-2">
                      Select Color: <span className="text-emerald-700">{currentColor}</span>
                    </span>
                    <div className="flex items-center gap-2">
                      {product.colors.map((c) => (
                        <button
                          key={c.name}
                          onClick={() => setSelectedColor(c.name)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                            currentColor === c.name
                              ? "border-emerald-600 bg-emerald-50 text-emerald-950 font-bold"
                              : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                          }`}
                        >
                          <span
                            className="w-3 h-3 rounded-full border border-slate-300"
                            style={{ backgroundColor: c.hex }}
                          />
                          <span>{c.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity Selector & Total */}
                <div className="mt-5 flex items-center gap-4">
                  <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-8 h-8 rounded-lg bg-white text-slate-700 hover:bg-slate-200 flex items-center justify-center font-bold transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-4 text-sm font-extrabold text-slate-900">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                      className="w-8 h-8 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 flex items-center justify-center font-bold transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-xs">
                    <div className="text-slate-400">Total Price:</div>
                    <div className="text-base font-extrabold text-emerald-800">
                      ৳{(product.price * quantity).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action CTA Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100">
                <button
                  onClick={handleAddToCart}
                  className="bg-white border-2 border-emerald-600 text-emerald-700 hover:bg-emerald-50 font-bold text-xs sm:text-sm py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>

                <button
                  onClick={handleBuyNow}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm py-3 px-4 rounded-xl transition-all shadow-md shadow-emerald-600/25 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Zap className="w-4 h-4 fill-white" />
                  <span>Buy Now</span>
                </button>
              </div>

              {/* Delivery Info Box */}
              <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200 text-xs space-y-1.5">
                <div className="flex items-center gap-2 text-slate-700">
                  <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    <strong>Inside Dhaka:</strong> ৳60 (1-2 days) | <strong>Outside Dhaka:</strong> ৳120 (2-4 days)
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Cash on delivery & instant order SMS notification available</span>
                </div>
              </div>
            </div>
          </div>

          {/* Description & Reviews Tabs */}
          <div className="border-t border-slate-200 pt-6">
            <div className="flex items-center gap-4 border-b border-slate-200 pb-2">
              <button
                onClick={() => setActiveTab("desc")}
                className={`text-xs font-extrabold pb-2 border-b-2 transition-all ${
                  activeTab === "desc"
                    ? "border-emerald-600 text-emerald-800"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                Product Details & Fabric
              </button>
              <button
                onClick={() => setActiveTab("specs")}
                className={`text-xs font-extrabold pb-2 border-b-2 transition-all ${
                  activeTab === "specs"
                    ? "border-emerald-600 text-emerald-800"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                Delivery & Returns
              </button>
              <button
                onClick={() => setActiveTab("reviews")}
                className={`text-xs font-extrabold pb-2 border-b-2 transition-all ${
                  activeTab === "reviews"
                    ? "border-emerald-600 text-emerald-800"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                Customer Reviews ({reviewsList.length})
              </button>
            </div>

            <div className="pt-4 text-xs text-slate-600 leading-relaxed">
              {activeTab === "desc" && (
                <div className="space-y-2">
                  <p>{product.details || product.description}</p>
                  <p>
                    <strong>Care Instructions:</strong> Machine wash cold with similar colors. Do not bleach. Tumble dry low or air dry in shade.
                  </p>
                </div>
              )}

              {activeTab === "specs" && (
                <div className="space-y-2">
                  <p>
                    <strong>Delivery Timeline:</strong> Inside Dhaka city orders arrive within 24 to 48 hours. Orders to Chittagong, Sylhet, Rajshahi, Khulna, and other districts arrive within 2 to 4 business days via courier.
                  </p>
                  <p>
                    <strong>Easy 7-Day Returns:</strong> If there is any sizing or defect issue, contact our hotline at 01711254089 / 01911970994 for immediate replacement.
                  </p>
                </div>
              )}

              {activeTab === "reviews" && (
                <div className="space-y-4">
                  {/* Reviews List */}
                  <div className="space-y-3">
                    {reviewsList.map((rev, i) => (
                      <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-slate-800">{rev.name}</span>
                          <span className="text-[10px] text-slate-400">{rev.date}</span>
                        </div>
                        <div className="flex text-amber-400 mb-1">
                          {[...Array(rev.rating)].map((_, idx) => (
                            <Star key={idx} className="w-3 h-3 fill-amber-400" />
                          ))}
                        </div>
                        <p className="text-slate-600">{rev.comment}</p>
                      </div>
                    ))}
                  </div>

                  {/* Add Review Form */}
                  <form onSubmit={handleAddReview} className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3 mt-4">
                    <h4 className="font-bold text-slate-900 text-xs">Write a Review</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Your Name"
                        value={newReviewName}
                        onChange={(e) => setNewReviewName(e.target.value)}
                        className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs outline-none focus:bg-white"
                        required
                      />
                      <select
                        value={newReviewRating}
                        onChange={(e) => setNewReviewRating(Number(e.target.value))}
                        className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs outline-none"
                      >
                        <option value={5}>5 Stars - Excellent</option>
                        <option value={4}>4 Stars - Very Good</option>
                        <option value={3}>3 Stars - Good</option>
                      </select>
                    </div>
                    <textarea
                      placeholder="Share your experience with this item..."
                      value={newReviewComment}
                      onChange={(e) => setNewReviewComment(e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs outline-none focus:bg-white resize-none"
                      required
                    />
                    <button
                      type="submit"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl"
                    >
                      Submit Review
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
