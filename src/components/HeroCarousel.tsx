import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles, ShieldCheck, Truck, RefreshCw } from "lucide-react";
import { useAppDispatch } from "../store";
import { setSelectedCategory, setCurrentView } from "../store/slices/productSlice";

export const HeroCarousel: React.FC = () => {
  const dispatch = useAppDispatch();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      tag: "NEW SEASON 2026",
      title: "Discover Premium Lifestyle & Fashion",
      subtitle: "Handpicked Bangladeshi traditional sarees, western blazers, genuine leather wear & casual streetwear.",
      cta: "Explore Collection",
      category: "Women",
      image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1400&auto=format&fit=crop&q=80",
      color: "from-slate-950/80 via-slate-900/60 to-transparent",
      discount: "UP TO 19% OFF"
    },
    {
      id: 2,
      tag: "HOT SUMMER COLLECTION",
      title: "Trendy Men's Casuals & Denim Jeans",
      subtitle: "100% Breathable Combed Cotton Tees, Slim Denim, & Italian Cut Leather Jackets for everyday elegance.",
      cta: "Shop Men's Wear",
      category: "Men",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1400&auto=format&fit=crop&q=80",
      color: "from-emerald-950/85 via-slate-900/60 to-transparent",
      discount: "BEST SELLER"
    },
    {
      id: 3,
      tag: "ACCESSORIES & FOOTWEAR",
      title: "Urban Streetwear Sneakers & Sunglasses",
      subtitle: "UV400 Polarized Shades, Cushioned Walking Sneakers & Quilted Crossbody Handbags delivered to your doorstep.",
      cta: "Shop Footwear",
      category: "Footwear",
      image: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=1400&auto=format&fit=crop&q=80",
      color: "from-slate-950/80 via-purple-950/60 to-transparent",
      discount: "LIMITED STOCK"
    }
  ];

  const sideAds = [
    {
      id: "ad-1",
      badge: "AD",
      title: "Kids Graphic Tees & Hoodies",
      subtitle: "Comfortable organic cotton wear for all ages.",
      category: "Kids",
      image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&auto=format&fit=crop&q=80",
      discount: "FROM ৳990",
      color: "bg-gradient-to-r from-amber-600 to-orange-500"
    },
    {
      id: "ad-2",
      badge: "AD",
      title: "Luxury Leather Bags & Shades",
      subtitle: "Premium quilted finishes with gold accessories.",
      category: "Accessories",
      image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&auto=format&fit=crop&q=80",
      discount: "18% OFF",
      color: "bg-gradient-to-r from-purple-700 to-indigo-600"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handleCtaClick = (cat: string) => {
    dispatch(setSelectedCategory(cat));
    dispatch(setCurrentView("shop"));
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main Hero Slider (Takes 2 Columns on LG) */}
        <div className="lg:col-span-2 relative rounded-2xl overflow-hidden shadow-lg h-[340px] sm:h-[400px] group bg-slate-900">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              {/* Background Image */}
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover object-center transform scale-100 group-hover:scale-105 transition-transform duration-1000"
              />

              {/* Gradient Dark Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-r ${slide.color} p-6 sm:p-10 flex flex-col justify-between`}>
                {/* Top Badge */}
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 bg-emerald-500 text-white text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-xs">
                    <Sparkles className="w-3 h-3" />
                    {slide.tag}
                  </span>
                  <span className="bg-white/20 backdrop-blur-md text-white text-xs font-bold px-2.5 py-1 rounded-full">
                    {slide.discount}
                  </span>
                </div>

                {/* Content */}
                <div className="max-w-md space-y-2.5">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight tracking-tight drop-shadow-xs">
                    {slide.title}
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-200 line-clamp-2 drop-shadow-xs">
                    {slide.subtitle}
                  </p>
                  <div className="pt-2">
                    <button
                      onClick={() => handleCtaClick(slide.category)}
                      className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-lg transition-all hover:gap-3 cursor-pointer"
                    >
                      <span>{slide.cta}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Slide Count Indicator Matching Screenshots: e.g. 2 / 3 */}
                <div className="flex items-center justify-between pt-2">
                  <div className="bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-bold border border-white/10">
                    {currentSlide + 1} / {slides.length}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Navigation Arrows */}
          <button
            onClick={() => setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-slate-900 flex items-center justify-center shadow-md transition-all opacity-0 group-hover:opacity-100"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-slate-900 flex items-center justify-center shadow-md transition-all opacity-0 group-hover:opacity-100"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Right Column Stacked AD Slots (Exact match with user screenshots) */}
        <div className="flex flex-col gap-4 justify-between h-full">
          {sideAds.map((ad) => (
            <div
              key={ad.id}
              onClick={() => handleCtaClick(ad.category)}
              className="relative rounded-2xl overflow-hidden shadow-md h-[162px] sm:h-[192px] group cursor-pointer border border-slate-200"
            >
              <img
                src={ad.image}
                alt={ad.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-900/50 to-transparent p-4 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="bg-amber-500 text-slate-950 text-[10px] font-extrabold px-2 py-0.5 rounded shadow-xs">
                    {ad.badge}
                  </span>
                  <span className="text-white text-[10px] font-extrabold bg-white/20 px-2 py-0.5 rounded-full">
                    {ad.discount}
                  </span>
                </div>

                <div>
                  <h3 className="text-white font-bold text-sm sm:text-base leading-snug group-hover:text-emerald-400 transition-colors">
                    {ad.title}
                  </h3>
                  <p className="text-slate-300 text-[11px] line-clamp-1 mt-0.5">
                    {ad.subtitle}
                  </p>
                  <span className="inline-flex items-center gap-1 text-emerald-400 text-xs font-bold mt-1.5 group-hover:underline">
                    Shop Now →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Value Proposition Micro Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs text-xs">
        <div className="flex items-center gap-2.5 px-3 py-1.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Truck className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-slate-800">Nationwide Delivery</div>
            <div className="text-[11px] text-slate-500">Inside Dhaka ৳60 / Outside ৳120</div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 px-3 py-1.5">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-slate-800">100% Authentic</div>
            <div className="text-[11px] text-slate-500">Directly sourced quality</div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 px-3 py-1.5">
          <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <RefreshCw className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-slate-800">7 Days Easy Return</div>
            <div className="text-[11px] text-slate-500">Hassle-free replacement</div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 px-3 py-1.5">
          <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-slate-800">AI Stylist & Chef</div>
            <div className="text-[11px] text-slate-500">Instant AI styling advice</div>
          </div>
        </div>
      </div>
    </section>
  );
};
