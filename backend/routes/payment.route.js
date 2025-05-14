import express from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import {
  checkoutSuccess,
  createCheckoutSession,
} from "../controllers/payment.controller.js";

const router = express.Router();

router
  .post("/create-checkout-session", protectRoute, createCheckoutSession)
  .post("/checkout-success", protectRoute, checkoutSuccess);

export default router;
