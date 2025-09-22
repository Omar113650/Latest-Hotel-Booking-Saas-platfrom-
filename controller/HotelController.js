import AsyncHandler from "express-async-handler";
import { User } from "../model/user.js";
import { Hotel } from "../model/Hotel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cloudinaryUploadMultiple } from "../utils/Cloudinary.js";
import { sendEmail } from "../utils/emailServices.js";
import ApiResponse from "../utils/ApiResponse.js";
import AppError from "../utils/AppError.js";
import { Notification } from "../model/Notification.model.js";

// @desc    Register Hotel Owner + Create Hotel
// @route   POST /api/v1/register
// @access  Public
export const RegisterHotelOwner = AsyncHandler(async (req, res, next) => {
  const {
    Name,
    Email,
    Phone,
    Country,
    UserName,
    Password,
    hotelName,
    registrationNo,
    address,
    facilities,
  } = req.body;

  if (
    !Name ||
    !Email ||
    !Phone ||
    !Country ||
    !UserName ||
    !Password ||
    !hotelName ||
    !registrationNo ||
    !address
  ) {
    return next(new AppError("All fields are required", 400));
  }

  const existingEmail = await User.findOne({ Email });
  if (existingEmail) {
    return next(new AppError("Email already exists", 409));
  }

  const hashPassword = await bcrypt.hash(Password, 10);

  const newOwner = await User.create({
    Name,
    Email,
    Phone,
    Country,
    UserName,
    Password: hashPassword,
    role: "Hotel Owner",
  });

  const uploadedImages = await cloudinaryUploadMultiple(
    req.files?.["hotelImages"]
  );
  const parsedFacilities = facilities ? JSON.parse(facilities) : [];
  const uploadedDocs = await cloudinaryUploadMultiple(req.files?.["documents"]);

  const mappedDocuments = uploadedDocs.map((doc) => ({
    type: "image",
    content: doc.url,
    publicId: doc.publicId,
  }));

  const newHotel = await Hotel.create({
    user: newOwner._id,
    hotelName,
    registrationNo,
    address,
    facilities: parsedFacilities,
    images: uploadedImages.map((img) => ({
      url: img.url,
      publicId: img.publicId,
    })),
    documents: mappedDocuments,
  });

  const accessToken = jwt.sign(
    { id: newOwner._id, role: newOwner.role },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );

  await sendEmail({
    to: newOwner.Email,
    subject: "Welcome to Hotel-Book 🎉",
    text: `Hello ${newOwner.Name}, your account has been created successfully! 🎉`,
    html: `<div style="font-family: Arial, sans-serif; background-color:#f4f4f4; padding:20px; text-align:center;">
      <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:10px; padding:30px; box-shadow:0 4px 12px rgba(0,0,0,0.1);">
        <h2 style="color:#2c3e50;">Welcome, ${newOwner.Name} 👋</h2>
        <p style="font-size:16px; color:#555;">
          We're excited to have you join <strong style="color:#3498db;">Hotel-Book</strong>.
        </p>
        <p style="font-size:15px; color:#333; line-height:1.6;">
          You can now log in and start managing your hotel bookings with ease.  
          <br><br>
          <a href="https://hotel-book.com/login" 
             style="display:inline-block; padding:12px 24px; margin-top:15px; background:#3498db; color:#fff; text-decoration:none; border-radius:6px; font-weight:bold;">
            Go to Dashboard
          </a>
        </p>
        <hr style="margin:30px 0; border:none; border-top:1px solid #eee;">
        <p style="font-size:13px; color:#999;">
          © ${new Date().getFullYear()} Hotel-Book. All rights reserved.
        </p>
      </div>
    </div>`,
  });

  if (newHotel) {
    const adminUser = await User.findOne({ role: "Admin" });
    if (!adminUser) {
      console.warn("No admin user found to notify!");
    } else {
      const notification = await Notification.create({
        user: adminUser._id,
        title: "طلب إضافة فندق جديد",
        message: `قام المستخدم "${newOwner.Name}" بتسجيل فندق جديد باسم "${newHotel.hotelName}". يرجى مراجعة الطلب واتخاذ الإجراء المناسب (الموافقة أو الرفض).`,
        isRead: false,
      });

      if (global.io) {
        global.io
          .to(adminUser._id.toString())
          .emit("notification", notification);
      }
    }
  }

  res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { owner: newOwner, hotel: newHotel, accessToken },
        "Hotel Owner & Hotel registered successfully"
      )
    );
});

// @desc    Login user
// @route   POST /api/v1/login
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

  await sendEmail({
    to: user.Email,
    subject: "Welcome Back to Hotel-Book 🎉",
    text: `Hello ${user.Name}, you have logged in successfully! 👋`,
    html: `<div style="font-family: Arial, sans-serif; padding:20px;">
      <h2 style="color:#2c3e50;">Welcome Back, ${user.Name} 👋</h2>
      <p style="font-size:16px; color:#555;">
        We're happy to see you again on <strong>Hotel-Book</strong>.
      </p>
      <p style="font-size:15px; color:#333;">
        You can now continue managing your hotels and bookings.
      </p>
    </div>`,
  });

  const accessToken = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.cookie("AccessToken", accessToken, {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    maxAge: 15 * 60 * 1000,
  });

  res.cookie("RefreshToken", refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res
    .status(200)
    .json(new ApiResponse(200, { user, accessToken }, "Login successful"));
});
