import AsyncHandler from "express-async-handler";
import { Hotel } from "../model/Hotel.js";
import { Booking } from "../model/Booking.js";
import ApiResponse from "../utils/ApiResponse.js";
import AppError from "../utils/AppError.js";
import { Notification } from "../model/Notification.model.js";
// Get hotel by ID
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

// // Create booking
export const createBooking = AsyncHandler(async (req, res, next) => {
  const { hotelId, checkIn, checkOut, guests } = req.body;

  const hotel = await Hotel.findById(hotelId);
  if (!hotel) return next(new AppError("Hotel not found", 404));

  const booking = await Booking.create({
    hotel: hotelId,
    user: req.user.id,
    checkIn,
    checkOut,
    guests,
    status: "Pending",
  });

  res
    .status(201)
    .json(new ApiResponse(201, booking, "Booking created successfully"));
});

// Get bookings for hotel owner
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

// Get all bookings (filterable)
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
// @route   GET /api/notifications/
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
