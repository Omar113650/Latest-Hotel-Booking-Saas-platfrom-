import express from "express";
import {
  getAllHotels,
  changeHotelStatus,
  getAllOwners,
  manageOwner,
  getAllBookings,
  getAdminNotifications,
} from "../controller/AdminDashboard.js";
import { VerifyTokenAdmin } from "../middleware/VerifyToken.js";
import { ValidatedID } from "../middleware/validateId.js";
const router = express.Router();

router.get("/get-hotels", VerifyTokenAdmin, getAllHotels);


router.put(
  "/hotels/:id/status",
  VerifyTokenAdmin,
  ValidatedID,
  changeHotelStatus,
);

router.get("/get-owners-hotel", VerifyTokenAdmin, getAllOwners);

router.delete("/owners-hotel/:id", VerifyTokenAdmin, ValidatedID, manageOwner);

router.get("/get-all-bookings-hotel", VerifyTokenAdmin, getAllBookings);

router.get("/notifications/:id/Admin", VerifyTokenAdmin, getAdminNotifications);

export default router;
