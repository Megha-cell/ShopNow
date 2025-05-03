import Cart from "../models/Cart.js";
import express from "express";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
//addtoCart
router.post("/", protect, async (req, res) => {
  try {
    //console.log("USER_ID", req.user._id);
    const { product, quantity } = req.body;
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, cartItems: [] });
    }
    const itemIndex = cart.cartItems.findIndex((item) => {
      return item.product.toString() === product;
    });

    //console.log(itemIndex);
    if (itemIndex > -1) {
      cart.cartItems[itemIndex].quantity += quantity;
    } else {
      cart.cartItems.push({ product, quantity });
    }
    await cart.save();
    res
      .status(200)
      .json({ success: true, message: "Item added to Cart", cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

//GetCart

router.get("/", protect, async (req, res) => {
  try {
    // const cart = await Cart.findOne({ user: req.user._id }).populate(
    //   "cartItems.product",
    //   "name price"
    // );
    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "cartItems.product",
      "name price"
    );

    // Remove cartItems where product is null
    cart.cartItems = cart.cartItems.filter((item) => item.product !== null);

    // Optional: save the cleaned cart back to DB
    await cart.save();

    res.status(200).json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
// In cartRoutes.js
router.delete("/clear", protect, async (req, res) => {
  await Cart.findOneAndUpdate({ user: req.user._id }, { cartItems: [] });
  res.json({ success: true, message: "Cart cleared" });
});

export default router;

//Remove from cart
router.delete("/:productId", protect, async (req, res) => {
  try {
    const { productId } = req.params;
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }
    cart.cartItems = cart.cartItems.filter((item) => {
      return item.product.toString() !== productId;
    });

    await cart.save();
    res
      .status(200)
      .json({ success: true, message: "Item removed from cart", cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
