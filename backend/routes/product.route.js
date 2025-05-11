import express from "express";
import { adminRoute, protectRoute } from "../middlewares/auth.middleware.js";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getFeaturedProducts,
  getProductsByCategory,
  getRecommendedProducts,
  toggleFeaturedProduct,
} from "../controllers/product.controller.js";

const router = express.Router();

router
  .get("/", protectRoute, adminRoute, getAllProducts)
  .get("/featured", getFeaturedProducts)
  .get("/recommendations", getRecommendedProducts)
  .get("/category/:category", getProductsByCategory)
  .post("/", protectRoute, adminRoute, createProduct)
  .patch("/:id", protectRoute, adminRoute, toggleFeaturedProduct)
  .delete("/:id", protectRoute, adminRoute, deleteProduct);

export default router;
