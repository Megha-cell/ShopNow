import express from "express";
import Product from "../models/Product.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

//Create a product(Only authenticated users)

router.post("/", protect, async (req, res) => {
  const { name, description, price, stock, category, imageUrl } = req.body;
  const product = new Product({
    name,
    description,
    price,
    stock,
    category,
    imageUrl,
    user: req.user._id,
  });
  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// //Get all products

// router.get("/", async (req, res) => {
//   const products = await Product.find();
//   res.json(products);
// });
router.get("/", async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice } = req.query;
    const filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ];
    }

    if (category) {
      filter.category = category;
    }

    if (minPrice && maxPrice) {
      filter.price = { $gte: Number(minPrice), $lte: Number(maxPrice) };
    } else if (minPrice) {
      filter.price = { $gte: Number(minPrice) };
    } else if (maxPrice) {
      filter.price = { $lte: Number(maxPrice) };
    }

    const products = await Product.find(filter); // filter = {} means fetch all
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Server error" });
  }
});
// GET /api/products
// Get all products with optional search
router.get("/search", async (req, res) => {
  try {
    const { search } = req.query;

    let query = {};

    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
          { category: { $regex: search, $options: "i" } },
        ],
      };
    }

    const products = await Product.find(query);
    res.status(200).json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

//Get a single product by ID

router.get("/:id", async (req, res) => {
  console.log(req.params.id);
  const product = await Product.findById(req.params.id);
  console.log(product);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: "Product not found" });
  }
});

//Update a product
router.put("/:id", protect, async (req, res) => {
  try {
    const { name, description, price, stock, category, imageUrl } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    //Update product fields
    product.name = name || product.name;
    product.price = price || product.price;
    product.description = description || product.description;
    product.price = price || product.price;
    product.stock = stock || product.stock;
    product.category = category || product.category;
    product.imageUrl = imageUrl || product.imageUrl;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Delete a product

router.delete("/:id", protect, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    await product.deleteOne();
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
