import dotenv from "dotenv"
import express from "express"
import cors from "cors";
dotenv.config({
    path: "/home/pushpinder/projects/e-commerce/backend/.env"
});
//dotenv.config({ quiet: true });
console.log("ACCESS SECRET EXISTS:", !!process.env.JWT_ACCESS_SECRET);
console.log("REFRESH SECRET EXISTS:", !!process.env.JWT_REFRESH_SECRET);
import connectDB from "./config/db"
import cookieParser from "cookie-parser";
import router from "./app/Routes/index.routes";

const app = express();


// Middleware
app.use(
    cors({
        origin:  "http://localhost:5173" ,
        credentials: true,
        allowedHeaders:[
            "Authorization",
            "Content-Type"
        ],
       methods: [
        "GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"
       ]
    })
);
app.use(cookieParser());
app.use(express.urlencoded({ extended: true, limit: "5mb" }))
app.use(express.json({ limit: "5mb" }));

//  routes
app.use("/api/v1", router);

const PORT = process.env.NODE_APP_PORT || 8000;



app.listen(PORT, async () => {
    await connectDB()
    console.log(`Compiled successfully on ${PORT}`);
})