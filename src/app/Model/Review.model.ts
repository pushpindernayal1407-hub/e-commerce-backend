import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    title: {
      type: String,
      trim: true,
      maxlength: 150,
    },

    comment: {
      type: String,
      trim: true,
      maxlength: 1000,
    },

    images: {
      type: [String],
      default: [],
    },

    isVerifiedPurchase: {
      type: Boolean,
      default: false,
    },

    isApproved: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// One user can review a product only once
reviewSchema.index(
  { user: 1, product: 1 },
  { unique: true }
);

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
