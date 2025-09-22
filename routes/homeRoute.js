// routes/hotelRoutes.js
import express from "express";
import {
  SelectHotel,
  FilterStatus,
  SearchHotelName,
  CountUser,
  CountAddress,
  CountImages,
  FindAllHotel,
  FindHotelById,
  GetHotelActivities,
  getMostPickedHotels,
  getHotelDetails,
  getSimilarHotels,
  GetTopBookedHotels,
} from "../controller/HomePage.js";
import { VerifyToken } from "../middleware/VerifyToken.js";
import { ValidatedID } from "../middleware/validateId.js";

const router = express.Router();

router.get("/select-Hotel-ByAddress", VerifyToken, SelectHotel);

router.get("/filter-Hotel-ByStatus", VerifyToken, FilterStatus);

router.get("/search", VerifyToken, SearchHotelName);

router.get("/count/users", VerifyToken, CountUser);

router.get("/count/address", VerifyToken, CountAddress);

router.get("/count/images", VerifyToken, CountImages);

router.get("/Find-All-Hotel", VerifyToken, FindAllHotel);

router.get("/hotel/:id", VerifyToken, ValidatedID, FindHotelById);

router.get(
  "/hotel/:id/activities",
  VerifyToken,
  ValidatedID,
  GetHotelActivities
);

router.get("/most-picked", VerifyToken, getMostPickedHotels);

router.get("/:id/details", VerifyToken, ValidatedID, getHotelDetails);

router.get("/:id/similar", VerifyToken, ValidatedID, getSimilarHotels);

router.get("/top-booked", VerifyToken, GetTopBookedHotels);

export default router;
