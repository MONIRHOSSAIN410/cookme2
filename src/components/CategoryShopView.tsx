import React from "react";
import {
  SlidersHorizontal,
  RotateCcw,
  Star,
  Check,
  Search,
  ChevronDown,
  ShoppingBag
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../store";
import {
  setSelectedCategory,
  setSearchQuery,
  setSortOption,
  setPriceRange,
  setMinRating,
  resetFilters,
} from "../store/slices/productSlice";
import { ProductCard } from "./ProductCard";

export const CategoryShopView: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    products,
    selectedCategory,
    searchQuery,
    sortOption,
    priceRange,
    minRating,
  } = useAppSelector((state) => state.products);

  const categories = ["All", "Men", "Women", "Kids", "Footwear", "Accessories"];

  // Filter products based on state
  const filteredProducts = products.filter((product) => {
    // Category filter
    if (selectedCategory !== "All" && product.category.toLowerCase() !== selectedCategory.toLowerCase()) {
      return false;
    }
    // Search query
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      const match =
        product.name.toLowerCase().includes(q) ||
        product.category.toLowerCase().includes(q) ||
        product.description.toLowerCase().includes(q) ||
        product.tags?.some((t) => t.toLowerCase().includes(q));
      if (!match) return false;
    }
    // Price range
    if (product.price < priceRange[0] || product.price > priceRange[1]) {
      return false;
    }
    // Rating
    if (minRating > 0 && product.rating < minRating) {
      return false;
    }
    return true;
  });

  // Sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortOption) {
      case "Price: Low -> High":
        return a.price - b.price;
      case "Price: High -> Low":
        return b.price - a.price;
      case "Highest Rated":
        return b.rating - a.rating;
      case "Offers First":
        return b.discountPercent - a.discountPercent;
      case "Name: A-Z":
        return a.name.localeCompare(b.name);
      case "Newest":
        return (b.badge === "NEW" ? 1 : 0) - (a.badge === "NEW" ? 1 : 0);
      default:
        return 0;
    }
  });

  const getCategoryCount = (cat: string) => {
    if (cat === "All") return products.length;
    return products.filter((p) => p.category.toLowerCase() === cat.toLowerCase()).length;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb / Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="text-xs text-slate-500 mb-1">
            <span>Home</span> <span className="mx-1">/</span>
            <span className="text-emerald-700 font-semibold">{selectedCategory === "All" ? "All Products" : `${selectedCategory} Collection`}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {selectedCategory === "All" ? "All Products & Collections" : `${selectedCategory} Collection`}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Showing <span className="font-bold text-slate-800">{sortedProducts.length}</span> items
            {searchQuery && <span> for "<span className="text-emerald-600 font-bold">{searchQuery}</span>"</span>}
          </p>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold text-slate-500 shrink-0">Sort By:</label>
          <div className="relative">
            <select
              value={sortOption}
              onChange={(e) => dispatch(setSortOption(e.target.value))}
              className="appearance-none bg-white border border-slate-200 rounded-xl px-4 py-2 pr-9 text-xs font-bold text-slate-800 shadow-xs outline-none focus:ring-2 focus:ring-emerald-500/20 cursor-pointer"
            >
              <option value="Default">Default</option>
              <option value="Offers First">Offers First (% Off)</option>
              <option value="Price: Low -> High">Price: Low to High</option>
              <option value="Price: High -> Low">Price: High to Low</option>
              <option value="Highest Rated">Highest Rated</option>
              <option value="Name: A-Z">Name: A to Z</option>
              <option value="Newest">Newest First</option>
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar Filter Column */}
        <aside className="space-y-6">
          {/* Filter Container */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm">
                <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
                <span>Filters</span>
              </div>
              <button
                onClick={() => dispatch(resetFilters())}
                className="text-[11px] text-slate-500 hover:text-rose-600 font-semibold flex items-center gap-1 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            </div>

            {/* Categories Filter */}
            <div>
              <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-3">
                Categories
              </h3>
              <div className="space-y-1.5">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => dispatch(setSelectedCategory(cat))}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors text-left ${
                      selectedCategory.toLowerCase() === cat.toLowerCase()
                        ? "bg-emerald-50 text-emerald-800 font-extrabold"
                        : "text-slate-700 hover:bg-slate-50 font-medium"
                    }`}
                  >
                    <span>{cat}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold">
                      {getCategoryCount(cat)}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range Slider */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                  Price Range
                </h3>
                <span className="text-xs font-extrabold text-emerald-700">
                  ৳{priceRange[0]} - ৳{priceRange[1]}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="6000"
                step="100"
                value={priceRange[1]}
                onChange={(e) => dispatch(setPriceRange([priceRange[0], Number(e.target.value)]))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-medium mt-1">
                <span>৳0</span>
                <span>৳3,000</span>
                <span>৳6,000+</span>
              </div>
            </div>

            {/* Minimum Rating Filter */}
            <div>
              <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-2">
                Customer Rating
              </h3>
              <div className="space-y-1.5">
                {[
                  { rating: 0, label: "All Ratings" },
                  { rating: 4.8, label: "4.8★ & above (Top Rated)" },
                  { rating: 4.5, label: "4.5★ & above" },
                  { rating: 4.0, label: "4.0★ & above" },
                ].map((r) => (
                  <button
                    key={r.rating}
                    onClick={() => dispatch(setMinRating(r.rating))}
                    className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs transition-colors text-left ${
                      minRating === r.rating
                        ? "bg-emerald-50 text-emerald-800 font-bold"
                        : "text-slate-600 hover:bg-slate-50 font-medium"
                    }`}
                  >
                    <Star className={`w-3.5 h-3.5 ${minRating === r.rating ? "fill-amber-400 text-amber-400" : "text-slate-400"}`} />
                    <span>{r.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Right Product Grid */}
        <main className="lg:col-span-3">
          {sortedProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mb-4">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">
                No products found matching your criteria
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mb-5">
                Try loosening your filters, changing price range, or searching for other lifestyle keywords.
              </p>
              <button
                onClick={() => dispatch(resetFilters())}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
