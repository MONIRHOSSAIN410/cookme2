import React from "react";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { useAppDispatch } from "../store";
import { setSelectedCategory, setCurrentView } from "../store/slices/productSlice";

interface CategoryItem {
  name: string;
  count: number;
  badgeBg: string;
  image: string;
}

export const FeaturedCategories: React.FC = () => {
  const dispatch = useAppDispatch();

  const categories: CategoryItem[] = [
    {
      name: "Footwear",
      count: 1,
      badgeBg: "bg-amber-500",
      image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&auto=format&fit=crop&q=80"
    },
    {
      name: "Accessories",
      count: 2,
      badgeBg: "bg-purple-600",
      image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&auto=format&fit=crop&q=80"
    },
    {
      name: "Men",
      count: 4,
      badgeBg: "bg-slate-800",
      image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=400&auto=format&fit=crop&q=80"
    },
    {
      name: "Women",
      count: 3,
      badgeBg: "bg-rose-500",
      image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&auto=format&fit=crop&q=80"
    },
    {
      name: "Kids",
      count: 2,
      badgeBg: "bg-cyan-500",
      image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=400&auto=format&fit=crop&q=80"
    }
  ];

  const handleCategoryClick = (catName: string) => {
    dispatch(setSelectedCategory(catName));
    dispatch(setCurrentView("shop"));
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
            Featured Categories
          </h2>
          <p className="text-xs text-slate-500">
            Browse our top apparel, footwear & lifestyle collections
          </p>
        </div>
        <button
          onClick={() => {
            dispatch(setSelectedCategory("All"));
            dispatch(setCurrentView("shop"));
          }}
          className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 hover:underline cursor-pointer"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
        {categories.map((cat) => (
          <div
            key={cat.name}
            onClick={() => handleCategoryClick(cat.name)}
            className="group bg-white rounded-2xl p-3.5 border border-slate-200 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer flex flex-col items-center text-center relative overflow-hidden"
          >
            {/* Category Image / Bag Icon */}
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden mb-3 bg-slate-100 flex items-center justify-center group-hover:scale-105 transition-transform">
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover"
              />
              <div className={`absolute -top-1 -right-1 w-6 h-6 rounded-lg ${cat.badgeBg} text-white flex items-center justify-center shadow-xs`}>
                <ShoppingBag className="w-3 h-3" />
              </div>
            </div>

            {/* Category Info */}
            <h3 className="font-bold text-slate-900 text-sm group-hover:text-emerald-600 transition-colors">
              {cat.name}
            </h3>
            <span className="text-[11px] text-slate-400 font-medium mt-0.5">
              {cat.count} items
            </span>

            <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1 mt-2 group-hover:translate-x-0.5 transition-transform">
              <span>Shop now</span>
              <span>→</span>
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};
