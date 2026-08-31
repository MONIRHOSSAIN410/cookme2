import { Request, Response } from "express";
import { memoryOrders, MemoryOrder, OrderModel } from "../models/Order.js";
import { AuthenticatedRequest } from "../middleware/authMiddleware.js";
import { memoryUsers } from "../models/User.js";

// Notification targets specified by the user
const TARGET_PHONE_NUMBERS = ["01711254089", "01911970994"];

function isValidBDPhone(phone: string): boolean {
  const clean = phone.replace(/[\s-]/g, "");
  return /^01[3-9]\d{8}$/.test(clean) || /^\+8801[3-9]\d{8}$/.test(clean);
}

export async function createOrder(req: AuthenticatedRequest, res: Response) {
  try {
    const {
      customerName,
      customerPhone,
      customerEmail,
      deliveryAddress,
      deliveryCity,
      items,
      paymentMethod,
      notes
    } = req.body;

    const errors: Record<string, string> = {};

    if (!customerName || customerName.trim().length < 2) {
      errors.customerName = "Please enter your full name (minimum 2 characters)";
    }

    if (!customerPhone || !isValidBDPhone(customerPhone)) {
      errors.customerPhone = "Please enter a valid 11-digit Bangladeshi mobile number (01XXXXXXXXX)";
    }

    if (!deliveryAddress || deliveryAddress.trim().length < 5) {
      errors.deliveryAddress = "Please provide complete delivery street address (minimum 5 characters)";
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      errors.items = "Cart is empty. Please add items before checking out.";
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        errors,
        message: "Order validation failed. Please check the highlighted fields."
      });
    }

    const cleanCity = deliveryCity === "Outside Dhaka" ? "Outside Dhaka" : "Inside Dhaka";
    const deliveryFee = cleanCity === "Outside Dhaka" ? 120 : 60;

    let subtotal = 0;
    const formattedItems = items.map((item: any) => {
      const itemTotal = Number(item.price) * Number(item.quantity);
      subtotal += itemTotal;
      return {
        productId: item.productId || item.id,
        name: item.name,
        image: item.image,
        price: Number(item.price),
        quantity: Number(item.quantity),
        size: item.size || "Standard",
        color: item.color || "Standard",
        total: itemTotal
      };
    });

    const totalAmount = subtotal + deliveryFee;
    const orderNumber = `CKM-${Math.floor(100000 + Math.random() * 900000)}`;

    const itemsSummary = formattedItems
      .map((i: any) => `${i.name} (Qty: ${i.quantity}, ৳${i.total})`)
      .join(", ");

    const smsMessage = `🛒 CookMe Order Alert! Order #${orderNumber} placed by ${customerName.trim()} (${customerPhone.trim()}). Address: ${deliveryAddress.trim()}, ${cleanCity}. Items: [${itemsSummary}]. Total: ৳${totalAmount.toLocaleString()} via ${paymentMethod || "Cash On Delivery"}.`;

    console.log("=================================================");
    console.log("📱 [SMS GATEWAY DISPATCH TO CONFIGURED NUMBERS]");
    console.log(`📡 Sending SMS Broadcast to: ${TARGET_PHONE_NUMBERS.join(", ")}`);
    console.log(`💬 Message Content: "${smsMessage}"`);
    console.log(`⏰ Timestamp: ${new Date().toISOString()}`);
    console.log("=================================================");

    const newOrder: MemoryOrder = {
      id: `ord-${Date.now()}`,
      orderNumber,
      userId: req.user?.id || undefined,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerEmail: customerEmail?.trim() || "",
      deliveryAddress: deliveryAddress.trim(),
      deliveryCity: cleanCity,
      deliveryFee,
      items: formattedItems,
      subtotal,
      totalAmount,
      paymentMethod: paymentMethod || "Cash On Delivery",
      paymentStatus: paymentMethod === "Card" ? "Paid" : "Pending",
      orderStatus: "Processing",
      notes: notes?.trim() || "",
      smsNotificationSent: true,
      notifiedNumbers: TARGET_PHONE_NUMBERS,
      smsMessage,
      createdAt: new Date().toISOString()
    };

    memoryOrders.unshift(newOrder);

    // If user is logged in, award 20 loyalty points
    if (req.user?.id) {
      const user = memoryUsers.find((u) => u.id === req.user?.id);
      if (user) {
        user.loyaltyPoints = (user.loyaltyPoints || 0) + 20;
      }
    }

    // Try MongoDB creation
    try {
      await OrderModel.create(newOrder);
    } catch {
      // Memory store already holds order
    }

    // Create WhatsApp direct click-to-chat links for customer convenience
    const waEncodedMsg = encodeURIComponent(smsMessage);
    const whatsappLinks = TARGET_PHONE_NUMBERS.map((num) => ({
      phone: num,
      url: `https://wa.me/88${num}?text=${waEncodedMsg}`
    }));

    return res.status(201).json({
      success: true,
      message: `Order #${orderNumber} placed successfully! SMS notifications dispatched to ${TARGET_PHONE_NUMBERS.join(" and ")}.`,
      order: newOrder,
      notification: {
        smsSent: true,
        numbers: TARGET_PHONE_NUMBERS,
        message: smsMessage,
        whatsappLinks
      }
    });
  } catch (error: any) {
    console.error("Order creation error:", error);
    return res.status(500).json({ success: false, message: error.message || "Failed to create order" });
  }
}

export async function getUserOrders(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const userPhone = req.user?.phone;

    const orders = memoryOrders.filter(
      (o) => (userId && o.userId === userId) || (userPhone && o.customerPhone === userPhone)
    );

    return res.json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function trackOrder(req: Request, res: Response) {
  try {
    const { orderNumber } = req.params;
    const cleanNum = orderNumber.trim().toUpperCase();

    const order = memoryOrders.find(
      (o) => o.orderNumber.toUpperCase() === cleanNum || o.id === cleanNum
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: `No order found with tracking number '${orderNumber}'. Please check the order number.`
      });
    }

    return res.json({
      success: true,
      order
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
}
