import { notificationCronjob } from "../model/NotificationForCronJob.js";

export const getUserNotifications = async (req, res) => {
  const notifs = await notificationCronjob.find({ userId: req.params.userId }).sort({
    createdAt: -1,
  });
  res.json(notifs);
};
