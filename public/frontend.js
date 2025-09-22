function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

async function subscribeUser(userId, role) {
  const registration = await navigator.serviceWorker.register("/service-worker.js");
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array("YOUR_PUBLIC_VAPID_KEY"),
  });

  await fetch("http://localhost:8000/subscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, role, subscription }),
  });

  console.log("✅ User subscribed for push notifications");
}
