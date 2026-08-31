import React, { useState } from "react";
import {
  Search,
  ShoppingBag,
  Heart,
  User as UserIcon,
  MapPin,
  ChevronDown,
  Phone,
  Truck,
  Sparkles,
  LogOut,
  Package,
  SlidersHorizontal,
  X
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../store";
import {
  setSelectedCategory,
  setSearchQuery,
  setCurrentView,
} from "../store/slices/productSlice";
import {
  openAuthModal,
  openCartDrawer,
  toggleAiChat,
  showToast
} from "../store/slices/uiSlice";
import { logout } from "../store/slices/authSlice";
import { setDeliveryCity } from "../store/slices/cartSlice";

export const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const { items: cartItems, subtotal, totalItems, deliveryCity } = useAppSelector((state) => state.cart);
  const { items: wishlistItems } = useAppSelector((state) => state.wishlist);
  const { selectedCategory, searchQuery, currentView } = useAppSelector((state) => state.products);

  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setSearchQuery(localSearch));
    dispatch(setCurrentView("shop"));
  };

  const handleCategoryChange = (cat: string) => {
    dispatch(setSelectedCategory(cat));
    dispatch(setCurrentView("shop"));
  };

  const handleLogout = () => {
    dispatch(logout());
    setIsUserMenuOpen(false);
    dispatch(showToast({ message: "Logged out successfully", type: "info" }));
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Top Banner Notice Bar */}
      <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              Special Offer: Free delivery on orders over ৳3,000!
            </span>
            <span className="text-slate-400">|</span>
            <span className="flex items-center gap-1 text-slate-300">
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              Order Helpline: 01711254089, 01911970994
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => dispatch(setCurrentView("track"))}
              className="hover:text-emerald-400 transition-colors flex items-center gap-1"
            >
              <Truck className="w-3.5 h-3.5" />
              Track Order
            </button>
            <span className="text-slate-400">|</span>
            <button
              onClick={() => dispatch(toggleAiChat())}
              className="hover:text-emerald-400 transition-colors flex items-center gap-1 text-emerald-400 font-semibold"
            >
              <Sparkles className="w-3.5 h-3.5" />
              AI Assistant
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-2 sm:gap-6">
          {/* Logo */}
          <div
            onClick={() => {
              dispatch(setSelectedCategory("All"));
              dispatch(setSearchQuery(""));
              dispatch(setCurrentView("home"));
            }}
            className="flex items-center gap-2.5 cursor-pointer group shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 group-hover:bg-emerald-700 transition-all">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-slate-900">
                  Cook<span className="text-emerald-600">Me</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 hidden sm:inline-block">
                  Store
                </span>
              </div>
              <span className="text-[11px] text-slate-500 font-medium -mt-1 hidden sm:block">
                Fashion & Lifestyle
              </span>
            </div>
          </div>

          {/* Search Bar with Category Selector */}
          <form
            onSubmit={handleSearchSubmit}
            className="flex-1 max-w-2xl relative hidden md:flex items-center"
          >
            <div className="flex w-full items-center rounded-xl border-2 border-emerald-600 bg-white overflow-hidden shadow-xs focus-within:ring-2 focus-within:ring-emerald-500/20">
              {/* Category Filter Dropdown inside Search */}
              <div className="relative border-r border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors">
                <select
                  value={selectedCategory}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="bg-transparent text-xs font-semibold text-slate-700 outline-none cursor-pointer pr-4"
                >
                  <option value="All">All Categories</option>
                  <option value="Men">Men</option>
                  <option value="Women">Women</option>
                  <option value="Kids">Kids</option>
                  <option value="Footwear">Footwear</option>
                  <option value="Accessories">Accessories</option>
                </select>
              </div>

              {/* Text Input */}
              <input
                type="text"
                placeholder="Search for products (e.g. t-shirt, saree, sneakers, sunglasses)..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="w-full px-3.5 py-2 text-sm text-slate-800 placeholder-slate-400 outline-none bg-transparent"
              />

              {localSearch && (
                <button
                  type="button"
                  onClick={() => {
                    setLocalSearch("");
                    dispatch(setSearchQuery(""));
                  }}
                  className="p-1 text-slate-400 hover:text-slate-600 mr-1"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              {/* Search Button */}
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 text-sm font-semibold transition-colors flex items-center gap-1.5 shrink-0"
              >
                <Search className="w-4 h-4" />
                <span>Search</span>
              </button>
            </div>
          </form>

          {/* Right Header Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
            {/* Delivery Location Selector */}
            <div className="relative hidden lg:block">
              <button
                onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-medium text-slate-700 transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <div className="text-left leading-tight">
                  <div className="text-[10px] text-slate-500 font-normal">Deliver to</div>
                  <div className="font-semibold text-slate-800">{deliveryCity}</div>
                </div>
                <ChevronDown className="w-3 h-3 text-slate-500 ml-1" />
              </button>

              {isLocationDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-3 py-1 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Select Delivery Zone
                  </div>
                  <button
                    onClick={() => {
                      dispatch(setDeliveryCity("Inside Dhaka"));
                      setIsLocationDropdownOpen(false);
                      dispatch(showToast({ message: "Delivery set to Inside Dhaka (৳60)", type: "info" }));
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-emerald-50 transition-colors ${
                      deliveryCity === "Inside Dhaka" ? "bg-emerald-50 text-emerald-700 font-bold" : "text-slate-700"
                    }`}
                  >
                    <span>Inside Dhaka (1-2 Days)</span>
                    <span className="text-emerald-600 font-bold">৳60</span>
                  </button>
                  <button
                    onClick={() => {
                      dispatch(setDeliveryCity("Outside Dhaka"));
                      setIsLocationDropdownOpen(false);
                      dispatch(showToast({ message: "Delivery set to Outside Dhaka (৳120)", type: "info" }));
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-emerald-50 transition-colors ${
                      deliveryCity === "Outside Dhaka" ? "bg-emerald-50 text-emerald-700 font-bold" : "text-slate-700"
                    }`}
                  >
                    <span>Outside Dhaka (2-4 Days)</span>
                    <span className="text-emerald-600 font-bold">৳120</span>
                  </button>
                </div>
              )}
            </div>

            {/* Wishlist Button */}
            <button
              onClick={() => {
                if (!isAuthenticated) {
                  dispatch(openAuthModal("signin"));
                } else {
                  dispatch(setCurrentView("dashboard"));
                }
              }}
              className="relative p-2 rounded-xl text-slate-700 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white rounded-full text-[10px] font-extrabold flex items-center justify-center animate-pulse">
                  {wishlistItems.length}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={() => dispatch(openCartDrawer())}
              className="flex items-center gap-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 px-3 py-2 rounded-xl transition-all shadow-xs group"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 text-emerald-700 group-hover:scale-110 transition-transform" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-emerald-600 text-white rounded-full w-5 h-5 text-[11px] font-extrabold flex items-center justify-center shadow-xs">
                    {totalItems}
                  </span>
                )}
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-[10px] font-medium text-emerald-700 leading-none">Cart Total</div>
                <div className="text-xs font-extrabold text-emerald-950 leading-tight">
                  ৳{subtotal.toLocaleString()}
                </div>
              </div>
            </button>

            {/* User Account / Auth Menu */}
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors"
                >
                  <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white text-xs font-bold flex items-center justify-center uppercase">
                    {user.name.slice(0, 2)}
                  </div>
                  <div className="text-left hidden md:block leading-tight">
                    <div className="text-xs font-bold text-slate-800 truncate max-w-[90px]">
                      {user.name.split(" ")[0]}
                    </div>
                    <div className="text-[10px] text-emerald-600 font-semibold">
                      {user.loyaltyPoints} pts
                    </div>
                  </div>
                  <ChevronDown className="w-3 h-3 text-slate-400 hidden sm:block" />
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900">{user.name}</p>
                      <p className="text-[11px] text-slate-500">{user.phone || user.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        dispatch(setCurrentView("dashboard"));
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <UserIcon className="w-4 h-4 text-slate-500" />
                      My Account & Orders
                    </button>
                    <button
                      onClick={() => {
                        dispatch(setCurrentView("orders"));
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <Package className="w-4 h-4 text-slate-500" />
                      Order History
                    </button>
                    <button
                      onClick={() => {
                        dispatch(setCurrentView("track"));
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <Truck className="w-4 h-4 text-slate-500" />
                      Track Live Order
                    </button>
                    <div className="border-t border-slate-100 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-medium"
                    >
                      <LogOut className="w-4 h-4 text-rose-600" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => dispatch(openAuthModal("signin"))}
                className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs"
              >
                <UserIcon className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="mt-2.5 md:hidden">
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-1.5">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search products..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
            <button
              type="submit"
              className="bg-emerald-600 text-white px-3 py-2 rounded-xl text-xs font-bold shrink-0"
            >
              Search
            </button>
          </form>
        </div>
      </div>
    </header>
  );
};
