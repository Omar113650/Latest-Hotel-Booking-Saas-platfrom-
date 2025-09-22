// routes/webhookRoute.js
import express from "express";
import { stripeWebhook } from "../controller/webhookController.js";

const router = express.Router();

router.post("/stripe", express.raw({ type: "application/json" }), stripeWebhook);

export default router;
