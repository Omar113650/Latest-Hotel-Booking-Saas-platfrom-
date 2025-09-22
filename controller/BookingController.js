import AsyncHandler from "express-async-handler";
import { Hotel } from "../model/Hotel.js";
import { Booking } from "../model/Booking.js";
import ApiResponse from "../utils/ApiResponse.js";
import AppError from "../utils/AppError.js";
import { Notification } from "../model/Notification.model.js";

// @desc    Book a hotel
// @route   POST /api/v1/bookings/:id
// @access  Private (Customer)
export const BookHotel = AsyncHandler(async (req, res, next) => {
  const { checkIn, checkOut } = req.body;
  const userId = req.user?.id;
  const hotelId = req.params.id;

  if (!userId) {
    return next(new AppError("Unauthorized, user not found", 401));
  }

  const hotel = await Hotel.findById(hotelId).populate("user");
  if (!hotel) {
    return next(new AppError("Hotel not found", 404));
  }

  const days = Math.ceil(
    (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)
  );
  if (days <= 0) {
    return next(new AppError("Invalid date range", 400));
  }

  const totalPrice = days * hotel.pricePerDay;

  const booking = await Booking.create({
    user: userId,
    hotel: hotel._id,
    checkIn,
    checkOut,
    pricePerDay: hotel.pricePerDay,
    totalPrice,
    status: "Pending",
  });

  if (hotel.user && hotel.user.role === "Hotel Owner") {
    const notification = await Notification.create({
      user: hotel.user._id,
      title: "إشعار حجز جديد",
      message: `جالك حجز جديد على فندق "${hotel.hotelName}".`,
      bookingId: booking._id,
      isRead: false,
      data: { hotelId: hotel._id, bookingId: booking._id },
    });

    if (global.io) {
      global.io
        .to(hotel.user._id.toString())
        .emit("notification", notification);
    }
  } else {
    console.warn(
      `Hotel ${hotel._id} has no owner assigned or role is not Hotel Owner!`
    );
  }

  res
    .status(201)
    .json(
      new ApiResponse(
        201,
        booking,
        "Hotel booked successfully, Hotel Owner notified"
      )
    );
});
