import express from "express";
import {
  getHotelBookings,
  getHotelAll,
  ConfirmBooking,
  GetAllImage,
  DeleteHotel,
  UpdateHotel,
  priceDay,
  AddHotelActivities,
  CancelBooking,
  getHotelOwnersNotifications
  
} from "../controller/HotelOwnerDashboard.js";

import {
  VerifyTokenHotelOwner,
} from "../middleware/VerifyToken.js";
import { ValidatedID } from "../middleware/validateId.js";

const router = express.Router();

router.get("/get-all-hotel", VerifyTokenHotelOwner, getHotelAll);

router.get("/owner/bookings-hotel", getHotelBookings);

router.post(
  "/:id/price-hotel-book",
  VerifyTokenHotelOwner,
  ValidatedID,
  priceDay
);

router.post(
  "/Confirm-book/:id",
  VerifyTokenHotelOwner,
  ValidatedID,
  ConfirmBooking
);

router.post(
  "/Cancel-book/:id",
  VerifyTokenHotelOwner,
  ValidatedID,
  CancelBooking
);
router.get("/Get-ALL-Image", VerifyTokenHotelOwner, GetAllImage);

router.delete("/delete-hotel/:id", VerifyTokenHotelOwner, DeleteHotel);
router.put("/update-hotel/:id", VerifyTokenHotelOwner, UpdateHotel);

router.post("/add-price-to-hotel/:id", priceDay);
AddHotelActivities;

router.put("/Add-Hotel-Activities/:id", AddHotelActivities);

router.get("/notifications/:userId", getHotelOwnersNotifications);


export default router;
