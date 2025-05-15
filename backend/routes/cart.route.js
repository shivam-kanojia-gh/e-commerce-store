import express from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { addToCart, getCartItems, removeAllFromCart, updateQuantity } from "../controllers/cart.controller.js";

const router = express.Router();

router
  .get("/", protectRoute, getCartItems)
  .post("/", protectRoute, addToCart)
  .put("/:id", protectRoute, updateQuantity)
  .delete("/", protectRoute, removeAllFromCart);

export default router;
