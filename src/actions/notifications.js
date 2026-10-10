"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import getAuthUser from "@/lib/getAuthUser";
import { notificationEngine } from "@/services/notificationEngine";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function markNotificationReadAction(notificationId) {
  const user = await getAuthUser();
  if (!user) return redirect("/login");

  if (
    typeof notificationId !== "string" ||
    !UUID_PATTERN.test(notificationId)
  ) {
    return { success: false, message: "Invalid notification." };
  }

  try {
    const updated = await notificationEngine.markRead(
      String(user.userId || user.id),
      notificationId,
    );
    if (!updated) {
      return { success: false, message: "Notification not found." };
    }
    revalidatePath("/dashboard/notifications");
    return { success: true };
  } catch (error) {
    console.error("Could not mark notification read:", error);
    return { success: false, message: "Could not update this notification." };
  }
}

export async function markAllNotificationsReadAction() {
  const user = await getAuthUser();
  if (!user) return redirect("/login");

  try {
    await notificationEngine.markAllRead(String(user.userId || user.id));
    revalidatePath("/dashboard/notifications");
    return { success: true };
  } catch (error) {
    console.error("Could not mark notifications read:", error);
    return { success: false, message: "Could not update notifications." };
  }
}
