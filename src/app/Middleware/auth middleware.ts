import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "Access token is required"
            });
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Invalid authorization header"
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_ACCESS_SECRET as string
        ) as { userId: string };

        req.user = decoded.userId;

        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired access token"
        });
    }
};