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
                street: {
                    type: String,
                },

                city: {
                    type: String,
                },

                state: {
                    type: String,
                },

                postalCode: {
                    type: String,
                },

                country: {
                    type: String,
                },
            },
        ],


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
            default: true,
        },
    },

    {
        timestamps: true,
    }
);

const User = mongoose.model("User", userSchema);

export default User;