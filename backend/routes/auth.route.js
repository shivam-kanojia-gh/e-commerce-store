import express from "express";
import {
  getProfile,
  login,
  logout,
  refreshAccessToken,
  signup,
} from "../controllers/auth.controller.js";

const router = express.Router();

router
  .post("/signup", signup)
  .post("/login", login)
  .post("/logout", logout)
  .post("/refresh-token", refreshAccessToken)
  // .get("/profile", protectedRoute, getProfile);

export default router;
