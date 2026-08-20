// services/chatEngine.js
import crypto from "crypto";
import { query } from "@/lib/db";

export const chatEngine = {
  async getUserRooms(userId) {
    return await query(
      `
        SELECT cr.*,
          u1.name AS participant_one_name,
          u2.name AS participant_two_name,
          lm.content AS last_message,
          lm.created_at AS last_message_at
        FROM chat_rooms cr
        JOIN users u1 ON u1.id = cr.participant_one
        JOIN users u2 ON u2.id = cr.participant_two
        LEFT JOIN (
          SELECT m.room_id, m.content, m.created_at
          FROM messages m
          INNER JOIN (
            SELECT room_id, MAX(created_at) AS max_created_at
            FROM messages
            GROUP BY room_id
          ) latest ON latest.room_id = m.room_id
            AND latest.max_created_at = m.created_at
        ) lm ON lm.room_id = cr.id
        WHERE cr.participant_one = ? OR cr.participant_two = ?
        ORDER BY COALESCE(lm.created_at, cr.created_at) DESC
      `,
      [userId, userId],
    );
  },

  async getUserChatRequests(userId) {
    return await query(
      `
        SELECT cr.*, 
          s.name AS sender_name,
          r.name AS receiver_name
        FROM chat_requests cr
        JOIN users s ON s.id = cr.sender_id
        JOIN users r ON r.id = cr.receiver_id
        WHERE cr.sender_id = ? OR cr.receiver_id = ?
        ORDER BY cr.created_at DESC
      `,
      [userId, userId],
    );
  },

  async createChatRequest({ senderId, receiverId, message }) {
    if (!senderId || !receiverId || senderId === receiverId) {
      throw new Error("A valid recipient is required.");
    }

    const trimmedMessage = String(message || "").trim();
    if (!trimmedMessage) {
      throw new Error("A short intro message is required.");
    }

    const existing = await query(
      "SELECT id FROM chat_requests WHERE sender_id = ? AND receiver_id = ? LIMIT 1",
      [senderId, receiverId],
    );

    if (existing && existing.length > 0) {
      return { id: existing[0].id, duplicate: true };
    }

    const requestId = crypto.randomUUID();

    await query(
      "INSERT INTO chat_requests (id, sender_id, receiver_id, message, status) VALUES (?, ?, ?, ?, 'PENDING')",
      [requestId, senderId, receiverId, trimmedMessage],
    );

    return { id: requestId, duplicate: false };
  },

  async acceptChatRequest({ requestId, receiverId }) {
    const requestRows = await query(
      "SELECT * FROM chat_requests WHERE id = ? AND receiver_id = ? AND status = 'PENDING' LIMIT 1",
      [requestId, receiverId],
    );

    if (!requestRows || requestRows.length === 0) {
      throw new Error("This chat request is no longer available.");
    }

    const request = requestRows[0];

    const existingRoom = await query(
      `
        SELECT id FROM chat_rooms
        WHERE (participant_one = ? AND participant_two = ?)
           OR (participant_one = ? AND participant_two = ?)
        LIMIT 1
      `,
      [
        request.sender_id,
        request.receiver_id,
        request.receiver_id,
        request.sender_id,
      ],
    );

    let roomId = null;

    if (existingRoom && existingRoom.length > 0) {
      roomId = existingRoom[0].id;
    } else {
      const result = await query(
        "INSERT INTO chat_rooms (participant_one, participant_two) VALUES (?, ?)",
        [request.sender_id, request.receiver_id],
      );

      roomId = result && result.insertId ? result.insertId : null;
    }

    await query("UPDATE chat_requests SET status = 'ACCEPTED' WHERE id = ?", [
      requestId,
    ]);

    return { roomId, accepted: true };
  },

  async sendMessage({ roomId, senderId, content }) {
    if (!roomId || !senderId) {
      throw new Error("Missing chat context.");
    }

    const cleaned = String(content || "").trim();
    if (!cleaned) {
      throw new Error("Message cannot be empty.");
    }

    const roomRows = await query(
      "SELECT id FROM chat_rooms WHERE id = ? AND (participant_one = ? OR participant_two = ?) LIMIT 1",
      [roomId, senderId, senderId],
    );

    if (!roomRows || roomRows.length === 0) {
      throw new Error("You are not allowed to message in this room.");
    }

    const result = await query(
      "INSERT INTO messages (room_id, sender_id, content) VALUES (?, ?, ?)",
      [roomId, senderId, cleaned],
    );

    return {
      success: true,
      insertId: result && result.insertId ? result.insertId : null,
    };
  },

  async getMessages(roomId, userId) {
    const roomRows = await query(
      "SELECT id FROM chat_rooms WHERE id = ? AND (participant_one = ? OR participant_two = ?) LIMIT 1",
      [roomId, userId, userId],
    );

    if (!roomRows || roomRows.length === 0) {
      throw new Error("You do not have access to this conversation.");
    }

    return await query(
      `
        SELECT m.*, u.name AS sender_name, u.profile_pic_url
        FROM messages m
        JOIN users u ON u.id = m.sender_id
        WHERE m.room_id = ?
        ORDER BY m.created_at ASC
      `,
      [roomId],
    );
  },
};
