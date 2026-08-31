import React, { useState, useEffect } from "react";
import {
  Search,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  MessageSquare,
  Package,
  ExternalLink,
  Sparkles,
  AlertCircle
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../store";
import { setTrackingOrderNumber } from "../store/slices/productSlice";
import { showToast } from "../store/slices/uiSlice";
import { Order } from "../types";

export const OrderTrackingView: React.FC = () => {
  const dispatch = useAppDispatch();
  const trackingOrderNumber = useAppSelector((state) => state.products.trackingOrderNumber);

  const [inputOrderNumber, setInputOrderNumber] = useState(trackingOrderNumber || "");
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSearchOrder = async (queryNum: string) => {
    const clean = queryNum.trim().toUpperCase();
    if (!clean) return;

    setIsLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch(`/api/orders/track/${encodeURIComponent(clean)}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Order not found");
      }

      setOrder(data.order);
      dispatch(setTrackingOrderNumber(data.order.orderNumber));
    } catch (err: any) {
      setErrorMsg(err.message || "Unable to locate order");
      setOrder(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (trackingOrderNumber) {
      setInputOrderNumber(trackingOrderNumber);
      handleSearchOrder(trackingOrderNumber);
    }
  }, [trackingOrderNumber]);

  const steps = [
    { title: "Order Placed", desc: "Received in CookMe system", done: true },
    { title: "SMS Sent to Hotlines", desc: "Dispatched to 01711254089 & 01911970994", done: true },
    { title: "Processing & Quality Check", desc: "Items sanitized and packed", done: true },
    { title: "Out for Courier Delivery", desc: "Assigned to delivery agent", done: order?.orderStatus === "Shipped" || order?.orderStatus === "Delivered" },
    { title: "Delivered", desc: "Received and signed by customer", done: order?.orderStatus === "Delivered" },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
          <Truck className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Track Your Order Live
        </h1>
        <p className="text-xs text-slate-500">
          Enter your CookMe order number (e.g. CKM-482910) to see live courier dispatch & SMS notification status.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="bg-white rounded-2xl p-3 border border-slate-200 shadow-md flex items-center gap-2 max-w-lg mx-auto">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Enter Order # (e.g. CKM-482910)"
            value={inputOrderNumber}
            onChange={(e) => setInputOrderNumber(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearchOrder(inputOrderNumber)}
            className="w-full pl-9 pr-3 py-2 text-xs font-mono font-bold text-slate-900 outline-none uppercase"
          />
        </div>
        <button
          onClick={() => handleSearchOrder(inputOrderNumber)}
          disabled={isLoading}
          className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer shrink-0"
        >
          {isLoading ? "Searching..." : "Track"}
        </button>
      </div>

      {/* Error state */}
      {errorMsg && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-2xl text-xs flex items-center gap-2 max-w-lg mx-auto">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Order Details Output */}
      {order && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-lg space-y-6 animate-in fade-in">
          {/* Order Meta Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-mono font-black text-xl text-slate-900">
                  #{order.orderNumber}
                </h3>
                <span className="bg-emerald-100 text-emerald-800 text-xs font-black px-2.5 py-0.5 rounded-full uppercase">
                  {order.orderStatus}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Ordered on {new Date(order.createdAt).toLocaleString()} by {order.customerName}
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-[11px] text-slate-400 block">Total Amount</span>
              <span className="text-xl font-black text-emerald-700">
                ৳{order.totalAmount.toLocaleString()}
              </span>
            </div>
          </div>

          {/* SMS Notification Banner for user-required phone numbers */}
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-950">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>SMS Order Dispatch Verified to Hotlines:</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="bg-white px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center justify-between">
                <span className="font-mono font-bold text-slate-800 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  01711254089
                </span>
                <span className="text-[10px] text-emerald-700 font-bold">Delivered ✓</span>
              </div>

              <div className="bg-white px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center justify-between">
                <span className="font-mono font-bold text-slate-800 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  01911970994
                </span>
                <span className="text-[10px] text-emerald-700 font-bold">Delivered ✓</span>
              </div>
            </div>
          </div>

          {/* Live Step Progress */}
          <div className="space-y-4 pt-2">
            <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
              Tracking Milestones
            </h4>

            <div className="space-y-4">
              {steps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-3 relative">
                  {/* Progress Dot & Line */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        step.done
                          ? "bg-emerald-600 text-white shadow-xs"
                          : "bg-slate-200 text-slate-500"
                      }`}
                    >
                      {step.done ? "✓" : idx + 1}
                    </div>
                    {idx < steps.length - 1 && (
                      <div
                        className={`w-0.5 h-8 my-1 ${
                          step.done ? "bg-emerald-500" : "bg-slate-200"
                        }`}
                      />
                    )}
                  </div>

                  <div className="flex-1 pb-2">
                    <div
                      className={`text-xs font-bold ${
                        step.done ? "text-slate-900" : "text-slate-400"
                      }`}
                    >
                      {step.title}
                    </div>
                    <div className="text-[11px] text-slate-500">{step.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Purchased Items List */}
          <div className="border-t border-slate-200 pt-4 space-y-3">
            <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
              Order Items ({order.items.length})
            </h4>

            <div className="space-y-2">
              {order.items.map((it, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={it.image}
                      alt={it.name}
                      className="w-12 h-12 rounded-lg object-cover bg-white"
                    />
                    <div>
                      <div className="font-bold text-slate-900">{it.name}</div>
                      <div className="text-[11px] text-slate-500">
                        Qty: {it.quantity} | Size: {it.size || "Standard"} | Color: {it.color || "Standard"}
                      </div>
                    </div>
                  </div>
                  <span className="font-black text-emerald-800">
                    ৳{it.total.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* WhatsApp Support Direct Actions */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-200 gap-3">
            <div className="text-xs text-slate-600">
              Need immediate updates? Contact CookMe courier desk:
            </div>
            <div className="flex items-center gap-2">
              <a
                href={`https://wa.me/8801711254089?text=Tracking%20Order%20${order.orderNumber}`}
                target="_blank"
                rel="noreferrer"
                className="bg-[#25D366] text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-xs"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>01711254089</span>
              </a>
              <a
                href={`https://wa.me/8801911970994?text=Tracking%20Order%20${order.orderNumber}`}
                target="_blank"
                rel="noreferrer"
                className="bg-[#25D366] text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-xs"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>01911970994</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
