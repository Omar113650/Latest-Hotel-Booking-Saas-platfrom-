import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" },
  isRead: { type: Boolean, default: false },
   data: { type: mongoose.Schema.Types.Mixed },
  
  createdAt: { type: Date, default: Date.now },
});

export const Notification = mongoose.model("Notification", NotificationSchema);
