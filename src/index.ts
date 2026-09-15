import dotenv from "dotenv"
import express from "express"
import cors from "cors";
dotenv.config({ quiet: true });
import connectDB from "./config/db"
import cookieParser from "cookie-parser";
import authRoutes from "./app/Routes/auth.routes";

const app = express();


// Middleware
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);
app.use(cookieParser());
app.use(express.urlencoded({ extended: true, limit: "5mb" }))
app.use(express.json({ limit: "5mb" }));

// Auth routes
app.use("/api/auth", authRoutes);

const PORT = process.env.NODE_APP_PORT || 8000;



app.listen(PORT, async () => {
    await connectDB()
    console.log(`Compiled successfully on ${PORT}`);
})