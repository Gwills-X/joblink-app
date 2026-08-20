"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import getAuthUser from "@/lib/getAuthUser";
import { chatEngine } from "@/services/chatEngine";

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
      message: error.message || "Unable to send chat request.",
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
    return {
      success: true,
      message: "Chat request accepted.",
      roomId: result.roomId,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || "Unable to accept chat request.",
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
      message: error.message || "Unable to send message.",
    };
  }
}
