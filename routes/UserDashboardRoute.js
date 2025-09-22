import express from "express";
import {
  getHotelById,
  getHotelBookings,
  getHotelAllBooked,
  getUserNotifications,
} from "../controller/UserDashboard.js";
import { VerifyToken } from "../middleware/VerifyToken.js";
import { ValidatedID } from "../middleware/validateId.js";

const router = express.Router();

router.get("/get-hotels/:id", VerifyToken, ValidatedID, getHotelById);

router.get("/get-bookings-hotel", VerifyToken, getHotelBookings);

router.get("/bookings-all-hotel", VerifyToken, getHotelAllBooked);

router.get("/get-All-Notifications-to-user", VerifyToken, getUserNotifications);

export default router;
