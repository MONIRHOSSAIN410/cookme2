export interface Product {
  id: string;
  name: string;
  slug: string;
  category: 'Men' | 'Women' | 'Kids' | 'Footwear' | 'Accessories';
  price: number;
  originalPrice: number;
  discountPercent: number;
  badge?: 'OFFER' | 'HOT' | 'NEW';
  image: string;
  gallery: string[];
  description: string;
  details: string;
  sizes: string[];
  colors: { name: string; hex: string; image?: string }[];
  stock: number;
  rating: number;
  reviewsCount: number;
  isFeatured?: boolean;
  isBestDeal?: boolean;
  isFlashSale?: boolean;
  isTrending?: boolean;
  isNewArrival?: boolean;
  isTopRated?: boolean;
  isBestSeller?: boolean;
  tags: string[];
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
  total: number;
}

export interface UserAddress {
  id: string;
  label: string;
  street: string;
  city: string;
  district: string;
  phone: string;
  isDefault: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  loyaltyPoints: number;
  addresses: UserAddress[];
}

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryAddress: string;
  deliveryCity: string;
  deliveryFee: number;
  items: {
    productId: string;
    name: string;
    image: string;
    price: number;
    quantity: number;
    size?: string;
    color?: string;
    total: number;
  }[];
  subtotal: number;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  notes?: string;
  smsNotificationSent: boolean;
  notifiedNumbers: string[];
  smsMessage: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  itemCount: number;
  iconColor: string;
  image: string;
}

export interface AiChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  recommendedProducts?: Product[];
}
