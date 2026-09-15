import dotenv from "dotenv"
import express from "express"
import cors from "cors";
dotenv.config({ quiet: true });
import connectDB from "./config/db"
import cookieParser from "cookie-parser";
import router from "./app/Routes/index.routes";

const app = express();


// Middleware
app.use(
    cors({
        origin: [ "http://localhost:5137" ],
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