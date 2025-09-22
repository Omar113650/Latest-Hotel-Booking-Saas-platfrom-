import mongoose  from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    from: String,
    text: String,
    seen: { type: Boolean, default: false },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    isRead: { type: Boolean, default: false },
  },
  { versionKey: false }
);

export const Message = mongoose.model("Message", messageSchema);