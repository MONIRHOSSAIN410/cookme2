import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { Product, Category } from "../../types";

interface ProductState {
  products: Product[];
  categories: Category[];
  selectedCategory: string;
  searchQuery: string;
  sortOption: string;
  priceRange: [number, number];
  minRating: number;
  selectedProduct: Product | null;
  activeRecommendedTab: 'featured' | 'newArrivals' | 'topRated' | 'bestSeller';
  currentView: 'home' | 'shop' | 'dashboard' | 'orders' | 'track';
  trackingOrderNumber: string;
  isLoading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  categories: [],
  selectedCategory: "All",
  searchQuery: "",
  sortOption: "Default",
  priceRange: [0, 6000],
  minRating: 0,
  selectedProduct: null,
  activeRecommendedTab: "featured",
  currentView: "home",
  trackingOrderNumber: "",
  isLoading: false,
  error: null,
};

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (params: { category?: string; search?: string; sort?: string } | undefined, { rejectWithValue }) => {
    try {
      const url = new URL("/api/products", window.location.origin);
      if (params?.category && params.category !== "All") url.searchParams.append("category", params.category);
      if (params?.search) url.searchParams.append("search", params.search);
      if (params?.sort) url.searchParams.append("sort", params.sort);

      const response = await fetch(url.toString());
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.message || "Failed to fetch products");
      return data.products;
    } catch (err: any) {
      return rejectWithValue(err.message || "Network error");
    }
  }
);

export const fetchCategories = createAsyncThunk(
  "products/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/products/categories");
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.message || "Failed to fetch categories");
      return data.categories;
    } catch (err: any) {
      return rejectWithValue(err.message || "Network error");
    }
  }
);

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
    },
    setSelectedCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSortOption: (state, action: PayloadAction<string>) => {
      state.sortOption = action.payload;
    },
    setPriceRange: (state, action: PayloadAction<[number, number]>) => {
      state.priceRange = action.payload;
    },
    setMinRating: (state, action: PayloadAction<number>) => {
      state.minRating = action.payload;
    },
    setSelectedProduct: (state, action: PayloadAction<Product | null>) => {
      state.selectedProduct = action.payload;
    },
    setActiveRecommendedTab: (
      state,
      action: PayloadAction<'featured' | 'newArrivals' | 'topRated' | 'bestSeller'>
    ) => {
      state.activeRecommendedTab = action.payload;
    },
    setCurrentView: (
      state,
      action: PayloadAction<'home' | 'shop' | 'dashboard' | 'orders' | 'track'>
    ) => {
      state.currentView = action.payload;
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    setTrackingOrderNumber: (state, action: PayloadAction<string>) => {
      state.trackingOrderNumber = action.payload;
    },
    resetFilters: (state) => {
      state.selectedCategory = "All";
      state.searchQuery = "";
      state.sortOption = "Default";
      state.priceRange = [0, 6000];
      state.minRating = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      });
  },
});

export const {
  setProducts,
  setSelectedCategory,
  setSearchQuery,
  setSortOption,
  setPriceRange,
  setMinRating,
  setSelectedProduct,
  setActiveRecommendedTab,
  setCurrentView,
  setTrackingOrderNumber,
  resetFilters,
} = productSlice.actions;

export default productSlice.reducer;
