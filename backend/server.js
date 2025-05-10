import express from "express";
import "dotenv/config";
import authRouter from "./routes/auth.route.js";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json()); // parse json 
app.use(cookieParser()); // parse cookies 

app.use("/api/auth", authRouter);

app.listen(PORT, () => {
  console.log("Server is running on http://localhost:" + PORT);
  connectDB();
});
