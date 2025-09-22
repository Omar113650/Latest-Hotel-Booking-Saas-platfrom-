import AsyncHandler from "express-async-handler";
import { Hotel } from "../model/Hotel.js";
import { Booking } from "../model/Booking.js";
import ApiResponse from "../utils/ApiResponse.js";
import AppError from "../utils/AppError.js";
import { Notification } from "../model/Notification.model.js";

// @desc    Get getHotelById
// @route   GET /api/v1/Hotel
// @access  Private (User)
export const getHotelById = AsyncHandler(async (req, res, next) => {
  const hotel = await Hotel.findById(req.params.id).populate(
    "user",
    "Name Email"
  );

  if (!hotel || hotel.status !== "Approved") {
    return next(new AppError("Hotel not found or not approved", 404));
  }

  res
    .status(200)
    .json(new ApiResponse(200, hotel, "Hotel fetched successfully"));
});

// @desc   getHotelBookings
// @route   GET /api/getHotelBookings
// @access  Private
export const getHotelBookings = AsyncHandler(async (req, res, next) => {
  const ownerId = req.params.id;

  const hotels = await Hotel.find({ owner: ownerId }).select("_id");
  if (!hotels.length)
    return next(new AppError("No hotels found for this owner", 404));

  const bookings = await Booking.find({ hotel: { $in: hotels } })
    .populate("user", "Name Email Phone")
    .populate("hotel", "hotelName address");

  res
    .status(200)
    .json(new ApiResponse(200, bookings, "Bookings fetched successfully"));
});

// @desc   get Hotel All Booked for me and search by name and filter by status
// @route   GET /api/getHotelAllBooked
// @access  Private
export const getHotelAllBooked = AsyncHandler(async (req, res, next) => {
  const { keyword, documents, status } = req.query;
  const query = {};

  if (keyword) query.hotelName = { $regex: keyword, $options: "i" };
  if (documents) query.documents = { $regex: documents, $options: "i" };
  if (status) query.status = status;

  const bookings = await Booking.find(query)
    .populate("user", "Name Email Phone")
    .populate("hotel", "hotelName address");

  if (!bookings.length) return next(new AppError("No bookings found", 404));

  res
    .status(200)
    .json(new ApiResponse(200, bookings, "Bookings fetched successfully"));
});

// @desc    Get booking  notifications
// @route   GET /api/notifications
// @access  Private
export const getUserNotifications = AsyncHandler(async (req, res, next) => {
  const notifications = await Notification.find({
    title: "تأكيد الحجز || إلغاء الحجز",
  }).sort({ createdAt: -1 });

  if (!notifications.length) {
    return next(
      new AppError("No booking confirmation notifications found", 404)
    );
  }

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { notifications },
        "Booking confirmation notifications fetched successfully"
      )
    );
});
