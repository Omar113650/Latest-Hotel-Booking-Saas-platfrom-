import { io } from "socket.io-client";

const userId = "68c6b4248ed89a100aab27cd"; // الـ ID من userDetails._id
const socket = io("http://localhost:8000", { query: { userId } });


socket.on("connect", () => console.log("Connected to server"));

socket.on("notification", (data) => {
  console.log("Received notification:", data);
});

socket.on("disconnect", () => console.log("Disconnected from server"));
