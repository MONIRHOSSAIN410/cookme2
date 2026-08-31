import { Router } from "express";
import { createOrder, getUserOrders, trackOrder } from "../controllers/orderController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

// Create order (can be guest with customer details or logged in user)
router.post("/", (req, res, next) => {
  // Optional auth
  if (req.headers.authorization) {
    return (protect as any)(req, res, next);
  }
  next();
}, createOrder as any);

router.get("/user", protect as any, getUserOrders as any);
router.get("/track/:orderNumber", trackOrder);

export default router;
