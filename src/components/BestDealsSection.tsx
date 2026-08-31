import React from "react";
import { Flame, ArrowRight, Tag } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../store";
import { setSelectedCategory, setCurrentView } from "../store/slices/productSlice";
import { ProductCard } from "./ProductCard";

export const BestDealsSection: React.FC = () => {
  const dispatch = useAppDispatch();
  const products = useAppSelector((state) => state.products.products);

  const dealProducts = products
    .filter((p) => p.isBestDeal || p.discountPercent >= 15)
    .slice(0, 3);

  const handleBannerClick = () => {
    dispatch(setSelectedCategory("All"));
    dispatch(setCurrentView("shop"));
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-rose-500 text-white flex items-center justify-center shadow-md shadow-rose-500/20">
            <Flame className="w-4 h-4 fill-white" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Best Deals of the Week
            </h2>
            <p className="text-xs text-slate-500">
              Save big on premium sunglasses, denim, tees & designer sarees
            </p>
          </div>
        </div>

        <button
          onClick={handleBannerClick}
          className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 hover:underline"
        >
          <span>View All Deals</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Left Side Promotional Card matching Screenshot */}
        <div
          onClick={handleBannerClick}
          className="relative rounded-2xl overflow-hidden shadow-md group cursor-pointer border border-rose-200 bg-gradient-to-br from-rose-950 via-slate-900 to-rose-900 min-h-[300px] lg:min-h-full flex flex-col justify-between p-6"
        >
          <img
            src="https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80"
            alt="Best Deals Banner"
            className="absolute inset-0 w-full h-full object-cover opacity-35 group-hover:scale-105 transition-transform duration-700"
          />

          <div className="relative z-10 space-y-2">
            <span className="inline-flex items-center gap-1 bg-rose-500 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-xs">
              <Tag className="w-3 h-3" />
              HOT SPECIAL
            </span>
            <h3 className="text-2xl font-extrabold text-white leading-tight">
              Up to 19% OFF
            </h3>
            <p className="text-xs text-slate-200">
              On selected summer & lifestyle items. Don't miss our lowest prices!
            </p>
          </div>

          <div className="relative z-10 pt-4">
            <button className="bg-white text-slate-900 hover:bg-rose-50 font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 group-hover:gap-3 transition-all">
              <span>Shop Now</span>
              <ArrowRight className="w-4 h-4 text-rose-600" />
            </button>
          </div>
        </div>

        {/* Right Side Deal Products Grid */}
        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {dealProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};
