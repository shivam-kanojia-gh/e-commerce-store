import express from "express";
import cookieParser from "cookie-parser";

import { connectDB } from "./lib/db.js";

// routes
import authRouter from "./routes/auth.route.js";
import productRouter from "./routes/product.route.js";
import cartRoutes from "./routes/cart.route.js";
import couponRoutes from "./routes/coupon.route.js";
import paymentRoutes from "./routes/payment.route.js";
import analyticsRoutes from "./routes/analytics.route.js";

import "dotenv/config";

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json()); // parse json
app.use(cookieParser()); // parse cookies

app.use("/api/auth", authRouter);
app.use("/api/products", productRouter);
app.use("/api/cart", cartRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/analytics", analyticsRoutes);

app.listen(PORT, () => {
  console.log("Server is running on http://localhost:" + PORT);
  connectDB();
});
