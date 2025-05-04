import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url"; // for ES module support
import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config(); // Load environment variables

const app = express();

// Get the __dirname for ES module support
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Allowed origins for CORS
const allowedOrigins = [
  process.env.frontend_url,
  process.env.frontend_url1,
].filter(Boolean); // removes undefined

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Enable preflight
app.options("*", cors());

// Middleware to parse JSON requests
app.use(express.json());

// Serve static files from the dist folder
app.use(express.static(path.join(__dirname, "dist")));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/users", userRoutes);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB Connection Error:", err));
// Test route for API check
app.get("/", (req, res) => res.send("API is running..."));
// Serve React app for all other routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
