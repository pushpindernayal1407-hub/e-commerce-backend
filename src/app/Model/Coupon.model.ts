import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    discountType: {
      type: String,
      enum: ["percentage", "fixed"],
      required: true,
    },

    discountValue: {
      type: Number,
      required: true,
      min: 0,
    },

    // Minimum cart value required to use coupon
    minimumOrderValue: {
      type: Number,
      min: 0,
      default: 0,
    },

    // Maximum discount allowed for percentage coupons
    maximumDiscount: {
      type: Number,
      min: 0,
    },

    // Total number of times coupon can be used
    usageLimit: {
      type: Number,
      min: 1,
    },

    // Number of times coupon has already been used
    usedCount: {
      type: Number,
      min: 0,
      default: 0,
    },

    startsAt: {
      type: Date,
      required: true,
    },

    expiresAt: {
      type: Date,
      required: true,
    },

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

const Coupon = mongoose.model("Coupon", couponSchema);

module.exports = Coupon;
