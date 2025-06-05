import express from "express";
import { getCoupon, validateCoupon } from "../controllers/coupon.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

router
  .get("/", protectRoute, getCoupon)
  .post("/validate", protectRoute, validateCoupon);

export default router;
