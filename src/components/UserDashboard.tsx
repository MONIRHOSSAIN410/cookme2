import React, { useState, useEffect } from "react";
import {
  User as UserIcon,
  Package,
  Heart,
  MapPin,
  Award,
  Settings,
  LogOut,
  ShoppingBag,
  Truck,
  Plus,
  Trash2,
  Phone,
  CheckCircle,
  Clock,
  ChevronRight,
  ExternalLink
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../store";
import { logout } from "../store/slices/authSlice";
import {
  setCurrentView,
  setTrackingOrderNumber,
  setSelectedProduct,
} from "../store/slices/productSlice";
import { addToCart } from "../store/slices/cartSlice";
import { removeFromWishlist } from "../store/slices/wishlistSlice";
import { openQuickView, showToast } from "../store/slices/uiSlice";
import { Order } from "../types";

export const UserDashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user, token } = useAppSelector((state) => state.auth);
  const { items: wishlistItems } = useAppSelector((state) => state.wishlist);

  const [activeTab, setActiveTab] = useState<
    'overview' | 'orders' | 'addresses' | 'wishlist' | 'loyalty' | 'settings'
  >('overview');

  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  // New Address Form
  const [newAddrLabel, setNewAddrLabel] = useState("Home");
  const [newAddrStreet, setNewAddrStreet] = useState("");
  const [newAddrCity, setNewAddrCity] = useState("Inside Dhaka");
  const [newAddrPhone, setNewAddrPhone] = useState(user?.phone || "");
  const [isAddingAddress, setIsAddingAddress] = useState(false);

  // Fetch orders for this user
  useEffect(() => {
    async function loadOrders() {
      if (!token) return;
      setIsLoadingOrders(true);
      try {
        const res = await fetch("/api/orders/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) {
          setOrders(data.orders);
        }
      } catch (err) {
        console.error("Failed to load user orders", err);
      } finally {
        setIsLoadingOrders(false);
      }
    }
    loadOrders();
  }, [token]);

  if (!user) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-white rounded-3xl border border-slate-200 text-center space-y-4">
        <UserIcon className="w-12 h-12 text-slate-400 mx-auto" />
        <h2 className="text-lg font-bold text-slate-900">Please Sign In</h2>
        <p className="text-xs text-slate-500">Sign in to view your profile, order history, and saved addresses.</p>
      </div>
    );
  }

  const totalSpent = orders.reduce((sum, o) => sum + o.totalAmount, 0);

  const handleTrackOrder = (orderNum: string) => {
    dispatch(setTrackingOrderNumber(orderNum));
    dispatch(setCurrentView("track"));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Profile Summary Header Card */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-emerald-500 text-white font-black text-2xl flex items-center justify-center uppercase shadow-lg shadow-emerald-500/30">
            {user.name.slice(0, 2)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold">{user.name}</h1>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-400/30">
                Verified Member
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">{user.phone} • {user.email}</p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-bold mt-2">
              <Award className="w-4 h-4" />
              <span>{user.loyaltyPoints} Loyalty Reward Points</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            dispatch(logout());
            dispatch(showToast({ message: "Logged out successfully", type: "info" }));
            dispatch(setCurrentView("home"));
          }}
          className="bg-white/10 hover:bg-rose-500/20 text-white hover:text-rose-300 border border-white/20 hover:border-rose-400/40 text-xs font-bold px-4 py-2 rounded-xl transition-colors flex items-center gap-2 self-end md:self-center"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
          <div className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">Total Orders</div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">{orders.length}</div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
          <div className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">Total Spent</div>
          <div className="text-2xl font-extrabold text-emerald-700 mt-1">৳{totalSpent.toLocaleString()}</div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
          <div className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">Loyalty Points</div>
          <div className="text-2xl font-extrabold text-amber-600 mt-1">{user.loyaltyPoints}</div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
          <div className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">Wishlist Items</div>
          <div className="text-2xl font-extrabold text-rose-600 mt-1">{wishlistItems.length}</div>
        </div>
      </div>

      {/* Main Account Tabs & Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <div className="bg-white rounded-2xl p-3 border border-slate-200 shadow-xs space-y-1 self-start">
          {[
            { id: "overview", label: "Overview", icon: UserIcon },
            { id: "orders", label: "My Orders", icon: Package, badge: orders.length },
            { id: "wishlist", label: "My Wishlist", icon: Heart, badge: wishlistItems.length },
            { id: "addresses", label: "Delivery Addresses", icon: MapPin },
            { id: "loyalty", label: "Loyalty & Points", icon: Award },
            { id: "settings", label: "Account Settings", icon: Settings },
          ].map((t) => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold transition-colors text-left ${
                  isActive
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  {t.label}
                </span>
                {t.badge !== undefined && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${
                      isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {t.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* TAB: Overview */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Recent Orders Overview */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-extrabold text-slate-900 text-sm">Recent Orders</h3>
                  <button
                    onClick={() => setActiveTab("orders")}
                    className="text-xs font-bold text-emerald-600 hover:underline"
                  >
                    View All
                  </button>
                </div>

                {orders.length > 0 ? (
                  <div className="space-y-3">
                    {orders.slice(0, 2).map((ord) => (
                      <div
                        key={ord.id}
                        className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-slate-900 text-xs">
                              #{ord.orderNumber}
                            </span>
                            <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                              {ord.orderStatus}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-1">
                            {ord.items.map((i) => `${i.quantity}x ${i.name}`).join(", ")}
                          </p>
                          <div className="text-xs font-black text-emerald-700 mt-1">
                            ৳{ord.totalAmount.toLocaleString()} • {ord.deliveryCity}
                          </div>
                        </div>

                        <button
                          onClick={() => handleTrackOrder(ord.orderNumber)}
                          className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center justify-center gap-1.5 self-start sm:self-center"
                        >
                          <Truck className="w-3.5 h-3.5" />
                          Track Order
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-slate-400 text-xs">
                    No orders placed yet. Start shopping!
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB: Orders */}
          {activeTab === "orders" && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <h3 className="font-extrabold text-slate-900 text-base">Your Order History ({orders.length})</h3>

              {orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map((ord) => (
                    <div key={ord.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-extrabold text-slate-900 text-sm">
                              #{ord.orderNumber}
                            </span>
                            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full">
                              {ord.orderStatus}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-400">
                            Placed on {new Date(ord.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleTrackOrder(ord.orderNumber)}
                            className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl flex items-center gap-1.5"
                          >
                            <Truck className="w-3.5 h-3.5" />
                            Track
                          </button>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="space-y-2">
                        {ord.items.map((it, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs text-slate-700">
                            <div className="flex items-center gap-2.5">
                              <img src={it.image} alt={it.name} className="w-10 h-10 rounded-lg object-cover bg-white" />
                              <div>
                                <div className="font-bold text-slate-900">{it.name}</div>
                                <div className="text-[11px] text-slate-400">Qty: {it.quantity} | Size: {it.size || "Std"}</div>
                              </div>
                            </div>
                            <span className="font-black text-slate-900">৳{it.total.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>

                      {/* Dispatched SMS Notice */}
                      <div className="pt-2 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-slate-500 gap-2">
                        <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                          <CheckCircle className="w-3.5 h-3.5" />
                          SMS Confirmation sent to 01711254089, 01911970994
                        </span>
                        <div className="font-black text-emerald-800 text-sm">
                          Total: ৳{ord.totalAmount.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-slate-400 text-xs">
                  You have not placed any orders yet.
                </div>
              )}
            </div>
          )}

          {/* TAB: Wishlist */}
          {activeTab === "wishlist" && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <h3 className="font-extrabold text-slate-900 text-base">Your Wishlist ({wishlistItems.length})</h3>

              {wishlistItems.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {wishlistItems.map((prod) => (
                    <div
                      key={prod.id}
                      className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between gap-3"
                    >
                      <img src={prod.image} alt={prod.name} className="w-16 h-16 rounded-xl object-cover" />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 truncate">{prod.name}</h4>
                        <div className="text-xs font-black text-emerald-700 mt-0.5">
                          ৳{prod.price.toLocaleString()}
                        </div>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <button
                          onClick={() => {
                            dispatch(addToCart({ product: prod, quantity: 1 }));
                            dispatch(removeFromWishlist(prod.id));
                            dispatch(showToast({ message: `Moved ${prod.name} to Cart`, type: "success" }));
                          }}
                          className="bg-emerald-600 text-white p-2 rounded-xl hover:bg-emerald-700"
                          title="Move to Cart"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => dispatch(removeFromWishlist(prod.id))}
                          className="bg-slate-200 text-slate-600 p-2 rounded-xl hover:bg-rose-100 hover:text-rose-600"
                          title="Remove"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-slate-400 text-xs">
                  Your wishlist is empty. Tap the heart on products to save favorites!
                </div>
              )}
            </div>
          )}

          {/* TAB: Delivery Addresses */}
          {activeTab === "addresses" && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-slate-900 text-base">Saved Addresses</h3>
                <button
                  onClick={() => setIsAddingAddress(!isAddingAddress)}
                  className="bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New</span>
                </button>
              </div>

              {/* Address List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {user.addresses?.map((addr) => (
                  <div key={addr.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-1 relative">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                        {addr.label}
                      </span>
                      {addr.isDefault && (
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-700 font-medium pt-1">{addr.street}</p>
                    <p className="text-[11px] text-slate-500">{addr.city}, {addr.district}</p>
                    <p className="text-[11px] text-slate-500 font-mono">Contact: {addr.phone || user.phone}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: Loyalty Points */}
          {activeTab === "loyalty" && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">CookMe Loyalty Rewards</h3>
                  <p className="text-xs text-slate-500">Earn 20 points on every purchase across Bangladesh</p>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-white flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-amber-100 uppercase">Your Available Balance</div>
                  <div className="text-3xl font-black">{user.loyaltyPoints} Points</div>
                </div>
                <button
                  onClick={() => dispatch(showToast({ message: "Points automatically applied as discount at checkout!", type: "info" }))}
                  className="bg-white text-slate-900 font-bold text-xs px-4 py-2 rounded-xl shadow-xs"
                >
                  Redeem Rewards
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
