import express from "express";
import cookieParser from "cookie-parser";
import path from "path";

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
const __dirname = path.resolve();

const app = express();

app.use(express.json({ limit: "10mb" })); // parse json
app.use(cookieParser()); // parse cookies

app.use("/api/auth", authRouter);
app.use("/api/products", productRouter);
app.use("/api/cart", cartRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/analytics", analyticsRoutes);

// Serve static files from the React app
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));

  // Handle React routing, return all requests to React app
  app.get("/*path", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

app.listen(PORT, () => {
  console.log("Server is running on http://localhost:" + PORT);
  connectDB();
});
