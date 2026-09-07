// services/chatEngine.js
import crypto from "crypto";
import { query, withTransaction } from "@/lib/db";

export const chatEngine = {
  async getRelationship(userId, otherUserId) {
    if (!userId || !otherUserId || String(userId) === String(otherUserId)) {
      return { status: "SELF", roomId: null, requestId: null };
    }

    const rooms = await query(
      `SELECT id FROM chat_rooms
       WHERE (participant_one = ? AND participant_two = ?)
          OR (participant_one = ? AND participant_two = ?)
       LIMIT 1`,
      [userId, otherUserId, otherUserId, userId],
    );
    if (rooms.length > 0)
      return { status: "CHAT_EXISTS", roomId: rooms[0].id, requestId: null };

    const requests = await query(
      `SELECT sender_id, receiver_id, status FROM chat_requests
       WHERE ((sender_id = ? AND receiver_id = ?)
          OR (sender_id = ? AND receiver_id = ?))
         AND status = 'PENDING'
       ORDER BY created_at DESC LIMIT 1`,
      [userId, otherUserId, otherUserId, userId],
    );
    if (requests.length === 0)
      return { status: "NO_RELATIONSHIP", roomId: null, requestId: null };

    return {
      status:
        String(requests[0].sender_id) === String(userId)
          ? "REQUEST_SENT"
          : "REQUEST_RECEIVED",
      roomId: null,
      requestId: requests[0].id,
    };
  },

  async getRelationships(userId, otherUserIds) {
    const ids = [
      ...new Set((otherUserIds || []).map(String).filter(Boolean)),
    ].filter((id) => id !== String(userId));
    if (ids.length === 0) return {};

    const placeholders = ids.map(() => "?").join(",");
    const rows = await query(
      `SELECT person_id, room_id, relationship_status FROM (
        SELECT CASE WHEN participant_one = ? THEN participant_two ELSE participant_one END AS person_id,
          NULL AS request_id, id AS room_id, 'CHAT_EXISTS' AS relationship_status
        FROM chat_rooms
        WHERE (participant_one = ? AND participant_two IN (${placeholders}))
           OR (participant_two = ? AND participant_one IN (${placeholders}))
        UNION ALL
        SELECT CASE WHEN sender_id = ? THEN receiver_id ELSE sender_id END AS person_id,
          id AS request_id,
          NULL AS room_id,
          CASE WHEN sender_id = ? THEN 'REQUEST_SENT' ELSE 'REQUEST_RECEIVED' END AS relationship_status
        FROM chat_requests
        WHERE status = 'PENDING'
          AND ((sender_id = ? AND receiver_id IN (${placeholders}))
            OR (receiver_id = ? AND sender_id IN (${placeholders})))
      ) relationships
      ORDER BY relationship_status = 'CHAT_EXISTS' DESC`,
      [
        userId,
        userId,
        ...ids,
        userId,
        ...ids,
        userId,
        userId,
        userId,
        userId,
        ...ids,
        userId,
        ...ids,
      ],
    );

    return rows.reduce((result, row) => {
      if (!result[row.person_id])
        result[row.person_id] = {
          status: row.relationship_status,
          roomId: row.room_id,
          requestId: row.request_id,
        };
      return result;
    }, {});
  },

  async getUserRooms(userId) {
    return await query(
      `
        SELECT cr.*,
          u1.name AS participant_one_name,
          u2.name AS participant_two_name,
          lm.content AS last_message,
          lm.created_at AS last_message_at,
          (SELECT COUNT(*) FROM messages unread
           WHERE unread.room_id = cr.id
             AND unread.sender_id <> ?
             AND unread.is_read = 0) AS unread_count
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
      [userId, userId, userId],
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

    const requestId = crypto.randomUUID();

    await withTransaction(async ({ query: transactionQuery }) => {
      const lockName = `joblink-chat:${[senderId, receiverId].sort().join(":")}`;
      await transactionQuery("SELECT GET_LOCK(?, 10)", [lockName]);
      try {
        const existingRoom = await transactionQuery(
          `SELECT id FROM chat_rooms
           WHERE (participant_one = ? AND participant_two = ?)
              OR (participant_one = ? AND participant_two = ?)
           LIMIT 1 FOR UPDATE`,
          [senderId, receiverId, receiverId, senderId],
        );
        if (existingRoom.length > 0) {
          throw new Error("You already have a chat room with this person.");
        }

        const existing = await transactionQuery(
          `SELECT id, status FROM chat_requests
           WHERE (sender_id = ? AND receiver_id = ?)
              OR (sender_id = ? AND receiver_id = ?)
           ORDER BY created_at DESC LIMIT 1 FOR UPDATE`,
          [senderId, receiverId, receiverId, senderId],
        );
        if (existing.length > 0) {
          if (existing[0].status === "PENDING") {
            throw new Error("A chat request is already pending between you.");
          }
          throw new Error("A chat request already exists between you.");
        }

        await transactionQuery(
          "INSERT INTO chat_requests (id, sender_id, receiver_id, message, status) VALUES (?, ?, ?, ?, 'PENDING')",
          [requestId, senderId, receiverId, trimmedMessage],
        );
      } finally {
        await transactionQuery("SELECT RELEASE_LOCK(?)", [lockName]);
      }
    });

    return { id: requestId, duplicate: false };
  },

  async acceptChatRequest({ requestId, receiverId }) {
    return await withTransaction(async ({ query: transactionQuery }) => {
      const requestRows = await transactionQuery(
        "SELECT * FROM chat_requests WHERE id = ? AND receiver_id = ? AND status = 'PENDING' LIMIT 1 FOR UPDATE",
        [requestId, receiverId],
      );
      if (requestRows.length === 0) {
        throw new Error("This chat request is no longer available.");
      }

      const request = requestRows[0];
      const lockName = `joblink-chat:${[request.sender_id, request.receiver_id].sort().join(":")}`;
      await transactionQuery("SELECT GET_LOCK(?, 10)", [lockName]);
      try {
        const existingRoom = await transactionQuery(
          `SELECT id FROM chat_rooms
           WHERE (participant_one = ? AND participant_two = ?)
              OR (participant_one = ? AND participant_two = ?)
           LIMIT 1 FOR UPDATE`,
          [
            request.sender_id,
            request.receiver_id,
            request.receiver_id,
            request.sender_id,
          ],
        );
        let roomId = existingRoom[0]?.id || null;
        if (!roomId) {
          const result = await transactionQuery(
            "INSERT INTO chat_rooms (participant_one, participant_two) VALUES (?, ?)",
            [request.sender_id, request.receiver_id],
          );
          roomId = result.insertId || null;
        }
        await transactionQuery(
          "UPDATE chat_requests SET status = 'ACCEPTED' WHERE id = ?",
          [requestId],
        );
        return { roomId, accepted: true };
      } finally {
        await transactionQuery("SELECT RELEASE_LOCK(?)", [lockName]);
      }
    });
  },

  async rejectChatRequest({ requestId, receiverId }) {
    const result = await query(
      "UPDATE chat_requests SET status = 'REJECTED' WHERE id = ? AND receiver_id = ? AND status = 'PENDING'",
      [requestId, receiverId],
    );
    if (!result?.[0]?.affectedRows)
      throw new Error("This chat request is no longer available.");
    return { rejected: true };
  },

  async deleteMessage({ messageId, userId }) {
    const result = await query(
      `DELETE m FROM messages m
       INNER JOIN chat_rooms cr ON cr.id = m.room_id
       WHERE m.id = ? AND (cr.participant_one = ? OR cr.participant_two = ?)`,
      [messageId, userId, userId],
    );
    if (!result?.[0]?.affectedRows)
      throw new Error("Message not found or access denied.");
    return { deleted: true };
  },

  async deleteRoom({ roomId, userId }) {
    const result = await query(
      "DELETE FROM chat_rooms WHERE id = ? AND (participant_one = ? OR participant_two = ?)",
      [roomId, userId, userId],
    );
    if (!result?.[0]?.affectedRows)
      throw new Error("Conversation not found or access denied.");
    return { deleted: true };
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
