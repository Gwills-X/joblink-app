import crypto from "crypto";
import { query } from "@/lib/db";

function deterministicNotificationId(userId, eventKey) {
  const hash = crypto
    .createHash("sha256")
    .update(`${userId}:${eventKey}`)
    .digest("hex")
    .slice(0, 32);

  return `${hash.slice(0, 8)}-${hash.slice(8, 12)}-${hash.slice(12, 16)}-${hash.slice(16, 20)}-${hash.slice(20)}`;
}

export async function createMysqlNotification({
  userId,
  eventKey,
  type,
  title,
  message,
}) {
  const id = deterministicNotificationId(userId, eventKey);
  await query(
    `INSERT IGNORE INTO notifications (id, user_id, type, title, message, is_read)
     VALUES (?, ?, ?, ?, ?, 0)`,
    [id, userId, type, title, message],
  );
}

export async function fetchMysqlRecentNotifications(userId) {
  const rows = await query(
    `SELECT id, type, title, message, is_read, created_at
     FROM notifications
     WHERE user_id = ?
     ORDER BY created_at DESC
     LIMIT 6`,
    [userId],
  );
  return rows || [];
}

export async function fetchMysqlNotifications(userId) {
  const rows = await query(
    `SELECT id, type, title, message, is_read, created_at
     FROM notifications
     WHERE user_id = ?
     ORDER BY created_at DESC
     LIMIT 100`,
    [userId],
  );
  return rows || [];
}

export async function countMysqlUnreadNotifications(userId) {
  const rows = await query(
    "SELECT COUNT(*) AS unread_count FROM notifications WHERE user_id = ?",
    [userId],
  );
  return Number(rows?.[0]?.unread_count || 0);
}

export async function markMysqlNotificationRead(userId, notificationId) {
  const result = await query(
    "UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?",
    [notificationId, userId],
  );
  if (result?.[0]?.affectedRows) return true;

  const rows = await query(
    "SELECT id FROM notifications WHERE id = ? AND user_id = ? LIMIT 1",
    [notificationId, userId],
  );
  return Boolean(rows?.length);
}

export async function markAllMysqlNotificationsRead(userId) {
  await query(
    "UPDATE notifications SET is_read = 1 WHERE user_id = ? AND is_read = 0",
    [userId],
  );
}
