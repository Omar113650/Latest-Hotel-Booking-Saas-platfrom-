// utils/sendNotificationToUser.js
import { notificationCronjob } from "../model/NotificationForCronJob.js";
import webpush from "../config/webpush.js";
import { sendEmail } from "./emailServices.js";
import { User } from "../model/user.js";

export const sendNotificationToUser = async (sub, title, message) => {
  // ✅ In-App notification
  await notificationCronjob.create({
    // userId:subscription.userId,
          userId: "66ec4fbf5c08b82f87b60c55",
    title,
    message,
    type: sub.role === "User" ? "hotel-suggestion" : "HotelOwner-reminder",
  });

  // ✅ Web Push notification
  try {
    if (sub.subscription?.endpoint) {
      await webpush.sendNotification(
        sub.subscription,
        JSON.stringify({
          notification: {
            title,
            body: message,
            icon: "https://cdn-icons-png.flaticon.com/512/747/747310.png",
            data: { url: "https://your-hotel-booking.com" },
          },
        })
      );
      console.log(`✅ Push sent to ${sub.userId}`);
    } else {
      console.warn(`⚠️ No valid subscription for user ${sub.userId}`);
    }
  } catch (err) {
    console.error("❌ Push error:", err.message);
  }

  // ✅ Email notification
  try {
    const user = await User.findById(sub.userId);
    if (user?.Email) {
      await sendEmail({
        from: '"Hotel Booking" <noreply@hotel.com>',
        to: user.Email,
        subject: title,
        html: `<h3>${title}</h3><p>${message}</p>`,
      });
      console.log(`📧 Email sent to ${user.Email}`);
    }
  } catch (err) {
    console.error("❌ Email error:", err.message);
  }
};
