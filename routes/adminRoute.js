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

// تغيير حالة فندق (Approve / Reject)
router.put(
  "/hotels/:id/status",
  VerifyTokenAdmin,
  ValidatedID,
  changeHotelStatus
);

router.get("/get-owners-hotel", VerifyTokenAdmin, getAllOwners);

router.delete("/owners-hotel/:id", VerifyTokenAdmin, ValidatedID, manageOwner);
// للتعطيل: DELETE /api/v1/Admin/owners-hotel/:id?action=block
// للحذف: DELETE /api/v1/Admin/owners-hotel/:id?action=delete
// عرض كل الحجوزات (مع فلترة بالـ status)

router.get("/get-all-bookings-hotel", VerifyTokenAdmin, getAllBookings);

router.get("/notifications/:id/Admin", VerifyTokenAdmin, getAdminNotifications);

export default router;
