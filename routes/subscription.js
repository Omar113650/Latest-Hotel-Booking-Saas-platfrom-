import express from "express";
import { saveSubscription } from "../controller/subscriptioncontroller.js";

const router = express.Router();

router.post("/subscribe", saveSubscription);

export default router;






// اذن السماح ب الاشعارات