import { Notification } from "../model/Notification.model.js";
import  admin  from "../config/firebase/firebaseInit.js";


export async function createAndSendNotification(
  user,
  title,
  message,
  bookingId = null
) {
  // 1. نخزن في DB
  const notification = await Notification.create({
    user: user._id,
    title,
    message,
    booking: bookingId,
  });

  // 2. Socket.IO (Realtime)
  const io = global.io;
  if (io) {
    io.to(user._id.toString()).emit("notification", notification);
  }

  

  // 3. Push Notification عبر FCM
  if (user.deviceToken) {
    const payload = {
      token: user.deviceToken,
      notification: { title, body: message },
      data: { bookingId: bookingId ? bookingId.toString() : "" },
    };

    try {
      await admin.messaging().send(payload);
      console.log("✅ Push Notification sent");
    } catch (err) {
      console.error("❌ Error sending FCM notification:", err);
    }
  }

  return notification;
}
