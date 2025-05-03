import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    category: { type: String, required: true },
    imageUrl: { type: String, required: true }, // Add image URL field
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Seller reference
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
