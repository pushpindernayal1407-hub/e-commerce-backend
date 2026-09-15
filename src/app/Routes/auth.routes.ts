import express from "express";
import {
    signup,
    login,
    forgotPassword,
    changePassword,
    refreshToken,
    logout
} from "../Controllers/Auth.controllers";

const router = express.Router();



//router.get("/test", (_req, res) => {
   // res.json({
       // success: true,
      //  message: "Auth routes are working"
   // });
//});

router.post("/signup", signup);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/change-password", changePassword);
router.post("/refresh-token", refreshToken);
router.post("/logout", logout);

export default router;