import express from "express";
import {
  Register,
  Login,
  Logout,
  RefreshToken,
} from "../controller/AuthController.js";
import {
  googleLogin,
  googleCallback,
  // githubLogin,
  // githubCallback,
  // microsoftLogin,
  // microsoftCallback,
} from "../controller/OAuthController.js";
import { validate } from "../middleware/Vaildate.js";
import { UserValidate } from "../Validation/UserValidation.js";
import passport from "../config/passport.js";

const router = express.Router();

router.post("/register", validate(UserValidate), Register);

router.post("/login", Login);

router.post("/logout", Logout);

router.post("/refresh", RefreshToken);

// Google OAuth

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  }),
  googleLogin
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login/failed",
    session: false,
  }),
  (req, res) => {
    res.send("Login successful ");
  },
  googleCallback
);

// http://localhost:8000/api/v1/Auth/google

// GitHub OAuth
// router.get("/github", githubLogin);
// router.get("/github/callback", githubCallback);

// // Microsoft OAuth
// router.get("/microsoft", microsoftLogin);
// router.get("/microsoft/callback", microsoftCallback);

export default router;
