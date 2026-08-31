import React, { useState } from "react";
import {
  X,
  ShieldCheck,
  Truck,
  CreditCard,
  Banknote,
  Smartphone,
  MapPin,
  Phone,
  User as UserIcon,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Lock
} from "lucide-react";
import confetti from "canvas-confetti";
import { useAppDispatch, useAppSelector } from "../store";
import { closeCheckoutModal, openOrderSuccess, showToast } from "../store/slices/uiSlice";
import { clearCart, setDeliveryCity } from "../store/slices/cartSlice";

export const CheckoutModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isCheckoutModalOpen } = useAppSelector((state) => state.ui);
  const { items, subtotal, deliveryCity, deliveryFee, totalAmount } = useAppSelector(
    (state) => state.cart
  );
  const { user, token } = useAppSelector((state) => state.auth);

  // Form State with pre-fill from user profile
  const [customerName, setCustomerName] = useState(user?.name || "");
  const [customerPhone, setCustomerPhone] = useState(user?.phone || "");
  const [customerEmail, setCustomerEmail] = useState(user?.email || "");
  const [deliveryAddress, setDeliveryAddress] = useState(
    user?.addresses?.[0]?.street || ""
  );
  const [paymentMethod, setPaymentMethod] = useState<'Cash On Delivery' | 'bKash' | 'Nagad' | 'Card'>('Cash On Delivery');
  const [notes, setNotes] = useState("");

  // Validation Errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isCheckoutModalOpen) return null;

  const validateForm = () => {
    const errs: Record<string, string> = {};

    if (!customerName.trim() || customerName.trim().length < 2) {
      errs.customerName = "Full Name is required (minimum 2 characters)";
    }

    const cleanPhone = customerPhone.replace(/[\s-]/g, "");
    if (!cleanPhone || !/^01[3-9]\d{8}$/.test(cleanPhone)) {
      errs.customerPhone = "Enter a valid 11-digit Bangladeshi mobile number (e.g. 017XXXXXXXX / 019XXXXXXXX)";
    }

    if (!deliveryAddress.trim() || deliveryAddress.trim().length < 5) {
      errs.deliveryAddress = "Please provide detailed street / house / area address (min 5 chars)";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      dispatch(showToast({ message: "Please correct the highlighted fields", type: "error" }));
      return;
    }

    if (items.length === 0) {
      dispatch(showToast({ message: "Your cart is empty", type: "error" }));
      return;
    }

    setIsSubmitting(true);

    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch("/api/orders", {
        method: "POST",
        headers,
        body: JSON.stringify({
          customerName: customerName.trim(),
          customerPhone: customerPhone.trim(),
          customerEmail: customerEmail.trim(),
          deliveryAddress: deliveryAddress.trim(),
          deliveryCity,
          paymentMethod,
          notes: notes.trim(),
          items: items.map((i) => ({
            productId: i.productId,
            name: i.name,
            image: i.image,
            price: i.price,
            quantity: i.quantity,
            size: i.size,
            color: i.color,
            total: i.total,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to place order");
      }

      // Fire festive celebratory Confetti!
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // Confetti fallback
      }

      // Clear the cart
      dispatch(clearCart());

      // Open Order Confirmation modal with SMS dispatch alert
      dispatch(
        openOrderSuccess({
          order: data.order,
          notification: data.notification || {
            smsSent: true,
            numbers: ["01711254089", "01911970994"],
            message: `Order #${data.order.orderNumber} placed by ${customerName}`,
            whatsappLinks: [
              { phone: "01711254089", url: `https://wa.me/8801711254089` },
              { phone: "01911970994", url: `https://wa.me/8801911970994` },
            ],
          },
        })
      );
    } catch (err: any) {
      dispatch(showToast({ message: err.message || "Network error while placing order", type: "error" }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[95vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">Express Checkout</h2>
              <p className="text-[11px] text-slate-500">Fast delivery with instant SMS order confirmation</p>
            </div>
          </div>

          <button
            onClick={() => dispatch(closeCheckoutModal())}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleOrderSubmit} className="overflow-y-auto p-6 space-y-5 flex-1">
          {/* Notification Highlight Banner */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-xs text-emerald-950">
              <strong className="font-bold">Instant SMS Dispatch Active:</strong> Once ordered, our server immediately broadcasts SMS order invoices to our hotlines:{" "}
              <span className="font-extrabold text-emerald-800 underline">01711254089</span> &{" "}
              <span className="font-extrabold text-emerald-800 underline">01911970994</span>.
            </div>
          </div>

          {/* Customer Information Inputs */}
          <div className="space-y-4">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
              1. Customer & Delivery Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="e.g. Adnan Shakib"
                    value={customerName}
                    onChange={(e) => {
                      setCustomerName(e.target.value);
                      if (errors.customerName) setErrors({ ...errors, customerName: "" });
                    }}
                    className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-xs text-slate-800 outline-none transition-colors ${
                      errors.customerName
                        ? "border-rose-400 bg-rose-50/30 focus:border-rose-500"
                        : "border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500"
                    }`}
                  />
                </div>
                {errors.customerName && (
                  <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.customerName}
                  </p>
                )}
              </div>

              {/* Mobile Number */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Bangladeshi Mobile Phone <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    placeholder="01XXXXXXXXX"
                    value={customerPhone}
                    onChange={(e) => {
                      setCustomerPhone(e.target.value);
                      if (errors.customerPhone) setErrors({ ...errors, customerPhone: "" });
                    }}
                    className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-xs text-slate-800 outline-none transition-colors font-mono ${
                      errors.customerPhone
                        ? "border-rose-400 bg-rose-50/30 focus:border-rose-500"
                        : "border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500"
                    }`}
                  />
                </div>
                {errors.customerPhone && (
                  <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.customerPhone}
                  </p>
                )}
              </div>
            </div>

            {/* Email & Delivery Address */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  placeholder="your.email@example.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs text-slate-800 outline-none focus:border-emerald-500"
                />
              </div>

              {/* Delivery Zone */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Delivery Area / District <span className="text-rose-500">*</span>
                </label>
                <select
                  value={deliveryCity}
                  onChange={(e) => dispatch(setDeliveryCity(e.target.value as any))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-800 outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option value="Inside Dhaka">Inside Dhaka (৳60, 1-2 Days)</option>
                  <option value="Outside Dhaka">Outside Dhaka (৳120, 2-4 Days)</option>
                </select>
              </div>
            </div>

            {/* Street Address */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Full Delivery Street Address <span className="text-rose-500">*</span>
              </label>
              <textarea
                placeholder="House #, Road #, Sector/Area, Landmark..."
                value={deliveryAddress}
                onChange={(e) => {
                  setDeliveryAddress(e.target.value);
                  if (errors.deliveryAddress) setErrors({ ...errors, deliveryAddress: "" });
                }}
                rows={2}
                className={`w-full p-3 rounded-xl border text-xs text-slate-800 outline-none transition-colors resize-none ${
                  errors.deliveryAddress
                    ? "border-rose-400 bg-rose-50/30 focus:border-rose-500"
                    : "border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500"
                }`}
              />
              {errors.deliveryAddress && (
                <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.deliveryAddress}
                </p>
              )}
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
              2. Payment Method
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { id: "Cash On Delivery", label: "Cash On Delivery", icon: Banknote, sub: "Pay upon arrival" },
                { id: "bKash", label: "bKash", icon: Smartphone, sub: "Instant Mobile Pay" },
                { id: "Nagad", label: "Nagad", icon: Smartphone, sub: "Digital Wallet" },
                { id: "Card", label: "Card / Visa", icon: CreditCard, sub: "Debit / Credit" },
              ].map((m) => {
                const Icon = m.icon;
                const isSelected = paymentMethod === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPaymentMethod(m.id as any)}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? "border-emerald-600 bg-emerald-50 text-emerald-950 font-bold shadow-xs"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <Icon className={`w-4 h-4 mb-1.5 ${isSelected ? "text-emerald-600" : "text-slate-400"}`} />
                    <div className="text-xs leading-tight font-extrabold">{m.label}</div>
                    <div className="text-[10px] text-slate-400 font-normal mt-0.5">{m.sub}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Order Summary Breakdown */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <h4 className="text-xs font-extrabold text-slate-900 mb-2">Order Items ({items.length})</h4>
            <div className="max-h-28 overflow-y-auto space-y-1.5 pr-1">
              {items.map((it) => (
                <div key={it.id} className="flex justify-between text-xs text-slate-600">
                  <span className="truncate max-w-[280px]">
                    {it.quantity}x {it.name} ({it.size || "Std"})
                  </span>
                  <span className="font-semibold text-slate-900 shrink-0">
                    ৳{it.total.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-200 pt-2 space-y-1 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span className="font-semibold text-slate-900">৳{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Delivery Charge ({deliveryCity}):</span>
                <span className="font-semibold text-slate-900">৳{deliveryFee}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-slate-950 pt-1 border-t border-slate-200">
                <span>Total Payable:</span>
                <span className="text-emerald-700 text-lg">৳{totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Submit Order Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold text-sm py-3.5 px-4 rounded-2xl shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <span>Submitting & Dispatching SMS...</span>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  <span>Confirm Order (৳{totalAmount.toLocaleString()})</span>
                </>
              )}
            </button>
            <p className="text-center text-[11px] text-slate-400 mt-2">
              By confirming, you agree to CookMe terms. Live SMS dispatched to 01711254089 & 01911970994.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
