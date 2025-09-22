import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url"; 
import { Message } from "./model/Message.js";
import connectDB from "./config/connectDB.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import dotenv from "dotenv";
dotenv.config({ path: ".env" });

connectDB();

const app = express();
const server = createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(express.static(path.resolve(__dirname, "public")));

let clientSocket = null;
let adminSocket = null;

io.on("connection", async (socket) => {
  console.log("New socket connected");

  socket.on("register", async (role) => {
    if (role === "client") {
      clientSocket = socket;
      console.log("Client connected");

      const messages = await Message.find().sort({ timestamp: 1 });
      socket.emit("chatHistory", messages);
    } else if (role === "admin") {
      adminSocket = socket;
      console.log("Admin connected");

      const messages = await Message.find().sort({ timestamp: 1 });
      socket.emit("chatHistory", messages);
    }
  });

  socket.on("chatMessage", async (data) => {
    const newMsg = await Message.create({ from: data.from, text: data.text });

    if (data.from === "client") {
      if (adminSocket) {
        adminSocket.emit("chatMessage", newMsg);
        adminSocket.emit("notification", { from: "عميل", text: data.text });
      }

      // 🔹 إرسال رد AI للعميل
      if (clientSocket) {
        clientSocket.emit("chatMessage");
        clientSocket.emit("notification", { from: "الدعم الفني (بوت)" });
      }
    } else if (data.from === "admin" && clientSocket) {
      clientSocket.emit("chatMessage", newMsg);
      clientSocket.emit("notification", {
        from: "الدعم الفني",
        text: data.text,
      });
    }
  });
  -socket.on("typing", (from) => {
    const target = from === "client" ? adminSocket : clientSocket;
    if (target) target.emit("typing", from);
  });

  socket.on("typing", (data) => {
    const target = data.from === "admin" ? clientSocket : adminSocket;
    if (target) target.emit("typing", data);
  });

  socket.on("messageSeen", async (msgId) => {
    await Message.findByIdAndUpdate(msgId, { seen: true });
  });

  socket.on("disconnect", () => {
    if (socket === clientSocket) {
      clientSocket = null;
      console.log("Client disconnected");
    }
    if (socket === adminSocket) {
      adminSocket = null;
      console.log("Admin disconnected");
    }
  });
});

server.listen(3000, () => {
  console.log(" Server running on http://localhost:3000");
});
