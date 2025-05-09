import express from "express";
import "dotenv/config";
import authRouter from "./routes/auth.route.js";

const PORT = process.env.PORT || 3000;

const app = express();

app.use("/api/auth", authRouter);

app.listen(PORT, () => {
  console.log("Server is running on http://localhost:" + PORT);
});
