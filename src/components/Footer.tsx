import React from "react";
import {
  ShoppingBag,
  Phone,
  Mail,
  MapPin,
  MessageSquare,
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  ExternalLink
} from "lucide-react";
import { useAppDispatch } from "../store";
import { setSelectedCategory, setCurrentView } from "../store/slices/productSlice";

export const Footer: React.FC = () => {
  const dispatch = useAppDispatch();

  const handleNav = (cat: string) => {
    dispatch(setSelectedCategory(cat));
    dispatch(setCurrentView("shop"));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-slate-950 text-slate-300 pt-12 pb-8 border-t border-slate-800">
      {/* Top Value Propositions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-slate-800/80">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Super Fast Delivery</div>
              <div className="text-[11px] text-slate-400">24-48h in Dhaka, 2-4d All Bangladesh</div>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">100% Genuine Quality</div>
              <div className="text-[11px] text-slate-400">Authentic materials & premium fabrics</div>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">7 Days Easy Return</div>
              <div className="text-[11px] text-slate-400">Hassle-free exchange policy</div>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">24/7 Hotline & SMS</div>
              <div className="text-[11px] text-slate-400">01711254089, 01911970994</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                Cook<span className="text-emerald-500">Me</span>
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              CookMe is your premier fashion, footwear & lifestyle shopping destination in Bangladesh. Experience smooth browsing, verified quality, instant SMS notifications, and fast nationwide delivery.
            </p>

            {/* Hotlines Banner */}
            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" />
                <span>Customer Care & Order Hotlines:</span>
              </div>
              <div className="flex flex-wrap gap-2 text-xs font-mono font-bold text-white">
                <a
                  href="tel:01711254089"
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-emerald-600 transition-colors flex items-center gap-1"
                >
                  <Phone className="w-3 h-3 text-emerald-400" />
                  01711254089
                </a>
                <a
                  href="tel:01911970994"
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-emerald-600 transition-colors flex items-center gap-1"
                >
                  <Phone className="w-3 h-3 text-emerald-400" />
                  01911970994
                </a>
              </div>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 className="text-xs font-extrabold text-white uppercase tracking-wider mb-4">
              Categories
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => handleNav("Men")} className="hover:text-emerald-400 transition-colors">
                  Men's Fashion & Tees
                </button>
              </li>
              <li>
                <button onClick={() => handleNav("Women")} className="hover:text-emerald-400 transition-colors">
                  Women's Dresses & Sarees
                </button>
              </li>
              <li>
                <button onClick={() => handleNav("Footwear")} className="hover:text-emerald-400 transition-colors">
                  Footwear & Sneakers
                </button>
              </li>
              <li>
                <button onClick={() => handleNav("Kids")} className="hover:text-emerald-400 transition-colors">
                  Kids & Toddler Wear
                </button>
              </li>
              <li>
                <button onClick={() => handleNav("Accessories")} className="hover:text-emerald-400 transition-colors">
                  Sunglasses & Bags
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-xs font-extrabold text-white uppercase tracking-wider mb-4">
              Customer Support
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => {
                    dispatch(setCurrentView("track"));
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Track Your Order
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    dispatch(setCurrentView("dashboard"));
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="hover:text-emerald-400 transition-colors"
                >
                  My Account
                </button>
              </li>
              <li>
                <a href="#shipping" className="hover:text-emerald-400 transition-colors">
                  Shipping Rates & Delivery
                </a>
              </li>
              <li>
                <a href="#returns" className="hover:text-emerald-400 transition-colors">
                  Return & Exchange Policy
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-emerald-400 transition-colors">
                  Payment Methods & bKash
                </a>
              </li>
            </ul>
          </div>

          {/* Direct WhatsApp Support */}
          <div>
            <h4 className="text-xs font-extrabold text-white uppercase tracking-wider mb-4">
              WhatsApp Hotlines
            </h4>
            <div className="space-y-2.5">
              <a
                href="https://wa.me/8801711254089"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-2.5 rounded-xl bg-[#25D366]/10 border border-[#25D366]/30 text-white text-xs hover:bg-[#25D366]/20 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[#25D366]" />
                  <span className="font-mono font-bold">01711254089</span>
                </div>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>

              <a
                href="https://wa.me/8801911970994"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-2.5 rounded-xl bg-[#25D366]/10 border border-[#25D366]/30 text-white text-xs hover:bg-[#25D366]/20 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[#25D366]" />
                  <span className="font-mono font-bold">01911970994</span>
                </div>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-slate-900 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          © {new Date().getFullYear()} CookMe Lifestyle & Apparel. All Rights Reserved.
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-semibold text-slate-400">Accepted Payments:</span>
          <span className="bg-slate-900 border border-slate-800 text-slate-300 font-bold px-2 py-0.5 rounded text-[10px]">
            Cash on Delivery
          </span>
          <span className="bg-rose-950/80 border border-rose-800/80 text-rose-300 font-bold px-2 py-0.5 rounded text-[10px]">
            bKash
          </span>
          <span className="bg-amber-950/80 border border-amber-800/80 text-amber-300 font-bold px-2 py-0.5 rounded text-[10px]">
            Nagad
          </span>
          <span className="bg-blue-950/80 border border-blue-800/80 text-blue-300 font-bold px-2 py-0.5 rounded text-[10px]">
            Visa / Master
          </span>
        </div>
      </div>
    </footer>
  );
};
