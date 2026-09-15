import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        // ==================== PROFILE ====================

        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 100,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },

        phone: {
            type: String,
            trim: true,
        },

        avatar: {
            type: String,
        },

     addresses: [
  {
    fullName: {
                type: String,
                trim: true,
    },
    phone: {
                 type: String,
                 trim: true,
    },
    label: {
                 type: String,
                 enum: ["home", "work", "other"],
                 default: "home",
    },
    street: {
                type: String,
                trim: true,
    },
    city: {
                type: String,
                trim: true,
    },
    state: {
                type: String,
                trim: true,
    },
    postalCode: {
                type: String,
                trim: true,
    },
    country: {
                type: String,
                trim: true,
                default: "India",
    },
     landmark: {
                type: String,
                trim: true,
    },
    isDefault: {
                type: Boolean,
                default: false,
    },
  },
],

    dateOfBirth: {
                type: Date,
},

    gender: {
                 type: String,
                 enum: ["male", "female", "other", "prefer_not_to_say"],
},

    role: {
               type: String,
               enum: ["user", "admin"],
               default: "user",
    },

        // ==================== AUTHENTICATION ====================

        password: {
            type: String,
            required: true,
            minlength: 8,
            select: false,
        },

        isEmailVerified: {
            type: Boolean,
            default: false,
        },

        lastLoginAt: {
            type: Date,
        },

        resetPasswordOtp: {
            type: String,
            select: false,
        },

        resetPasswordOtpExpires: {
            type: Date,
            select: false,
        },


        // ==================== ACCOUNT ====================

        isActive: {
            type: Boolean,
            default: false,
        },
    },

    {
        timestamps: true,
    }
);

const User = mongoose.model("User", userSchema);

export default User;