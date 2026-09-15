import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    // Product name
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 200,
    },

    // URL-friendly name
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    // Full product description
    description: {
      type: String,
      required: true,
      trim: true,
    },

    // Short description for product cards
    shortDescription: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    // Brand name
    brand: {
      type: String,
      trim: true,
    },

    // Product category
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },

    // Product images
    images: {
      type: [String],
      default: [],
    },

    // Current selling price
    price: {
      type: Number,
      required: true,
      min: 0,
    },

    // Original price, useful for showing discounts
    compareAtPrice: {
      type: Number,
      min: 0,
    },

    // Stock keeping unit
    sku: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
      index: true,
    },

    // Available quantity
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    // Average product rating
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    // Number of reviews
    reviewCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Show product in featured section
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },

    // Soft enable/disable product
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;