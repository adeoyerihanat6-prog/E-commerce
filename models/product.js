import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
    },
    image: {
      type: String, // Stores the Cloudinary image URL
      required: [true, "Product image URL is required"],
    },
    category: {
      type: String,
      required: false, // Useful if you want to filter products on the frontend
      trim: true,
      default: "Uncategorized",
    },
    countInStock: {
      type: Number,
      required: false,
      min: [0, "Stock cannot be negative"],
      default: 0,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;