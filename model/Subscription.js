import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
   userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  role: { type: String, enum: ["User", "Hotel Owner"] },
  subscription: Object,
});

export const Subscription = mongoose.model("Subscription", subscriptionSchema);
