import express from "express";
import { getUserNotifications } from "../controller/notificationcontroller.js";

const router = express.Router();

router.get("/notifications/:userId", getUserNotifications);

export default router;
