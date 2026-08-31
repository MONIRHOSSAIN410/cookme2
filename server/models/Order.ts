import mongoose, { Schema, Document } from "mongoose";

export interface IOrderItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
  total: number;
}

export interface IOrder extends Document {
  orderNumber: string;
  userId?: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryAddress: string;
  deliveryCity: 'Inside Dhaka' | 'Outside Dhaka' | string;
  deliveryFee: number;
  items: IOrderItem[];
  subtotal: number;
  totalAmount: number;
  paymentMethod: 'Cash On Delivery' | 'bKash' | 'Nagad' | 'Card';
  paymentStatus: 'Pending' | 'Paid';
  orderStatus: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  notes?: string;
  smsNotificationSent: boolean;
  notifiedNumbers: string[];
  smsMessage: string;
  createdAt: Date;
}

const OrderSchema: Schema<IOrder> = new Schema(
  {
    orderNumber: { type: String, required: true, unique: true },
    userId: { type: String },
    customerName: { type: String, required: true, trim: true },
    customerPhone: { type: String, required: true, trim: true },
    customerEmail: { type: String, trim: true },
    deliveryAddress: { type: String, required: true },
    deliveryCity: { type: String, required: true, default: 'Inside Dhaka' },
    deliveryFee: { type: Number, required: true, default: 60 },
    items: [
      {
        productId: { type: String, required: true },
        name: { type: String, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, min: 1 },
        size: { type: String },
        color: { type: String },
        total: { type: Number, required: true }
      }
    ],
    subtotal: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    paymentMethod: { type: String, enum: ['Cash On Delivery', 'bKash', 'Nagad', 'Card'], default: 'Cash On Delivery' },
    paymentStatus: { type: String, enum: ['Pending', 'Paid'], default: 'Pending' },
    orderStatus: { type: String, enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'], default: 'Pending' },
    notes: { type: String },
    smsNotificationSent: { type: Boolean, default: true },
    notifiedNumbers: [{ type: String }],
    smsMessage: { type: String }
  },
  { timestamps: true }
);

// Fallback in-memory database store
export interface MemoryOrder {
  id: string;
  orderNumber: string;
  userId?: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryAddress: string;
  deliveryCity: string;
  deliveryFee: number;
  items: IOrderItem[];
  subtotal: number;
  totalAmount: number;
  paymentMethod: 'Cash On Delivery' | 'bKash' | 'Nagad' | 'Card';
  paymentStatus: 'Pending' | 'Paid';
  orderStatus: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  notes?: string;
  smsNotificationSent: boolean;
  notifiedNumbers: string[];
  smsMessage: string;
  createdAt: string;
}

export const memoryOrders: MemoryOrder[] = [];

export const OrderModel = mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);
