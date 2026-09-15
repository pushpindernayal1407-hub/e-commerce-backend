import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      unique: true,
      index: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    provider: {
      type: String,
      enum: ["razorpay", "stripe", "cod"],
      required: true,
    },

    paymentId: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    currency: {
      type: String,
      default: "INR",
      uppercase: true,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "processing",
        "paid",
        "failed",
        "refunded",
      ],
      default: "pending",
      index: true,
    },

    failureReason: {
      type: String,
      trim: true,
    },

    paidAt: {
      type: Date,
    },

    refundedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;
