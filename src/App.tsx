import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { store, useAppDispatch, useAppSelector } from "./store";
import { setProducts, fetchProducts } from "./store/slices/productSlice";
import { Header } from "./components/Header";
import { Navbar } from "./components/Navbar";
import { HeroCarousel } from "./components/HeroCarousel";
import { FeaturedCategories } from "./components/FeaturedCategories";
import { RecommendedSection } from "./components/RecommendedSection";
import { BestDealsSection } from "./components/BestDealsSection";
import { FlashSalesSection } from "./components/FlashSalesSection";
import { CategoryShopView } from "./components/CategoryShopView";
import { UserDashboard } from "./components/UserDashboard";
import { OrderTrackingView } from "./components/OrderTrackingView";
import { ProductDetailModal } from "./components/ProductDetailModal";
import { CartDrawer } from "./components/CartDrawer";
import { CheckoutModal } from "./components/CheckoutModal";
import { OrderSuccessModal } from "./components/OrderSuccessModal";
import { AuthModal } from "./components/AuthModal";
import { AIChatDrawer } from "./components/AIChatDrawer";
import { Footer } from "./components/Footer";
import { Toast } from "./components/Toast";

const CookMeAppContent: React.FC = () => {
  const dispatch = useAppDispatch();
  const { currentView } = useAppSelector((state) => state.products);

  // Initial fetch from backend API
  useEffect(() => {
    dispatch(fetchProducts(undefined));
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Top Header & Navigation */}
      <Header />
      <Navbar />

      {/* Dynamic View Router */}
      <main className="flex-1">
        {currentView === "home" && (
          <div className="space-y-4">
            <HeroCarousel />
            <FeaturedCategories />
            <RecommendedSection />
            <BestDealsSection />
            <FlashSalesSection />
          </div>
        )}

        {currentView === "shop" && <CategoryShopView />}

        {currentView === "dashboard" && <UserDashboard />}

        {currentView === "track" && <OrderTrackingView />}
      </main>

      {/* Global Interactive Modals, Drawers & Overlays */}
      <ProductDetailModal />
      <CartDrawer />
      <CheckoutModal />
      <OrderSuccessModal />
      <AuthModal />
      <AIChatDrawer />
      <Toast />

      {/* Modern Footer */}
      <Footer />
    </div>
  );
};

export function App() {
  return (
    <Provider store={store}>
      <CookMeAppContent />
    </Provider>
  );
}

export default App;
