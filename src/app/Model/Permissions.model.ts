import mongoose from "mongoose";

const permissionSchema = new mongoose.Schema(
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

    resource: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    action: {
      type: String,
      required: true,
      trim: true,
      enum: ["create", "read", "update", "delete"],
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

const Permission = mongoose.model("Permission", permissionSchema);

module.exports = Permission;
