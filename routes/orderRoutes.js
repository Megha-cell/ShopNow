import express from "express";
import Order from "../models/Order.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
//Create a order

router.post("/", protect, async (req, res) => {
  try {
    const { orderItems, totalPrice } = req.body;
    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: "No items in order" });
    }
    const order = new Order({
      user: req.user.id,
      orderItems,
      totalPrice,
    });
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Get Orders for logged-in user
router.get("/", protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate(
      "orderItems.product"
    );
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
