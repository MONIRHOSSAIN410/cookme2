import React from "react";
import {
  X,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  Truck,
  ShieldCheck,
  MapPin
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../store";
import {
  closeCartDrawer,
  openCheckoutModal,
  showToast
} from "../store/slices/uiSlice";
import {
  incrementQuantity,
  decrementQuantity,
  removeFromCart,
  setDeliveryCity,
  clearCart
} from "../store/slices/cartSlice";
import { setCurrentView } from "../store/slices/productSlice";

export const CartDrawer: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isCartDrawerOpen } = useAppSelector((state) => state.ui);
  const { items, subtotal, deliveryCity, deliveryFee, totalAmount, totalItems } = useAppSelector(
    (state) => state.cart
  );

  if (!isCartDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Dark Backdrop */}
      <div
        onClick={() => dispatch(closeCartDrawer())}
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-in fade-in"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between border-l border-slate-200 animate-in slide-in-from-right duration-300">
          {/* Drawer Header */}
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-slate-900">Your Cart</h2>
                <p className="text-[11px] text-slate-500">{totalItems} item{totalItems !== 1 ? 's' : ''} in cart</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {items.length > 0 && (
                <button
                  onClick={() => {
                    dispatch(clearCart());
                    dispatch(showToast({ message: "Cart emptied", type: "info" }));
                  }}
                  className="text-[11px] text-slate-400 hover:text-rose-600 font-semibold px-2 py-1"
                >
                  Clear
                </button>
              )}
              <button
                onClick={() => dispatch(closeCartDrawer())}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                aria-label="Close cart"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {items.length > 0 ? (
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3 relative group"
                  >
                    {/* Item Image */}
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded-xl object-cover bg-slate-100 shrink-0"
                    />

                    {/* Details */}
                    <div className="flex-1 min-w-0 pr-2">
                      <h4 className="text-xs font-bold text-slate-900 truncate">
                        {item.name}
                      </h4>
                      <div className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-1.5">
                        {item.size && <span className="bg-slate-100 px-1.5 py-0.5 rounded">Size: {item.size}</span>}
                        {item.color && <span className="bg-slate-100 px-1.5 py-0.5 rounded">{item.color}</span>}
                      </div>
                      <div className="text-xs font-extrabold text-emerald-800 mt-1">
                        ৳{item.price.toLocaleString()}
                      </div>
                    </div>

                    {/* Quantity & Delete Controls */}
                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <button
                        onClick={() => {
                          dispatch(removeFromCart(item.id));
                          dispatch(showToast({ message: `Removed ${item.name} from cart`, type: "info" }));
                        }}
                        className="text-slate-300 hover:text-rose-600 transition-colors p-1"
                        title="Delete item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200">
                        <button
                          onClick={() => dispatch(decrementQuantity(item.id))}
                          className="w-5 h-5 rounded bg-white text-slate-700 hover:bg-slate-200 flex items-center justify-center font-bold text-xs"
                        >
                          <Minus className="w-2.5 h-2.5" />
                        </button>
                        <span className="px-2 text-xs font-extrabold text-slate-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => dispatch(incrementQuantity(item.id))}
                          className="w-5 h-5 rounded bg-emerald-600 text-white hover:bg-emerald-700 flex items-center justify-center font-bold text-xs"
                        >
                          <Plus className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Your cart is empty</h3>
                  <p className="text-xs text-slate-500 max-w-xs mt-1">
                    Explore our trendy collections and find lifestyle products you love.
                  </p>
                </div>
                <button
                  onClick={() => {
                    dispatch(closeCartDrawer());
                    dispatch(setCurrentView("shop"));
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-colors"
                >
                  Start Shopping
                </button>
              </div>
            )}
          </div>

          {/* Drawer Footer & Checkout Action */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50/90 space-y-3.5">
              {/* Delivery Zone Selector */}
              <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs space-y-2">
                <div className="flex items-center justify-between text-slate-700 font-bold">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    Delivery Zone
                  </span>
                  <span className="text-emerald-700 font-extrabold">
                    ৳{deliveryFee}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => dispatch(setDeliveryCity("Inside Dhaka"))}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border text-center transition-all ${
                      deliveryCity === "Inside Dhaka"
                        ? "border-emerald-600 bg-emerald-50 text-emerald-800 font-bold"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    Inside Dhaka (৳60)
                  </button>
                  <button
                    onClick={() => dispatch(setDeliveryCity("Outside Dhaka"))}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border text-center transition-all ${
                      deliveryCity === "Outside Dhaka"
                        ? "border-emerald-600 bg-emerald-50 text-emerald-800 font-bold"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    Outside Dhaka (৳120)
                  </button>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-slate-900">৳{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Delivery Charge:</span>
                  <span className="font-semibold text-slate-900">৳{deliveryFee}</span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-slate-950 pt-2 border-t border-slate-200">
                  <span>Total Amount:</span>
                  <span className="text-emerald-700 text-base">৳{totalAmount.toLocaleString()}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => dispatch(openCheckoutModal())}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm py-3 px-4 rounded-xl transition-all shadow-md shadow-emerald-600/25 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
