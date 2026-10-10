import { redirect } from "next/navigation";
import getAuthUser from "@/lib/getAuthUser";
import { notificationEngine } from "@/services/notificationEngine";
import NotificationList from "@/components/NotificationList";

export const dynamic = "force-dynamic";

export default async function NotificationsPage() {
  const user = await getAuthUser();
  if (!user) redirect("/login");

  let notifications = [];
  let unreadCount = 0;
  let loadError = false;

  try {
    const userId = String(user.userId || user.id);
    [notifications, unreadCount] = await Promise.all([
      notificationEngine.list(userId),
      notificationEngine.unreadCount(userId),
    ]);
  } catch (error) {
    console.error("Notifications could not be loaded:", error);
    loadError = true;
  }

  return (
    <div className='mx-auto max-w-3xl px-4 py-6'>
      <div className='mb-5 border-b border-slate-200 pb-4 dark:border-slate-800'>
        <p className='font-mono text-[10px] uppercase text-slate-500'>
          Dashboard
        </p>
        <h1 className='mt-1 text-xl font-semibold text-slate-900 dark:text-slate-100'>
          Notifications
        </h1>
      </div>
      {loadError ? (
        <div
          role='alert'
          className='rounded-lg border border-rose-500/30 bg-rose-500/5 p-5 text-sm text-rose-700 dark:text-rose-300'>
          Notifications couldn’t be loaded. Refresh the page to try again.
        </div>
      ) : (
        <NotificationList
          initialNotifications={notifications}
          initialUnreadCount={unreadCount}
        />
      )}
    </div>
  );
}
