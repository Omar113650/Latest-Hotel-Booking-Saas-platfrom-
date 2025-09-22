import webpush from "web-push";
import dotenv from "dotenv";

dotenv.config();

webpush.setVapidDetails(
  "mailto:omarelhelaly520@gmail.com", 
  process.env.PUBLIC_VAPID_KEY,
  process.env.PRIVATE_VAPID_KEY
);

export default webpush;
