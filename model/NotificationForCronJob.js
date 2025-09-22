import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: String,
  message: String,
  type: String,
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now, expires: '7d' },
});

export const notificationCronjob = mongoose.model("notificationCronjob", notificationSchema);
