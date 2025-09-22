import AsyncHandler from "express-async-handler";
import { User } from "../model/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import ApiResponse from "../utils/ApiResponse.js";
import AppError from "../utils/AppError.js";
import "../config/passport.js";

const generateTokens = (userId) => {
  const accessToken = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign(
    { id: userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );

  return { accessToken, refreshToken };
};

const setRefreshCookie = (res, refreshToken) => {
  res.cookie("RefreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

// @desc    Register a new user
// @route   POST /api/v1/auth/register
// @access  Public
export const Register = AsyncHandler(async (req, res, next) => {
  const { Name, Email, Phone, Country, UserName, Password, role } = req.body;

  if (!Name || !Email || !Phone || !Country || !UserName || !Password) {
    return next(new AppError("All fields are required", 400));
  }

  const existingEmail = await User.findOne({ Email });
  if (existingEmail) {
    return next(new AppError("Email already exists", 409));
  }

  const hashPassword = await bcrypt.hash(Password, 10);

  const newUser = await User.create({
    Name,
    Email,
    Phone,
    Country,
    UserName,
    Password: hashPassword,
    role,
  });

  const { accessToken, refreshToken } = generateTokens(newUser._id);
  setRefreshCookie(res, refreshToken);

  res.status(201).json(
    new ApiResponse(
      201,
      {
        id: newUser._id,
        Name: newUser.Name,
        Email: newUser.Email,
        Phone: newUser.Phone,
        Country: newUser.Country,
        UserName: newUser.UserName,
        role: newUser.role,
        accessToken,
        refreshToken,
      },
      "User registered successfully"
    )
  );
});

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
export const Login = AsyncHandler(async (req, res, next) => {
  const { UserName, Password } = req.body;

  if (!UserName || !Password) {
    return next(new AppError("UserName and Password are required", 400));
  }

  const user = await User.findOne({ UserName });
  if (!user) {
    return next(new AppError("User not found", 404));
  }

  const isMatch = await bcrypt.compare(Password, user.Password);
  if (!isMatch) {
    return next(new AppError("Invalid credentials", 401));
  }

  const { accessToken, refreshToken } = generateTokens(user._id);
  setRefreshCookie(res, refreshToken);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        id: user._id,
        Name: user.Name,
        Email: user.Email,
        Phone: user.Phone,
        Country: user.Country,
        UserName: user.UserName,
        role: user.role,
        accessToken,
        refreshToken,
      },
      "Login successful"
    )
  );
});

// @desc    Logout user
// @route   POST /api/v1/auth/logout
// @access  Private
export const Logout = AsyncHandler(async (req, res) => {
  res.clearCookie("AccessToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.clearCookie("RefreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.status(200).json(new ApiResponse(200, null, "Logged out successfully"));
});

// @desc    Google callback
export const googleCallbackController = (req, res) => {
  const user = req.User;
  if (!user) {
    return res.status(401).json({ message: "Login failed" });
  }

  const token = jwt.sign({ Email: user.Email }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  return res.redirect(`${process.env.CLIENT_URL}/login/success?token=${token}`);
};

// @desc    Refresh access token
// @route   POST /api/v1/auth/refresh
// @access  Public
export const RefreshToken = AsyncHandler(async (req, res, next) => {
  const refreshToken = req.cookies.RefreshToken || req.body.refreshToken;

  if (!refreshToken) {
    return next(new AppError("No refresh token provided", 401));
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      return next(new AppError("User not found", 404));
    }

    const { accessToken } = generateTokens(user._id);

    res.cookie("AccessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { accessToken },
          "Access token refreshed successfully"
        )
      );
  } catch (err) {
    console.error("Refresh error:", err);
    return next(new AppError("Invalid or expired refresh token", 401));
  }
});
