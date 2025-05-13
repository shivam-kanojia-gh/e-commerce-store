import express from "express";
import { getCoupon, validateCoupon } from "../controllers/coupon.controller";
import { protectRoute } from "../middlewares/auth.middleware";

const router = express.Router();

router
  .get("/", protectRoute, getCoupon)
  .get("/validate", protectRoute, validateCoupon);

export default router;
