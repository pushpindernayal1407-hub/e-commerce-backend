import mongoose from "mongoose";

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },

    description: {
      type: String,
      trim: true,
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

const Role = mongoose.model("Role", roleSchema);

module.exports = Role;
