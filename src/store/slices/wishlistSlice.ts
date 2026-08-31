import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "../../types";

interface WishlistState {
  items: Product[];
}

const savedWishlist = localStorage.getItem("cookme_wishlist");
const initialWishlist: Product[] = savedWishlist ? JSON.parse(savedWishlist) : [];

const initialState: WishlistState = {
  items: initialWishlist,
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    toggleWishlist: (state, action: PayloadAction<Product>) => {
      const exists = state.items.some((item) => item.id === action.payload.id);
      if (exists) {
        state.items = state.items.filter((item) => item.id !== action.payload.id);
      } else {
        state.items.push(action.payload);
      }
      localStorage.setItem("cookme_wishlist", JSON.stringify(state.items));
    },
    removeFromWishlist: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      localStorage.setItem("cookme_wishlist", JSON.stringify(state.items));
    },
    clearWishlist: (state) => {
      state.items = [];
      localStorage.removeItem("cookme_wishlist");
    },
  },
});

export const { toggleWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
