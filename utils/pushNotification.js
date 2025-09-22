// utils/pushNotification.js
export async function sendPushNotification(token, title, body) {
  if (!token) return;

  await fetch("https://fcm.googleapis.com/fcm/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `key=${process.env.FCM_SERVER_KEY}`, // خليه في .env
    },
    body: JSON.stringify({
      to: token,
      notification: { title, body },
      data: { click_action: "FLUTTER_NOTIFICATION_CLICK" },
    }),
  });
}


// await fetch("/api/users/device-token", {
//   method: "POST",
//   headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//   body: JSON.stringify({ deviceToken }),
// });
