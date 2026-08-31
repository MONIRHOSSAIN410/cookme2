import React, { useState, useEffect } from "react";
import { Zap, Clock, ArrowRight } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../store";
import { setSelectedCategory, setCurrentView } from "../store/slices/productSlice";
import { ProductCard } from "./ProductCard";

export const FlashSalesSection: React.FC = () => {
  const dispatch = useAppDispatch();
  const products = useAppSelector((state) => state.products.products);

  // Live Countdown Timer (11 hrs 53 mins 16 secs from screenshot)
  const [timeLeft, setTimeLeft] = useState({
    hours: 11,
    minutes: 53,
    seconds: 16,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const flashProducts = products.filter((p) => p.isFlashSale || p.badge === "OFFER").slice(0, 4);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-emerald-500/10 border border-amber-200 rounded-3xl p-6 sm:p-8">
        {/* Flash Sales Header & Live Timer */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-amber-200/60 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/30">
              <Zap className="w-5 h-5 fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  Flash Sales
                </h2>
                <span className="bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                  Live
                </span>
              </div>
              <p className="text-xs text-slate-600">
                Limited time flash discounts. Grab them before timer runs out!
              </p>
            </div>
          </div>

          {/* Countdown Clock matching screenshot */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            <div className="flex items-center gap-1 text-xs font-bold text-slate-700 mr-2">
              <Clock className="w-4 h-4 text-amber-600 animate-spin" style={{ animationDuration: '6s' }} />
              <span>Ends in:</span>
            </div>
            <div className="flex items-center gap-1.5 font-mono">
              <div className="bg-slate-900 text-white font-extrabold text-sm px-2.5 py-1.5 rounded-xl shadow-xs">
                {String(timeLeft.hours).padStart(2, "0")}
                <span className="text-[9px] text-slate-400 font-sans ml-0.5">h</span>
              </div>
              <span className="font-extrabold text-slate-700">:</span>
              <div className="bg-slate-900 text-white font-extrabold text-sm px-2.5 py-1.5 rounded-xl shadow-xs">
                {String(timeLeft.minutes).padStart(2, "0")}
                <span className="text-[9px] text-slate-400 font-sans ml-0.5">m</span>
              </div>
              <span className="font-extrabold text-slate-700">:</span>
              <div className="bg-rose-600 text-white font-extrabold text-sm px-2.5 py-1.5 rounded-xl shadow-xs">
                {String(timeLeft.seconds).padStart(2, "0")}
                <span className="text-[9px] text-rose-200 font-sans ml-0.5">s</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Carousel / Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {flashProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};
