import * as mysqlRepo from "./mysql/notificationService";

export const notificationEngine = {
  create: (notification) => mysqlRepo.createMysqlNotification(notification),
  recent: (userId) => mysqlRepo.fetchMysqlRecentNotifications(userId),
  list: (userId) => mysqlRepo.fetchMysqlNotifications(userId),
  unreadCount: (userId) => mysqlRepo.countMysqlUnreadNotifications(userId),
  markRead: (userId, notificationId) =>
    mysqlRepo.markMysqlNotificationRead(userId, notificationId),
  markAllRead: (userId) => mysqlRepo.markAllMysqlNotificationsRead(userId),
};
