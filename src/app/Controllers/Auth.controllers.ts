import { Request, Response } from "express";
import User from "../Model/user.model";
import RefreshToken from "../Model/RefreshToken.model";
import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";


// ==================== SIGNUP ====================

export const signup = async (req: Request, res: Response) => {
    try {
        const { name, email, phone, password } = req.body;

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await User.create({
            name,
            email,
            phone,
            password: hashedPassword
        });

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone
            }
        });

    } catch (error) {
        console.log("SIGNUP ERROR", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
};


// ==================== LOGIN ====================

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User
            .findOne({ email })
            .select("+password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Compare password
        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }


        // ==================== ACCESS TOKEN ====================

        const accessToken = jwt.sign(
            {
                userId: user._id.toString()
            },
            process.env.JWT_ACCESS_SECRET as string,
            {
                expiresIn: "15m"
            }
        );


        // ==================== REFRESH TOKEN ====================

        const refreshToken = jwt.sign(
            {
                userId: user._id.toString()
            },
            process.env.JWT_REFRESH_SECRET as string,
            {
                expiresIn: "7d"
            }
        );


        // Hash refresh token before storing in database
        const tokenHash = crypto
            .createHash("sha256")
            .update(refreshToken)
            .digest("hex");


        // Save refresh token record in MongoDB
        await RefreshToken.create({
            userId: user._id,
            tokenHash,
            expiresAt: new Date(
                Date.now() + 7 * 24 * 60 * 60 * 1000
            )
        });


        // Store refresh token in HTTP-only cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });


        // Login successful
        return res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                accessToken
            }
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
};


// ==================== FORGOT PASSWORD ====================

export const forgotPassword = async (
    req: Request,
    res: Response
) => {
    try {
        const { email } = req.body;

       

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }


        // Generate 6-digit OTP
        const otp = crypto
            .randomInt(100000, 1000000)
            .toString();


        // Hash OTP before storing
        const hashedOtp = crypto
            .createHash("sha256")
            .update(otp)
            .digest("hex");


        user.resetPasswordOtp = hashedOtp;


        // OTP expires in 10 minutes
        user.resetPasswordOtpExpires =
            new Date(Date.now() + 10 * 60 * 1000);


        await user.save();


        return res.status(200).json({
            success: true,
            message: "OTP sent successfully"
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
};


// ==================== CHANGE PASSWORD ====================

export const changePassword = async (
    req: Request,
    res: Response
) => {
    try {
        const { email, otp, newPassword } = req.body;



        // Hash the OTP entered by the user
        const hashedOtp = crypto
            .createHash("sha256")
            .update(otp)
            .digest("hex");


        // Find user with valid OTP
        const user = await User
            .findOne({
                email,
                resetPasswordOtp: hashedOtp,
                resetPasswordOtpExpires: {
                    $gt: new Date()
                }
            })
            .select(
                "+resetPasswordOtp +resetPasswordOtpExpires"
            );


        // Check OTP
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired OTP"
            });
        }


        // Hash new password
        const hashedPassword = await bcrypt.hash(
            newPassword,
            10
        );


        // Update password
        user.password = hashedPassword;


        // Remove OTP after use
        user.resetPasswordOtp = undefined;
        user.resetPasswordOtpExpires = undefined;


        await user.save();


        return res.status(200).json({
            success: true,
            message: "Password changed successfully"
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
};


// ==================== REFRESH TOKEN ====================

export const refreshToken = async (
    req: Request,
    res: Response
) => {
    try {
        // Get refresh token from cookie
        const refreshToken = req.cookies.refreshToken;


        if (!refreshToken) {
            return res.status(401).json({
                success: false,
                message: "Refresh token is required"
            });
        }


        // Hash the refresh token
        const tokenHash = crypto
            .createHash("sha256")
            .update(refreshToken)
            .digest("hex");


        // Find token in database
        const storedToken = await RefreshToken.findOne({
            tokenHash,
            revoked: false,
            expiresAt: {
                $gt: new Date()
            }
        });


        if (!storedToken) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired refresh token"
            });
        }


        // Verify JWT
        const decoded = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET as string
        ) as { userId: string };


        // Create new access token
        const newAccessToken = jwt.sign(
            {
                userId: decoded.userId
            },
            process.env.JWT_ACCESS_SECRET as string,
            {
                expiresIn: "15m"
            }
        );


        return res.status(200).json({
            success: true,
            message: "Access token refreshed",
            accessToken: newAccessToken
        });

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired refresh token"
        });
    }
};


// ==================== LOGOUT ====================

export const logout = async (
    req: Request,
    res: Response
) => {
    try {
        // Get refresh token from cookie
        const refreshToken = req.cookies.refreshToken;


        // If refresh token exists
        if (refreshToken) {

            // Hash refresh token
            const tokenHash = crypto
                .createHash("sha256")
                .update(refreshToken)
                .digest("hex");


            // Revoke refresh token
            await RefreshToken.findOneAndUpdate(
                { tokenHash },
                {
                    revoked: true
                }
            );
        }


        // Clear refresh token cookie
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict"
        });


        return res.status(200).json({
            success: true,
            message: "Logout successful"
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
};