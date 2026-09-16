import { body } from "express-validator";
import User from "../Model/user.model"

// ? ********************************************* Registers *********************************************
export const registerValidations = [
    body("name").notEmpty().withMessage("Name is required!"),
    body("email").notEmpty().withMessage("Email is required!").custom(async (value) => {
        const isExist = await User.findOne({ email: value });

        if (!isExist) {
            return true
        }

         return Promise.reject("Email already exist. Try again!")

    }),
    body("phone").notEmpty().withMessage("phone is required!"),
    body("password").notEmpty().withMessage("password is required!"),
    body("confirm_password").notEmpty().withMessage("confirm_password is required!").custom((value, { req }) => {
        const { password } = req.body

        if (password !== value) {
            return Promise.reject("Passwords must be same!")
        }
        return true;

    }),

]

// Login Validation

export const loginValidations = [
    body("email")
        .notEmpty()
        .withMessage("Email is required!")
        .isEmail()
        .withMessage("Please enter a valid email!"),

    body("password")
        .notEmpty()
        .withMessage("Password is required!"),
];

// Forgot Password

export const forgotPasswordValidations = [
    body("email")
        .notEmpty()
        .withMessage("Email is required!")
        .isEmail()
        .withMessage("Please enter a valid email!")
];

//Change Password

export const changePasswordValidations = [
    body("email")
        .notEmpty()
        .withMessage("Email is required!")
        .isEmail()
        .withMessage("Please enter a valid email!"),

    body("otp")
        .notEmpty()
        .withMessage("OTP is required!")
        .isNumeric()
        .withMessage("OTP must contain only numbers!")
        .isLength({ min: 6, max: 6 })
        .withMessage("OTP must be exactly 6 digits!"),

    body("newPassword")
        .notEmpty()
        .withMessage("New password is required!")
];