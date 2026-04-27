// models/PaymentLog.js
import mongoose from "mongoose";

const PaymentLogSchema = new mongoose.Schema(
  {
    orderId: { type: String, default: null },
    paymentReference: { type: String, required: true },
    paymentIntentId: { type: String },
    amount: { type: Number, required: true },
    currency: { type: String, default: "usd" },
    status: {
      type: String,
      enum: ["paid", "unpaid", "canceled"],
      default: "unpaid",
    },
    paymentMethod: { type: String, default: "card" },
    customerEmail: { type: String, default: null },
    rawResponse: { type: Object },
  },
  { timestamps: true },
);

export default mongoose.model("Stripe", PaymentLogSchema);
