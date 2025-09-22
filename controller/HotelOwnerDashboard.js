import AsyncHandler from "express-async-handler";
import { Hotel } from "../model/Hotel.js";
import { Booking } from "../model/Booking.js";
import {
  cloudinaryUploadMultiple,
  cloudinaryRemoveMultipleFiles,
} from "../utils/Cloudinary.js";
import { User } from "../model/user.js";
import { Treasureto } from "../model/TreasuretoChoose.js";
import { Notification } from "../model/Notification.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import AppError from "../utils/AppError.js";

// @desc    Get bookings for hotel owner
// @route   GET /api/v1/owner/bookings
// @access  Private (Hotel Owner)
export const getHotelBookings = AsyncHandler(async (req, res) => {
  const { sort = "createdAt" } = req.query;
  const query = {};

  const sortHotel = sort.split(" ").join("");

  const hotels = await Hotel.find(query)
    .populate("userDetails", "Name Email Phone")
    .sort(sortHotel)
    .select("_id user");

  if (!hotels.length) {
    return res
      .status(404)
      .json({ success: false, message: "No hotels found for this owner" });
  }

  const bookings = await Booking.find({ hotel: { $in: hotels } })
    .populate("userDetails", "Name Email Phone") // ✅ صححت customer → user
    .populate("hotel", "hotelName address")
    .sort(sortHotel);

  res.status(200).json({
    success: true,
    message: "Bookings fetched successfully",
    bookings,
  });
});

// @desc    Book a hotel
// @route   POST /api/v1/hotels/:id/book
// @access  Private (Customer)
export const priceDay = AsyncHandler(async (req, res) => {
  const { pricePerDay } = req.body;

  // 1) جيب الفندق
  const hotel = await Hotel.findById(req.params.id);
  if (!hotel) {
    return res.status(404).json({ success: false, message: "Hotel not found" });
  }

  // 2) حدّث الـ pricePerDay
  hotel.pricePerDay = pricePerDay;
  await hotel.save(); // احفظ التعديل

  res.status(201).json({
    success: true,
    message: "Hotel pricePerDay updated successfully",
    data: hotel,
  });
});
// تأكيد الحجز وإرسال إشعار أوتوماتيك
export const ConfirmBooking = AsyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate("hotel") // جلب بيانات الفندق
    .populate("userDetails"); // جلب بيانات المستخدم (صاحب الحجز)

  if (!booking) {
    return res
      .status(404)
      .json({ success: false, message: "Booking not found" });
  }

  // تحديث حالة الحجز
  booking.status = "Confirmed";
  await booking.save();

  // إنشاء إشعار للـ User صاحب الحجز
  const notification = await Notification.create({
    user: booking.userDetails._id, // إشعار يروح لصاحب الحجز
    title: "تأكيد الحجز",
    message: `تم تأكيد حجزك في ${booking.hotel.hotelName} بنجاح!`,
    bookingId: booking._id,
    data: { hotelId: booking.hotel._id, status: "Confirmed" },
    isRead: false,
  });

  // إرسال الإشعار عبر Socket.IO مباشرة
  if (global.io) {
    global.io
      .to(booking.userDetails._id.toString())
      .emit("notification", notification);
  }

  res.status(200).json({
    success: true,
    message: "Booking confirmed successfully",
    data: booking,
  });
});

// @desc    Cancel booking
// @route   PATCH /api/v1/bookings/:id/cancel
// @access  Private (Hotel Owner)

export const CancelBooking = AsyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate("hotel")
    .populate("userDetails");

  if (!booking) {
    return res
      .status(404)
      .json({ success: false, message: "Booking not found" });
  }

  if (booking.hotel.user.toString() !== req.user.id) {
    return res.status(403).json({ success: false, message: "Not authorized" });
  }

  booking.status = "Cancelled";
  await booking.save();

  const notification = await Notification.create({
    user: booking.userDetails._id, // إشعار يروح لصاحب الحجز
    title: "إلغاء الحجز",
    message: `تم إلغاء حجزك في ${booking.hotel.hotelName}.`,
    bookingId: booking._id,
    data: { hotelId: booking.hotel._id, status: "Cancelled" },
    isRead: false,
  });

  if (global.io) {
    global.io
      .to(booking.userDetails._id.toString())
      .emit("notification", notification);
  }

  res.status(200).json({
    success: true,
    message: "Booking cancelled successfully",
    data: booking,
  });
});

// @desc    Get bookings for hotel owner
// @route   GET /api/v1/owner/bookings
// @access  Private (Hotel Owner)
export const getHotelAll = AsyncHandler(async (req, res) => {
  const { keyword, documents, status } = req.query;
  const query = {};

  if (keyword) {
    query.hotelName = { $regex: keyword, options: "i" };
  }

  if (documents) {
    query.documents = { $regex: keyword, options: "i" };
  }

  if (status) {
    query.status = status;
  }

  const hotels = await Hotel.find(query).populate("status");

  if (!hotels.length) {
    return res
      .status(404)
      .json({ success: false, message: "No hotels found " });
  }

  res.status(200).json({
    success: true,
    message: "Bookings fetched successfully",
    hotels,
  });
});

//  count total images in all hotels
export const GetAllImage = AsyncHandler(async (req, res) => {
  const AllImage = await Hotel.find().select("images");

  res.status(200).json({
    success: true,
    AllImage,
  });
});

export const UpdateHotel = AsyncHandler(async (req, res) => {
  const id = req.params.id;

  const hotel = await Hotel.findById(id);
  if (!hotel) {
    return res.status(404).json({ message: "No hotel found" });
  }

  let images = hotel.images;
  let docs = hotel.docs;

  if (req.files?.["hotelImages"]) {
    if (hotel.images && hotel.images.length > 0) {
      await cloudinaryRemoveMultipleFiles(hotel.images);
    }
    images = await cloudinaryUploadMultiple(req.files["hotelImages"]);
  }

  if (req.files?.["hotelDocs"]) {
    if (hotel.docs && hotel.docs.length > 0) {
      await cloudinaryRemoveMultipleFiles(hotel.docs);
    }
    docs = await cloudinaryUploadMultiple(req.files["hotelDocs"]);
  }

  const updatedHotel = await Hotel.findByIdAndUpdate(
    id,
    {
      ...req.body,
      images,
      docs,
    },
    { new: true }
  );

  res.status(200).json({
    message: "Hotel updated successfully",
    updatedHotel,
    // booking,
  });
});

export const DeleteHotel = AsyncHandler(async (req, res) => {
  const id = req.params.id;

  const hotel = await Hotel.findById(id);
  if (!hotel) {
    return res.status(404).json({ message: "No hotel found" });
  }

  if (hotel.images && hotel.images.length > 0) {
    await cloudinaryRemoveMultipleFiles(hotel.images);
  }

  const deletedHotel = await Hotel.findByIdAndDelete(id);

  res.status(200).json({
    message: "Hotel deleted successfully",
    deletedHotel,
  });
});

// @desc    Update user deviceToken
// @route   POST /api/users/update-device-token
// @access  Private
export const updateDeviceToken = AsyncHandler(async (req, res) => {
  const { deviceToken } = req.body;
  const userId = req.user._id; // لو عندك auth middleware

  const user = await User.findByIdAndUpdate(
    userId,
    { deviceToken },
    { new: true }
  );

  res.status(200).json({
    message: "Device token updated successfully",
    deviceToken: user.deviceToken,
  });
});

// @desc    Add activity to a hotel (Treasureto Collection)
// @route   PUT /api/v1/hotels/:id/activities
// @access  Private
export const AddHotelActivities = AsyncHandler(async (req, res) => {
  const { title, category, popular } = req.body;

  const hotel = await Hotel.findById(req.params.id);
  if (!hotel) {
    return res.status(404).json({
      success: false,
      message: "Hotel not found",
    });
  }

  const newActivity = await Treasureto.create({
    hotel: hotel._id,
    title,
    category,
    popular: popular || false,
  });

  res.status(201).json({
    success: true,
    message: "Activity added to hotel successfully",
    data: newActivity,
  });
});

// GET /api/notifications/:userId
// GET /api/notifications/hotel-owners
export const getHotelOwnersNotifications = AsyncHandler(
  async (req, res, next) => {
    const owners = await User.find({ role: "Hotel Owner" }).select("_id");
    if (!owners.length) return next(new AppError("No hotel owners found", 404));

    const ownerIds = owners.map((o) => o._id);

    const notifications = await Notification.find({
      user: { $in: ownerIds },
    }).sort({
      createdAt: -1,
    });

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { notifications },
          "Hotel Owners notifications fetched successfully"
        )
      );
  }
);
