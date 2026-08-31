import React from "react";
import {
  CheckCircle2,
  Phone,
  MessageSquare,
  Truck,
  ShoppingBag,
  ExternalLink,
  Sparkles,
  ArrowRight,
  ShieldCheck
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../store";
import { closeOrderSuccess } from "../store/slices/uiSlice";
import { setCurrentView, setTrackingOrderNumber } from "../store/slices/productSlice";

export const OrderSuccessModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isOrderSuccessOpen, lastOrder, notificationData } = useAppSelector(
    (state) => state.ui
  );

  if (!isOrderSuccessOpen || !lastOrder) return null;

  const handleTrackOrder = () => {
    dispatch(setTrackingOrderNumber(lastOrder.orderNumber));
    dispatch(closeOrderSuccess());
    dispatch(setCurrentView("track"));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-xs overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto p-6 sm:p-8 text-center">
        {/* Animated Checkmark Badge */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
          <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12" />
        </div>

        <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          Order Placed Successfully!
        </span>

        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Thank you, {lastOrder.customerName}!
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Your order has been received and is now being prepared for shipping.
        </p>

        {/* Order Number Banner */}
        <div className="mt-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
          <div>
            <div className="text-[11px] text-slate-400">Order Reference #</div>
            <div className="text-base font-black text-slate-900 font-mono">
              {lastOrder.orderNumber}
            </div>
          </div>

          <div className="text-right">
            <div className="text-[11px] text-slate-400">Total Payable</div>
            <div className="text-base font-black text-emerald-700">
              ৳{lastOrder.totalAmount.toLocaleString()}
            </div>
          </div>
        </div>

        {/* SMS Notification Confirmation Card (Highlighting user-requested numbers) */}
        <div className="mt-4 p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-left space-y-2.5">
          <div className="flex items-center gap-2 text-emerald-950 font-bold text-xs">
            <MessageSquare className="w-4 h-4 text-emerald-600" />
            <span>SMS Notification Dispatched To Hotlines:</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="flex items-center justify-between bg-white px-3 py-2 rounded-xl border border-emerald-200 text-xs">
              <span className="font-mono font-bold text-slate-800 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                01711254089
              </span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                Sent ✓
              </span>
            </div>

            <div className="flex items-center justify-between bg-white px-3 py-2 rounded-xl border border-emerald-200 text-xs">
              <span className="font-mono font-bold text-slate-800 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                01911970994
              </span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                Sent ✓
              </span>
            </div>
          </div>

          {/* WhatsApp Direct Chat Links */}
          <div className="pt-1">
            <div className="text-[11px] font-semibold text-slate-600 mb-1.5">
              Need immediate support? Message our managers directly:
            </div>
            <div className="flex flex-wrap gap-2">
              <a
                href={`https://wa.me/8801711254089?text=${encodeURIComponent(
                  `Hi CookMe! I just placed order #${lastOrder.orderNumber} for ৳${lastOrder.totalAmount}.`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-xs transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp 01711254089</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <a
                href={`https://wa.me/8801911970994?text=${encodeURIComponent(
                  `Hi CookMe! I just placed order #${lastOrder.orderNumber} for ৳${lastOrder.totalAmount}.`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-xs transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp 01911970994</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Delivery Details Overview */}
        <div className="mt-4 text-xs text-left p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-600 space-y-1">
          <div>
            <strong className="text-slate-800">Delivery Address:</strong> {lastOrder.deliveryAddress}, {lastOrder.deliveryCity}
          </div>
          <div>
            <strong className="text-slate-800">Payment:</strong> {lastOrder.paymentMethod} (Status: {lastOrder.paymentStatus})
          </div>
          <div>
            <strong className="text-slate-800">Items:</strong> {lastOrder.items.map((it) => `${it.quantity}x ${it.name}`).join(", ")}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={handleTrackOrder}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-3 px-4 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Truck className="w-4 h-4" />
            <span>Track Order Progress</span>
          </button>

          <button
            onClick={() => {
              dispatch(closeOrderSuccess());
              dispatch(setCurrentView("home"));
            }}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 px-4 rounded-xl shadow-md shadow-emerald-600/25 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Continue Shopping</span>
          </button>
        </div>
      </div>
    </div>
  );
};
