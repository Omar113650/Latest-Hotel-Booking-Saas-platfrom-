import cron from "node-cron";
import { Subscription } from "../model/Subscription.js";
import { sendNotificationToUser } from "../utils/sendNotificationToUser.js";

export const weeklyJob = () => {
  cron.schedule("* 1 1 * *", async () => {
    console.log(" Running weekly notificationCronjobs...");

    const subscriptions = await Subscription.find();

    for (const sub of subscriptions) {
      let title = "";
      let message = "";

      if (sub.role === "User") {
        title = "فنادق جديدة لك ";
        message = "تم إضافة 3 فنادق جديدة تناسبك.";
      } else if (sub.role === "Hotel Owner") {
        title = "ضاعف أرباحك ";
        message = "رشح أصحابك يضيفوا فنادق أو أضف ضيوف جدد.";
      }

      await sendNotificationToUser(sub, title, message,{ skipPush: true });
    }
  });
};
