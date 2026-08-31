import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartItem, Product } from "../../types";

interface CartState {
  items: CartItem[];
  deliveryCity: 'Inside Dhaka' | 'Outside Dhaka';
  deliveryFee: number;
  subtotal: number;
  totalAmount: number;
  totalItems: number;
}

const savedCart = localStorage.getItem("cookme_cart");
const initialItems: CartItem[] = savedCart ? JSON.parse(savedCart) : [
  // Optional pre-seed for immediate instant feedback matching screenshots
];

const calculateTotals = (items: CartItem[], deliveryCity: 'Inside Dhaka' | 'Outside Dhaka') => {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const deliveryFee = deliveryCity === "Outside Dhaka" ? 120 : 60;
  const totalAmount = subtotal > 0 ? subtotal + deliveryFee : 0;
  return { subtotal, totalItems, deliveryFee, totalAmount };
};

const initialCalculations = calculateTotals(initialItems, "Inside Dhaka");

const initialState: CartState = {
  items: initialItems,
  deliveryCity: "Inside Dhaka",
  deliveryFee: initialCalculations.deliveryFee,
  subtotal: initialCalculations.subtotal,
  totalAmount: initialCalculations.totalAmount,
  totalItems: initialCalculations.totalItems,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (
      state,
      action: PayloadAction<{
        product: Product;
        quantity?: number;
        size?: string;
        color?: string;
      }>
    ) => {
      const { product, quantity = 1, size = "Standard", color = "Standard" } = action.payload;
      const existingIndex = state.items.findIndex(
        (item) => item.productId === product.id && item.size === size && item.color === color
      );

      if (existingIndex > -1) {
        state.items[existingIndex].quantity += quantity;
        state.items[existingIndex].total = state.items[existingIndex].price * state.items[existingIndex].quantity;
      } else {
        const newItem: CartItem = {
          id: `cart-${product.id}-${size}-${color}-${Date.now()}`,
          productId: product.id,
          name: product.name,
          image: product.image,
          price: product.price,
          quantity,
          size,
          color,
          total: product.price * quantity,
        };
        state.items.push(newItem);
      }

      const totals = calculateTotals(state.items, state.deliveryCity);
      state.subtotal = totals.subtotal;
      state.totalItems = totals.totalItems;
      state.deliveryFee = totals.deliveryFee;
      state.totalAmount = totals.totalAmount;
      localStorage.setItem("cookme_cart", JSON.stringify(state.items));
    },

    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload && item.productId !== action.payload);
      const totals = calculateTotals(state.items, state.deliveryCity);
      state.subtotal = totals.subtotal;
      state.totalItems = totals.totalItems;
      state.deliveryFee = totals.deliveryFee;
      state.totalAmount = totals.totalAmount;
      localStorage.setItem("cookme_cart", JSON.stringify(state.items));
    },

    updateQuantity: (
      state,
      action: PayloadAction<{ id: string; quantity: number }>
    ) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((i) => i.id === id || i.productId === id);
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter((i) => i.id !== item.id);
        } else {
          item.quantity = quantity;
          item.total = item.price * quantity;
        }
      }

      const totals = calculateTotals(state.items, state.deliveryCity);
      state.subtotal = totals.subtotal;
      state.totalItems = totals.totalItems;
      state.deliveryFee = totals.deliveryFee;
      state.totalAmount = totals.totalAmount;
      localStorage.setItem("cookme_cart", JSON.stringify(state.items));
    },

    incrementQuantity: (state, action: PayloadAction<string>) => {
      const item = state.items.find((i) => i.id === action.payload || i.productId === action.payload);
      if (item) {
        item.quantity += 1;
        item.total = item.price * item.quantity;
      }
      const totals = calculateTotals(state.items, state.deliveryCity);
      state.subtotal = totals.subtotal;
      state.totalItems = totals.totalItems;
      state.deliveryFee = totals.deliveryFee;
      state.totalAmount = totals.totalAmount;
      localStorage.setItem("cookme_cart", JSON.stringify(state.items));
    },

    decrementQuantity: (state, action: PayloadAction<string>) => {
      const itemIndex = state.items.findIndex((i) => i.id === action.payload || i.productId === action.payload);
      if (itemIndex > -1) {
        if (state.items[itemIndex].quantity > 1) {
          state.items[itemIndex].quantity -= 1;
          state.items[itemIndex].total = state.items[itemIndex].price * state.items[itemIndex].quantity;
        } else {
          state.items.splice(itemIndex, 1);
        }
      }
      const totals = calculateTotals(state.items, state.deliveryCity);
      state.subtotal = totals.subtotal;
      state.totalItems = totals.totalItems;
      state.deliveryFee = totals.deliveryFee;
      state.totalAmount = totals.totalAmount;
      localStorage.setItem("cookme_cart", JSON.stringify(state.items));
    },

    setDeliveryCity: (state, action: PayloadAction<'Inside Dhaka' | 'Outside Dhaka'>) => {
      state.deliveryCity = action.payload;
      const totals = calculateTotals(state.items, action.payload);
      state.deliveryFee = totals.deliveryFee;
      state.totalAmount = totals.totalAmount;
    },

    clearCart: (state) => {
      state.items = [];
      state.subtotal = 0;
      state.totalItems = 0;
      state.totalAmount = 0;
      localStorage.removeItem("cookme_cart");
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  incrementQuantity,
  decrementQuantity,
  setDeliveryCity,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
