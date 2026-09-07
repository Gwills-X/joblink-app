"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import getAuthUser from "@/lib/getAuthUser";
import { chatEngine } from "@/services/chatEngine";

function chatError(error, fallback) {
  const knownMessages = [
    "A valid recipient is required.",
    "A short intro message is required.",
    "You already have a chat room with this person.",
    "A chat request is already pending between you.",
    "A chat request already exists between you.",
    "This chat request is no longer available.",
    "You are not allowed to message in this room.",
    "Message cannot be empty.",
    "Message not found or access denied.",
    "Conversation not found or access denied.",
  ];
  return knownMessages.includes(error?.message) ? error.message : fallback;
}

export async function sendChatRequestAction(formData) {
  const user = await getAuthUser();
  if (!user) return redirect("/login");

  const senderId = String(user.userId || user.id);
  const receiverId = String(formData.get("receiver_id") || "").trim();
  const message = String(formData.get("message") || "").trim();

  if (!receiverId) {
    return { success: false, message: "A recipient is required." };
  }
  try {
    await chatEngine.createChatRequest({ senderId, receiverId, message });
    revalidatePath("/dashboard/chats");
    return { success: true, message: "Chat request sent successfully." };
  } catch (error) {
    return {
      success: false,
      message: chatError(error, "Unable to send chat request."),
    };
  }
}

export async function acceptChatRequestAction(requestId) {
  const user = await getAuthUser();
  if (!user) return redirect("/login");

  const receiverId = String(user.userId || user.id);

  try {
    const result = await chatEngine.acceptChatRequest({
      requestId,
      receiverId,
    });
    revalidatePath("/dashboard/chats");
    if (result.roomId) revalidatePath(`/dashboard/chats/${result.roomId}`);
    return {
      success: true,
      message: "Chat room created. You can now start chatting.",
      roomId: result.roomId,
    };
  } catch (error) {
    return {
      success: false,
      message: chatError(error, "Unable to accept chat request."),
    };
  }
}

export async function rejectChatRequestAction(requestId) {
  const user = await getAuthUser();
  if (!user) return redirect("/login");

  try {
    await chatEngine.rejectChatRequest({
      requestId,
      receiverId: String(user.userId || user.id),
    });
    revalidatePath("/dashboard/chats");
    return { success: true, message: "Chat request declined." };
  } catch (error) {
    return {
      success: false,
      message: chatError(error, "Unable to decline chat request."),
    };
  }
}

export async function sendMessageAction(formData) {
  const user = await getAuthUser();
  if (!user) return redirect("/login");

  const senderId = String(user.userId || user.id);
  const roomId = String(formData.get("room_id") || "").trim();
  const content = String(formData.get("content") || "").trim();

  if (!roomId) {
    return { success: false, message: "Missing room information." };
  }

  try {
    await chatEngine.sendMessage({ roomId, senderId, content });
    revalidatePath(`/dashboard/chats/${roomId}`);
    return { success: true, message: "Message sent." };
  } catch (error) {
    return {
      success: false,
      message: chatError(error, "Unable to send message."),
    };
  }
}

export async function deleteMessageAction(messageId, roomId) {
  const user = await getAuthUser();
  if (!user) return redirect("/login");

  try {
    await chatEngine.deleteMessage({
      messageId,
      userId: String(user.userId || user.id),
    });
    revalidatePath(`/dashboard/chats/${roomId}`);
    return { success: true, message: "Message deleted." };
  } catch (error) {
    return {
      success: false,
      message: chatError(error, "Unable to delete message."),
    };
  }
}

export async function deleteRoomAction(roomId) {
  const user = await getAuthUser();
  if (!user) return redirect("/login");

  try {
    await chatEngine.deleteRoom({
      roomId,
      userId: String(user.userId || user.id),
    });
    revalidatePath("/dashboard/chats");
    return { success: true, message: "Conversation deleted." };
  } catch (error) {
    return {
      success: false,
      message: chatError(error, "Unable to delete conversation."),
    };
  }
}
