import { Router } from "express";
import { registerUser, loginUser, getCurrentUser, updateProfile } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect as any, getCurrentUser as any);
router.put("/profile", protect as any, updateProfile as any);

export default router;
