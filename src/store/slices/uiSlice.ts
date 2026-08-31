import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Order, Product } from "../../types";

export interface AIMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
  suggestedProducts?: Product[];
}

interface UiState {
  isAuthModalOpen: boolean;
  authMode: 'signin' | 'signup';
  isCartDrawerOpen: boolean;
  isCheckoutModalOpen: boolean;
  isQuickViewOpen: boolean;
  isAIChatOpen: boolean;
  isAITyping: boolean;
  aiMessages: AIMessage[];
  isOrderSuccessOpen: boolean;
  lastOrder: Order | null;
  notificationData: {
    smsSent: boolean;
    numbers: string[];
    message: string;
    whatsappLinks: { phone: string; url: string }[];
  } | null;
  toast: { show: boolean; message: string; type: 'success' | 'info' | 'error' };
}

const initialAIMessages: AIMessage[] = [
  {
    id: "welcome-ai",
    sender: "ai",
    text: "👋 Welcome to CookMe! I'm your AI Shopping Stylist. I can recommend outfits, check sizing, verify discounts, and help you place orders with instant SMS notifications to 01711254089 / 01911970994. What are you looking for today?",
    timestamp: "Just now",
  },
];

const initialState: UiState = {
  isAuthModalOpen: false,
  authMode: "signin",
  isCartDrawerOpen: false,
  isCheckoutModalOpen: false,
  isQuickViewOpen: false,
  isAIChatOpen: false,
  isAITyping: false,
  aiMessages: initialAIMessages,
  isOrderSuccessOpen: false,
  lastOrder: null,
  notificationData: null,
  toast: { show: false, message: "", type: "info" },
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    openAuthModal: (state, action: PayloadAction<'signin' | 'signup' | undefined>) => {
      state.isAuthModalOpen = true;
      if (action.payload) state.authMode = action.payload;
    },
    closeAuthModal: (state) => {
      state.isAuthModalOpen = false;
    },
    setAuthMode: (state, action: PayloadAction<'signin' | 'signup'>) => {
      state.authMode = action.payload;
    },
    toggleCartDrawer: (state) => {
      state.isCartDrawerOpen = !state.isCartDrawerOpen;
    },
    openCartDrawer: (state) => {
      state.isCartDrawerOpen = true;
    },
    closeCartDrawer: (state) => {
      state.isCartDrawerOpen = false;
    },
    openCheckoutModal: (state) => {
      state.isCheckoutModalOpen = true;
      state.isCartDrawerOpen = false;
    },
    closeCheckoutModal: (state) => {
      state.isCheckoutModalOpen = false;
    },
    openQuickView: (state) => {
      state.isQuickViewOpen = true;
    },
    closeQuickView: (state) => {
      state.isQuickViewOpen = false;
    },
    toggleAIChat: (state) => {
      state.isAIChatOpen = !state.isAIChatOpen;
    },
    openAIChat: (state) => {
      state.isAIChatOpen = true;
    },
    closeAIChat: (state) => {
      state.isAIChatOpen = false;
    },
    addAIMessage: (state, action: PayloadAction<AIMessage>) => {
      state.aiMessages.push(action.payload);
    },
    setAITyping: (state, action: PayloadAction<boolean>) => {
      state.isAITyping = action.payload;
    },
    openOrderSuccess: (
      state,
      action: PayloadAction<{
        order: Order;
        notification: {
          smsSent: boolean;
          numbers: string[];
          message: string;
          whatsappLinks: { phone: string; url: string }[];
        };
      }>
    ) => {
      state.isOrderSuccessOpen = true;
      state.isCheckoutModalOpen = false;
      state.lastOrder = action.payload.order;
      state.notificationData = action.payload.notification;
    },
    closeOrderSuccess: (state) => {
      state.isOrderSuccessOpen = false;
    },
    showToast: (
      state,
      action: PayloadAction<{ message: string; type?: 'success' | 'info' | 'error' }>
    ) => {
      state.toast = {
        show: true,
        message: action.payload.message,
        type: action.payload.type || "success",
      };
    },
    hideToast: (state) => {
      state.toast.show = false;
    },
  },
});

export const {
  openAuthModal,
  closeAuthModal,
  setAuthMode,
  toggleCartDrawer,
  openCartDrawer,
  closeCartDrawer,
  openCheckoutModal,
  closeCheckoutModal,
  openQuickView,
  closeQuickView,
  toggleAIChat,
  openAIChat,
  closeAIChat,
  addAIMessage,
  setAITyping,
  openOrderSuccess,
  closeOrderSuccess,
  showToast,
  hideToast,
} = uiSlice.actions;

export const toggleAiChat = toggleAIChat;
export const openAiChat = openAIChat;
export const closeAiChat = closeAIChat;

export default uiSlice.reducer;
