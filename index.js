import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/connectDB.js";
import hpp from "hpp";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import passport from "passport";
import cookieParser from "cookie-parser";
import { weeklyJob } from "./cron/weeklyJob.js";
import bodyParser from "body-parser";
import { notFound, errorHandler } from "./middleware/error.js";

// Strategies
import "./strategies/google.strategy.js";
import "./strategies/microsoft.strategy.js";
import "./strategies/github.strategy.js";

// Routes
import AuthRoute from "./routes/AuthRoute.js";
import BookRoute from "./routes/BookRoute.js";
import HomeRoute from "./routes/homeRoute.js";
import HotelRoute from "./routes/hotelRoute.js";
import AdminRoute from "./routes/adminRoute.js";
import HotelOwnerRoute from "./routes/HotelOwnerRoutes.js";
import UserDashboardRoute from "./routes/UserDashboardRoute.js";
import StrapiRoute from "./routes/StripeRoute.js";
import subscriptionRoutes from "./routes/subscription.js";
import notificationRoutes from "./routes/notification.js";

// HTTP + Socket.IO
import http from "http";
import { Server } from "socket.io";

// ===================== Config =====================
dotenv.config({ path: ".env" });

connectDB();
weeklyJob();
// ===================== Express App =====================
const app = express();
app.use(passport.initialize());
app.use(bodyParser.json());

// ===================== Security Middlewares =====================
app.use(helmet());
app.use(hpp());
app.use(cors());

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 دقيقة
    max: 100,
    message: "Too many requests from this IP, please try again later.",
  })
);

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// // Routes
// app.use(subscriptionRoutes);
// app.use(notificationRoutes);

//

// ===================== Routes =====================
app.use("/api/v1/Book", BookRoute);
app.use("/api/v1/HomePage", HomeRoute);
app.use("/api/v1/Hotel", HotelRoute);
app.use("/api/v1/Auth", AuthRoute);
app.use("/api/v1/Admin", AdminRoute);
app.use("/api/v1/Hotel-owner", HotelOwnerRoute);
app.use("/api/v1/User-Dashboard", UserDashboardRoute);
app.use("/api/v1/payment", StrapiRoute);

app.use("/api/NotificationCronJob", notificationRoutes);
app.use("/api/SubscriptionCronJob", subscriptionRoutes);

// ===================== Error Middleware =====================
app.use(notFound);
app.use(errorHandler);

// ===================== HTTP Server + Socket.IO =====================
import { Notification } from "./model/Notification.model.js";

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" },
});

// نخليه global علشان نقدر نستخدمه في أي Controller
global.io = io;

io.on("connection", async (socket) => {
  const userId = socket.handshake.query.userId;
  if (userId) {
    socket.join(userId);
    console.log(`User ${userId} connected`);

    // إرسال الإشعارات الغير مقروءة عند اتصال المستخدم
    const unreadNotifications = await Notification.find({
      user: userId,
      isRead: false,
    });
    unreadNotifications.forEach((notif) => {
      socket.emit("notification", notif);
    });
  }

  socket.on("disconnect", () => {
    console.log(`User ${userId} disconnected`);
  });
});

import cron from "node-cron";
import mongoose from "mongoose";

// موديل يوزر كمثال
const UserSchema = new mongoose.Schema({
  name: String,
  role: String, // 'client' or 'hotelOwner'
  socketId: String, // نخزنها لما يدخل
});
const notification = mongoose.model("notification", UserSchema);

// لما يوزر يتصل
io.on("connection", (socket) => {
  console.log(" مستخدم متصل:", socket.id);

  // حدث لتسجيل اليوزر
  socket.on("register", async ({ userId }) => {
    await notification.findByIdAndUpdate(userId, { socketId: socket.id });
  });

  // لما يقطع الاتصال
  socket.on("disconnect", async () => {
    console.log(" مستخدم قطع:", socket.id);
    await notification.findOneAndUpdate(
      { socketId: socket.id },
      { socketId: null }
    );
  });
});

//  كرون جوب: كل أسبوع (كل يوم اثنين الساعة 10 صباحًا)
cron.schedule("0 10 * * 1", async () => {
  console.log(" إرسال إشعارات أسبوعية...");

  // العملاء
  const clients = await notification.find({
    role: "client",
    socketId: { $ne: null },
  });
  clients.forEach((client) => {
    io.to(client.socketId).emit("notification", {
      message: " تم إضافة فنادق جديدة هذا الأسبوع!",
    });
  });

  // أصحاب الفنادق
  const hotelOwners = await notification.find({
    role: "hotelOwner",
    socketId: { $ne: null },
  });
  hotelOwners.forEach((owner) => {
    io.to(owner.socketId).emit("notification", {
      message: " ضيف فندق جديد أو رشح أصحابك يضيفوا فنادق!",
    });
  });
});

// ===================== Server Listen =====================
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// ===================== Export App =====================
export { app };
