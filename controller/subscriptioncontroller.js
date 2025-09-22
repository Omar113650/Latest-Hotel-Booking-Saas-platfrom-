import { Subscription } from "../model/Subscription.js";

export const saveSubscription = async (req, res) => {
  try {
    const { userId, role, subscription } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const subData =
      typeof subscription === "string"
        ? JSON.parse(subscription)
        : subscription;

    if (!subData?.endpoint) {
      return res.status(400).json({ message: "Invalid subscription object" });
    }

    await Subscription.findOneAndUpdate(
      { userId },
      { role, subscription: subData, userId },
      { upsert: true, new: true }
    );

    res.status(201).json({ message: "Subscribed successfully" });
  } catch (error) {
    console.error(" Save subscription error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
