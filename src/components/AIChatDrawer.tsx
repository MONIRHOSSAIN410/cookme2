import React, { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  Send,
  X,
  Bot,
  User,
  ShoppingBag,
  ArrowRight,
  RefreshCw,
  Zap,
  Tag,
  Phone
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../store";
import {
  toggleAIChat,
  closeAIChat,
  addAIMessage,
  setAITyping,
  openQuickView,
  showToast,
} from "../store/slices/uiSlice";
import { addToCart } from "../store/slices/cartSlice";
import { setSelectedProduct } from "../store/slices/productSlice";
import { Product } from "../types";

export const AIChatDrawer: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isAIChatOpen, aiMessages, isAITyping } = useAppSelector((state) => state.ui);
  const products = useAppSelector((state) => state.products.products);

  const [inputQuery, setInputQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Smooth scroll to bottom on message change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isAIChatOpen) {
      scrollToBottom();
    }
  }, [aiMessages, isAITyping, isAIChatOpen]);

  const quickPrompts = [
    "What are the best deals under ৳1,500?",
    "Show me Men's stylish footwear",
    "How does delivery and SMS notice work?",
    "Can you recommend summer outfits?",
  ];

  const handleSendMessage = async (textToSend: string) => {
    const text = textToSend.trim();
    if (!text) return;

    // Add user message
    dispatch(
      addAIMessage({
        id: `msg-${Date.now()}`,
        sender: "user",
        text,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      })
    );

    setInputQuery("");
    dispatch(setAITyping(true));

    try {
      const history = aiMessages.map((m) => ({
        role: m.sender === "user" ? "user" : "model",
        parts: [{ text: m.text }],
      }));

      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history }),
      });

      const data = await res.json();

      if (data.success && data.reply) {
        dispatch(
          addAIMessage({
            id: `msg-${Date.now()}-ai`,
            sender: "ai",
            text: data.reply,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            suggestedProducts: data.suggestedProducts || [],
          })
        );
      } else {
        throw new Error(data.message || "Failed to get AI response");
      }
    } catch (err: any) {
      dispatch(
        addAIMessage({
          id: `msg-${Date.now()}-ai-err`,
          sender: "ai",
          text: "I'm right here to help you shop! You can check our featured collections or contact our hotline directly at 01711254089 / 01911970994.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        })
      );
    } finally {
      dispatch(setAITyping(false));
    }
  };

  const handleProductCardClick = (product: Product) => {
    dispatch(setSelectedProduct(product));
    dispatch(openQuickView());
  };

  if (!isAIChatOpen) {
    return (
      <button
        onClick={() => dispatch(toggleAIChat())}
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-full p-3.5 sm:px-5 sm:py-3.5 shadow-2xl hover:shadow-emerald-600/40 flex items-center gap-2.5 transition-all duration-300 hover:scale-105 active:scale-95 group cursor-pointer"
        title="CookMe AI Stylist"
      >
        <div className="relative">
          <Sparkles className="w-5 h-5 animate-spin" style={{ animationDuration: '4s' }} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-300 rounded-full animate-ping" />
        </div>
        <span className="hidden sm:inline font-black text-xs uppercase tracking-wider">
          AI Shopping Stylist
        </span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[92vw] sm:w-[420px] h-[580px] max-h-[85vh] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-md">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-extrabold text-sm text-white leading-tight">CookMe AI Stylist</h3>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <p className="text-[10px] text-emerald-300">Powered by Gemini AI • 24/7 Smart Recommendations</p>
          </div>
        </div>

        <button
          onClick={() => dispatch(closeAIChat())}
          className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Stream (Smooth scrolling) */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 scroll-smooth">
        {aiMessages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
          >
            <div
              className={`flex items-start gap-2 max-w-[85%] ${
                msg.sender === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                  msg.sender === "user"
                    ? "bg-slate-900 text-white"
                    : "bg-emerald-600 text-white shadow-xs"
                }`}
              >
                {msg.sender === "user" ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>

              {/* Message Bubble */}
              <div
                className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                  msg.sender === "user"
                    ? "bg-emerald-600 text-white rounded-tr-xs"
                    : "bg-white text-slate-800 border border-slate-200 rounded-tl-xs shadow-xs"
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.text}</p>
                <div
                  className={`text-[9px] mt-1.5 text-right ${
                    msg.sender === "user" ? "text-emerald-200" : "text-slate-400"
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>

            {/* Embedded Product Recommendations */}
            {msg.suggestedProducts && msg.suggestedProducts.length > 0 && (
              <div className="mt-2.5 ml-9 w-[80%] space-y-2">
                <div className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  Recommended for you
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {msg.suggestedProducts.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => handleProductCardClick(p)}
                      className="p-2.5 bg-white rounded-xl border border-slate-200 shadow-xs hover:border-emerald-500 flex items-center gap-2.5 cursor-pointer group"
                    >
                      <img src={p.image} alt={p.name} className="w-12 h-12 rounded-lg object-cover bg-slate-100" />
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-slate-900 text-xs truncate group-hover:text-emerald-600">
                          {p.name}
                        </div>
                        <div className="text-xs font-black text-emerald-700">৳{p.price.toLocaleString()}</div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          dispatch(addToCart({ product: p, quantity: 1 }));
                          dispatch(showToast({ message: `Added ${p.name} to Cart`, type: "success" }));
                        }}
                        className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white transition-colors"
                        title="Add to cart"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}

        {/* AI Typing Indicator */}
        {isAITyping && (
          <div className="flex items-center gap-2 text-slate-400 text-xs">
            <div className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="bg-white border border-slate-200 px-3 py-2 rounded-2xl rounded-tl-xs shadow-xs flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompt Pills */}
      <div className="px-3 py-2 bg-slate-50 border-t border-slate-200 overflow-x-auto flex items-center gap-1.5 scrollbar-none">
        {quickPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(prompt)}
            className="text-[10px] font-semibold text-slate-700 bg-white hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 border border-slate-200 px-2.5 py-1 rounded-full whitespace-nowrap transition-colors shadow-2xs cursor-pointer"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
        <input
          type="text"
          placeholder="Ask for dress, size, price advice..."
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage(inputQuery)}
          className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 outline-none focus:bg-white focus:border-emerald-500 transition-colors"
        />
        <button
          onClick={() => handleSendMessage(inputQuery)}
          disabled={!inputQuery.trim() || isAITyping}
          className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white shadow-xs transition-colors cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
