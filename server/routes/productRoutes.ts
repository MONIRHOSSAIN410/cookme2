import { Router } from "express";
import {
  getProducts,
  getProductById,
  getCategories,
  addProduct,
  deleteProduct
} from "../controllers/productController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", getProducts);
router.get("/categories", getCategories);
router.get("/:id", getProductById);
router.post("/", protect as any, addProduct);
router.delete("/:id", protect as any, deleteProduct);

export default router;
