import AsyncHandler from "express-async-handler";
import { Hotel } from "../model/Hotel.js";
import { User } from "../model/user.js";
import { Booking } from "../model/Booking.js";
import ApiResponse from "../utils/ApiResponse.js";
import AppError from "../utils/AppError.js";
import { Notification } from "../model/Notification.model.js";

// @desc  get All Hotels and filter by status
// @route   GET /api/v1/Admin/hotels
// @access  Private
export const getAllHotels = AsyncHandler(async (req, res, next) => {
  const { status } = req.query;
  const query = {};
  if (status) query.status = status;

  const hotels = await Hotel.find(query).populate("userDetails", "Name Email ");

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { count: hotels.length, hotels },
        "Hotels fetched successfully"
      )
    );
});

// @desc  change Hotel Status
// @route   PATCH /api/v1/Admin/hotels/:id/status
// @access  Private
export const changeHotelStatus = AsyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body; // "Approved" أو "Rejected"

  const hotel = await Hotel.findById(id).populate("userDetails");
  if (!hotel) {
    return next(new AppError("Hotel not found", 404));
  }

  hotel.status = status;
  await hotel.save();

  if (hotel.userDetails) {
    const notification = await Notification.create({
      user: hotel.userDetails._id,
      title: "تأكيد تسجيل الفندق",
      message: `تم ${
        status === "Approved" ? "الموافقة على" : "رفض"
      } تسجيل فندقك "${hotel.hotelName}"!`,
      isRead: false,
    });

    if (global.io) {
      global.io
        .to(hotel.userDetails._id.toString())
        .emit("notification", notification);
    }
  } else {
    console.warn(`Hotel ${hotel._id} has no owner assigned!`);
  }

  res
    .status(200)
    .json(new ApiResponse(200, hotel, `Hotel ${status} successfully`));
});

// @desc  get All Owners Hotel
// @route   GET /api/v1/Admin/owners
// @access  Private
export const getAllOwners = AsyncHandler(async (req, res, next) => {
  const owners = await User.find({ role: "Hotel Owner" }).select("-Password");
  if (!owners) {
    return next(AppError("not found any Hotel Owner", 404));
  }

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { count: owners.length, owners },
        "Owners fetched successfully"
      )
    );
});

// @desc  manage All Owner Hotel by Admin
// @route   PATCH /api/v1/Admin/owners/:id?action=block|delete
// @access  Private
export const manageOwner = AsyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { action } = req.query; // block | delete

  const owner = await User.findById(id);
  if (!owner || owner.role !== "Hotel Owner") {
    return next(new AppError("Hotel owner not found", 404));
  }

  if (action === "block") {
    owner.isActive = false;
    await owner.save();

    return res
      .status(200)
      .json(new ApiResponse(200, owner, "Hotel owner blocked successfully"));
  }

  if (action === "delete") {
    await owner.deleteOne();
    return res
      .status(200)
      .json(new ApiResponse(200, null, "Hotel owner deleted successfully"));
  }

  return next(new AppError("Invalid action, use block or delete", 400));
});

// @desc  get All Bookings Hotel in Application And Filter depend on Status
// @route   GET /api/v1/Admin/bookings
// @access  Private
export const getAllBookings = AsyncHandler(async (req, res, next) => {
  const { status } = req.query;
  const query = {};
  if (status) query.status = status;

  const bookings = await Booking.find(query)
    .populate("hotelDetails")
    .populate("userDetails");

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { count: bookings.length, bookings },
        "Bookings fetched successfully"
      )
    );
});

// GET /api/notifications/admin
// @route   GET /api/v1/notification/
// @access  Private
export const getAdminNotifications = AsyncHandler(async (req, res, next) => {
  const admin = await User.findOne({ role: "Admin" });
  if (!admin) return next(new AppError("Admin not found", 404));

  const notifications = await Notification.find({ user: admin._id }).sort({
    createdAt: -1,
  });

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { notifications },
        "Admin notifications fetched successfully"
      )
    );
});
