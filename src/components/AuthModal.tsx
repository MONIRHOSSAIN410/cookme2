import React, { useState } from "react";
import {
  X,
  User as UserIcon,
  Phone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  AlertCircle,
  CheckCircle,
  LogIn,
  UserPlus
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../store";
import { closeAuthModal, setAuthMode, showToast } from "../store/slices/uiSlice";
import { setAuthSuccess } from "../store/slices/authSlice";

export const AuthModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isAuthModalOpen, authMode } = useAppSelector((state) => state.ui);

  // Form fields
  const [name, setName] = useState("");
  const [identifier, setIdentifier] = useState(""); // Email or Phone for Login
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const validate = () => {
    const errs: Record<string, string> = {};

    if (authMode === "signup") {
      if (!name.trim() || name.trim().length < 2) {
        errs.name = "Full Name is required (minimum 2 characters)";
      }
      if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errs.email = "Please enter a valid email address";
      }
      const cleanPhone = phone.replace(/[\s-]/g, "");
      if (!cleanPhone || !/^01[3-9]\d{8}$/.test(cleanPhone)) {
        errs.phone = "Enter a valid 11-digit Bangladeshi mobile number (01XXXXXXXXX)";
      }
    } else {
      if (!identifier.trim()) {
        errs.identifier = "Please enter your registered Email or Mobile number";
      }
    }

    if (!password || password.length < 6) {
      errs.password = "Password must be at least 6 characters";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);

    try {
      const endpoint = authMode === "signup" ? "/api/auth/register" : "/api/auth/login";
      const payload =
        authMode === "signup"
          ? { name: name.trim(), email: email.trim(), phone: phone.trim(), password }
          : { identifier: identifier.trim(), password };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Authentication failed");
      }

      dispatch(setAuthSuccess({ user: data.user, token: data.token }));
      dispatch(closeAuthModal());
      dispatch(showToast({ message: data.message || `Welcome to CookMe!`, type: "success" }));
    } catch (err: any) {
      dispatch(showToast({ message: err.message || "Login failed", type: "error" }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: "adnan@cookme.com", password: "password123" }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message);

      dispatch(setAuthSuccess({ user: data.user, token: data.token }));
      dispatch(closeAuthModal());
      dispatch(showToast({ message: "Signed in as Demo User (Adnan Shakib)", type: "success" }));
    } catch (err: any) {
      dispatch(showToast({ message: err.message, type: "error" }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto p-6 sm:p-8">
        {/* Close Button */}
        <button
          onClick={() => dispatch(closeAuthModal())}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3 shadow-xs">
            {authMode === "signin" ? <LogIn className="w-6 h-6" /> : <UserPlus className="w-6 h-6" />}
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">
            {authMode === "signin" ? "Welcome Back to CookMe" : "Create Your CookMe Account"}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {authMode === "signin"
              ? "Sign in to access your orders, wishlist, and loyalty points."
              : "Join CookMe for exclusive discounts and personalized shopping."}
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl mb-5 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              dispatch(setAuthMode("signin"));
              setErrors({});
            }}
            className={`py-2 rounded-lg transition-all ${
              authMode === "signin" ? "bg-white text-emerald-800 shadow-xs" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              dispatch(setAuthMode("signup"));
              setErrors({});
            }}
            className={`py-2 rounded-lg transition-all ${
              authMode === "signup" ? "bg-white text-emerald-800 shadow-xs" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {authMode === "signup" && (
            <>
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Adnan Shakib"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (errors.name) setErrors({ ...errors, name: "" });
                    }}
                    className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-xs text-slate-800 outline-none ${
                      errors.name ? "border-rose-400 bg-rose-50/40" : "border-slate-200 bg-slate-50 focus:bg-white"
                    }`}
                  />
                </div>
                {errors.name && <p className="text-[11px] text-rose-500 mt-1">{errors.name}</p>}
              </div>

              {/* Mobile Phone */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mobile Number <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    placeholder="01XXXXXXXXX"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (errors.phone) setErrors({ ...errors, phone: "" });
                    }}
                    className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-xs text-slate-800 outline-none ${
                      errors.phone ? "border-rose-400 bg-rose-50/40" : "border-slate-200 bg-slate-50 focus:bg-white"
                    }`}
                  />
                </div>
                {errors.phone && <p className="text-[11px] text-rose-500 mt-1">{errors.phone}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    placeholder="adnan@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors({ ...errors, email: "" });
                    }}
                    className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-xs text-slate-800 outline-none ${
                      errors.email ? "border-rose-400 bg-rose-50/40" : "border-slate-200 bg-slate-50 focus:bg-white"
                    }`}
                  />
                </div>
                {errors.email && <p className="text-[11px] text-rose-500 mt-1">{errors.email}</p>}
              </div>
            </>
          )}

          {authMode === "signin" && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Phone Number or Email <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="01711254089 or adnan@cookme.com"
                  value={identifier}
                  onChange={(e) => {
                    setIdentifier(e.target.value);
                    if (errors.identifier) setErrors({ ...errors, identifier: "" });
                  }}
                  className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-xs text-slate-800 outline-none ${
                    errors.identifier ? "border-rose-400 bg-rose-50/40" : "border-slate-200 bg-slate-50 focus:bg-white"
                  }`}
                />
              </div>
              {errors.identifier && <p className="text-[11px] text-rose-500 mt-1">{errors.identifier}</p>}
            </div>
          )}

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700">
                Password <span className="text-rose-500">*</span>
              </label>
              {authMode === "signin" && (
                <button
                  type="button"
                  onClick={() => dispatch(showToast({ message: "Password reset link sent to registered phone/email", type: "info" }))}
                  className="text-[11px] text-emerald-600 hover:underline"
                >
                  Forgot Password?
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors({ ...errors, password: "" });
                }}
                className={`w-full pl-9 pr-9 py-2.5 rounded-xl border text-xs text-slate-800 outline-none ${
                  errors.password ? "border-rose-400 bg-rose-50/40" : "border-slate-200 bg-slate-50 focus:bg-white"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && <p className="text-[11px] text-rose-500 mt-1">{errors.password}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold text-xs sm:text-sm py-3 px-4 rounded-xl shadow-md shadow-emerald-600/25 transition-all cursor-pointer mt-2"
          >
            {isLoading ? "Authenticating..." : authMode === "signin" ? "Sign In Securely" : "Create My Account"}
          </button>
        </form>

        {/* Demo Fast Login Button */}
        <div className="mt-4 pt-4 border-t border-slate-100 text-center">
          <button
            type="button"
            onClick={handleDemoLogin}
            className="w-full py-2.5 px-3 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-950 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>One-Click Demo Login (Adnan Shakib)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
