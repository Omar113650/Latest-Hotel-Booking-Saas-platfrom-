import { io } from "socket.io-client";

const socket = io("http://localhost:8000", {
  query: { userId: "68c16702f754a9ac268b1838" }
});

socket.on("connect", () => {
  console.log("Connected to server with ID:", socket.id);
});

socket.on("notification", (data) => {
  console.log(" New notification:", data);
});
