import { Hotel } from "../model/Hotel.js";
import { User } from "../model/user.js";
import { Booking } from "../model/Booking.js"; 
import AsyncHandler from "express-async-handler";
import { Treasureto } from "../model/TreasuretoChoose.js";

export const SelectHotel = AsyncHandler(async (req, res) => {
  const { select } = req.query;
  const query = {}; // لو عايز تضيف شروط ممكن تعدل هنا
  const fields = select ? select.split(",").join(" ") : "";

  // جلب الفنادق بالحقول المحددة
  const hotels = await Hotel.find(query).select(fields);

  res.status(200).json({
    success: true,
    data: hotels,
  });
});

export const FilterStatus = AsyncHandler(async (req, res) => {
  let { statusHotel } = req.query;
  const query = {};

  if (statusHotel) {
    statusHotel = statusHotel.toLowerCase();
    if (["available", "not available"].includes(statusHotel)) {
      query.statusHotel = statusHotel;
    } else {
      return res.status(400).json({
        success: false,
        message:
          "Invalid statusHotel value. Use 'available' or 'not available'.",
      });
    }
  }

  const hotels = await Hotel.find(query);

  res.status(200).json({
    success: true,
    count: hotels.length,
    data: hotels,
  });
});

export const SearchHotelName = AsyncHandler(async (req, res) => {
  let { hotelName } = req.query;
  const query = {};

  if (hotelName) {
    query.hotelName = { $regex: hotelName, $options: "i" };
  } else {
    return res.status(400).json({
      success: false,
      message: "Invalid hotelName",
    });
  }

  const hotels = await Hotel.find(query);

  res.status(200).json({
    success: true,
    data: hotels,
  });
});

export const CountUser = AsyncHandler(async (req, res) => {
  const count_user = await User.countDocuments();

  res.status(200).json({
    success: true,
    count: count_user,
  });
});

export const CountAddress = AsyncHandler(async (req, res) => {
  const count_address = await Hotel.aggregate([
    { $group: { _id: "$address", count: { $sum: 1 } } },
  ]);

  res.status(200).json({
    success: true,
    data: count_address,
  });
});

export const CountImages = AsyncHandler(async (req, res) => {
  const count_images = await Hotel.aggregate([
    { $unwind: "$images" },
    { $group: { _id: null, count: { $sum: 1 } } },
  ]);

  res.status(200).json({
    success: true,
    totalImages: count_images.length > 0 ? count_images[0].count : 0,
  });
});

export const FindAllHotel = AsyncHandler(async (req, res) => {
  const hotels = await Hotel.find();
  res.status(200).json({
    success: true,
    message: "All hotels fetched successfully",
    data: hotels,
  });
});

export const FindHotelById = AsyncHandler(async (req, res) => {
  const hotel = await Hotel.findById(req.params.id);

  if (!hotel) {
    return res.status(404).json({
      success: false,
      message: "Hotel not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Hotel fetched successfully",
    data: hotel,
  });
});

export const GetHotelActivities = AsyncHandler(async (req, res) => {
  const activities = await Treasureto.find({ hotel: req.params.id }).populate(
    "hotel"
  );

  res.status(200).json({
    success: true,
    count: activities.length,
    data: activities,
  });
});

export const getMostPickedHotels = AsyncHandler(async (req, res) => {
  const hotels = await Booking.aggregate([
    { $group: { _id: "$hotel", bookingsCount: { $sum: 1 } } },
    { $sort: { bookingsCount: -1 } },
    { $limit: 6 },
    {
      $lookup: {
        from: "hotels",
        localField: "_id",
        foreignField: "_id",
        as: "hotel",
      },
    },
    { $unwind: "$hotel" },
  ]);

  res.status(200).json(hotels);
});

export const getHotelDetails = AsyncHandler(async (req, res) => {
  const hotel = await Hotel.findById(req.params.id)
    .populate("user", "Name Email Phone Country")
    .lean();

  if (
    !hotel ||
    hotel.status !== "Approved" ||
    hotel.statusHotel !== "available"
  ) {
    return res
      .status(404)
      .json({ message: "Hotel not found or not available" });
  }

  res.status(200).json(hotel);
});

export const getSimilarHotels = AsyncHandler(async (req, res) => {
  const hotel = await Hotel.findById(req.params.id);
  if (!hotel) {
    return res.status(404).json({ message: "Hotel not found" });
  }

  const baseAddress = hotel.address.includes(",")
    ? hotel.address.split(",")[0]
    : hotel.address;

  const similarHotels = await Hotel.find({
    _id: { $ne: hotel._id },
    status: "Approved",
    address: { $regex: baseAddress, $options: "i" },
  }).limit(4);

  res.status(200).json(similarHotels);
});

export const GetTopBookedHotels = AsyncHandler(async (req, res) => {
  const topHotels = await Booking.aggregate([
    {
      $group: {
        _id: "$hotel",
        totalBookings: { $sum: 1 },
      },
    },
    {
      $sort: { totalBookings: -1 },
    },
    {
      $limit: 5,
    },
  ]);

  const populatedHotels = await Hotel.populate(topHotels, {
    path: "_id",
    select: "hotelName address pricePerDay", // ✅ location → address
  });

  res.status(200).json({
    success: true,
    count: populatedHotels.length,
    data: populatedHotels.map((h) => ({
      hotel: h._id,
      totalBookings: h.totalBookings,
    })),
  });
});
