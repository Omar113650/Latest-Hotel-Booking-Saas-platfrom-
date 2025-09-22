import express from "express";
import { BookHotel } from "../controller/BookingController.js";
import { VerifyToken} from "../middleware/VerifyToken.js";
import{ValidatedID} from "../middleware/validateId.js"
import {validate} from "../middleware/Vaildate.js"
import{BookingValidate} from "../Validation/BookValidation.js"
const router = express.Router();


router.post("/book-hotel/:id",VerifyToken,ValidatedID,validate(BookingValidate), BookHotel);



export default router;

