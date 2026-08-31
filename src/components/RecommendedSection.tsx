import React from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../store";
import {
  setActiveRecommendedTab,
  setCurrentView,
} from "../store/slices/productSlice";
import { ProductCard } from "./ProductCard";

export const RecommendedSection: React.FC = () => {
  const dispatch = useAppDispatch();
  const { products, activeRecommendedTab } = useAppSelector((state) => state.products);

  const tabs: { id: 'featured' | 'newArrivals' | 'topRated' | 'bestSeller'; label: string }[] = [
    { id: "featured", label: "Featured" },
    { id: "newArrivals", label: "New Arrivals" },
    { id: "topRated", label: "Top Rated" },
    { id: "bestSeller", label: "Best Seller" },
  ];

  const filteredProducts = products.filter((p) => {
    switch (activeRecommendedTab) {
      case "featured":
        return p.isFeatured || p.rating >= 4.7;
      case "newArrivals":
        return p.isNewArrival || p.badge === "NEW" || p.price > 2000;
      case "topRated":
        return p.isTopRated || p.rating >= 4.8;
      case "bestSeller":
        return p.isBestSeller || p.reviewsCount > 30;
      default:
        return true;
    }
  });

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4 mb-6">
        <div>
          <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-extrabold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Selection</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Recommended For You
          </h2>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center flex-wrap gap-1.5">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => dispatch(setActiveRecommendedTab(tab.id))}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeRecommendedTab === tab.id
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}

          <button
            onClick={() => dispatch(setCurrentView("shop"))}
            className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 ml-2 hover:underline"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {filteredProducts.slice(0, 8).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};
