import React, { useState } from "react";
import {
  Menu,
  ChevronDown,
  Flame,
  Sparkles,
  Truck,
  Shirt,
  Sparkle,
  Footprints,
  Watch,
  Baby,
  Layers
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../store";
import {
  setSelectedCategory,
  setCurrentView,
  setActiveRecommendedTab
} from "../store/slices/productSlice";
import { toggleAiChat } from "../store/slices/uiSlice";

export const Navbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const { selectedCategory, currentView } = useAppSelector((state) => state.products);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);

  const categories = [
    { name: "Men", icon: Shirt },
    { name: "Women", icon: Sparkle },
    { name: "Kids", icon: Baby },
    { name: "Footwear", icon: Footprints },
    { name: "Accessories", icon: Watch },
  ];

  const handleCategoryClick = (cat: string) => {
    dispatch(setSelectedCategory(cat));
    dispatch(setCurrentView("shop"));
    setIsCategoryMenuOpen(false);
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-[69px] sm:top-[69px] z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-11 text-xs">
          {/* Left All Categories Button */}
          <div className="relative">
            <button
              onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-lg transition-colors cursor-pointer"
            >
              <Menu className="w-4 h-4" />
              <span>All Categories</span>
              <ChevronDown className="w-3.5 h-3.5 ml-1" />
            </button>

            {isCategoryMenuOpen && (
              <div className="absolute left-0 mt-1.5 w-60 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in">
                <button
                  onClick={() => handleCategoryClick("All")}
                  className="w-full text-left px-4 py-2.5 hover:bg-slate-50 flex items-center justify-between text-slate-800 font-semibold"
                >
                  <span className="flex items-center gap-2.5">
                    <Layers className="w-4 h-4 text-emerald-600" />
                    All Products
                  </span>
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                    12+
                  </span>
                </button>
                <div className="border-t border-slate-100 my-1"></div>
                {categories.map((c) => {
                  const Icon = c.icon;
                  return (
                    <button
                      key={c.name}
                      onClick={() => handleCategoryClick(c.name)}
                      className="w-full text-left px-4 py-2.5 hover:bg-emerald-50 hover:text-emerald-700 flex items-center justify-between text-slate-700 font-medium transition-colors"
                    >
                      <span className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 text-slate-500" />
                        {c.name} Collection
                      </span>
                      <span className="text-slate-400">→</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Center Category Links */}
          <div className="hidden lg:flex items-center space-x-1">
            <button
              onClick={() => {
                dispatch(setSelectedCategory("All"));
                dispatch(setCurrentView("home"));
              }}
              className={`px-3 py-1.5 font-bold rounded-lg transition-colors ${
                currentView === "home" && selectedCategory === "All"
                  ? "text-emerald-700 bg-emerald-50"
                  : "text-slate-700 hover:text-emerald-600 hover:bg-slate-50"
              }`}
            >
              Home
            </button>

            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => handleCategoryClick(cat.name)}
                className={`px-3 py-1.5 font-semibold rounded-lg transition-colors ${
                  selectedCategory === cat.name && currentView === "shop"
                    ? "text-emerald-700 bg-emerald-50 font-bold"
                    : "text-slate-700 hover:text-emerald-600 hover:bg-slate-50"
                }`}
              >
                {cat.name}
              </button>
            ))}

            <button
              onClick={() => {
                dispatch(setSelectedCategory("All"));
                dispatch(setActiveRecommendedTab("featured"));
                dispatch(setCurrentView("shop"));
              }}
              className="px-3 py-1.5 font-semibold text-rose-600 hover:bg-rose-50 rounded-lg flex items-center gap-1"
            >
              <Flame className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
              <span>Deals & Offers</span>
              <span className="bg-rose-100 text-rose-700 font-extrabold text-[9px] px-1.5 py-0.5 rounded-full uppercase">
                Up to 19%
              </span>
            </button>
          </div>

          {/* Right Action Shortcuts */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => dispatch(toggleAiChat())}
              className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold px-3 py-1.5 rounded-lg shadow-xs hover:opacity-95 transition-all text-xs"
            >
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>AI Assistant</span>
            </button>

            <button
              onClick={() => dispatch(setCurrentView("track"))}
              className="hidden sm:flex items-center gap-1 text-slate-600 hover:text-emerald-600 font-semibold px-2 py-1.5"
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Track Order</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
