import express from "express";
import { RegisterHotelOwner, Login} from "../controller/HotelController.js";
import { validate } from "../middleware/Vaildate.js";
import { HotelValidate } from "../Validation/HotelValidation.js";
import upload from "../utils/multer.js";

const router = express.Router();

router.post(
  "/register",
  validate(HotelValidate),
  upload.fields([
    { name: "hotelImages", maxCount: 5 },
    { name: "documents", maxCount: 3 },
  ]),
  RegisterHotelOwner
);

router.post("/login", Login);




export default router;

