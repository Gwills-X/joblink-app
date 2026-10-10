"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { Bell, Check, CheckCheck } from "lucide-react";
import {
  markAllNotificationsReadAction,
  markNotificationReadAction,
} from "@/actions/notifications";

function notificationHref(notification) {
  const applicationId = notification.message?.match(
    /Application reference:\s*([0-9a-f-]{36})/i,
  )?.[1];

  if (!applicationId) return "/dashboard/notifications";

  if (
    notification.type === "APPLICATION_SUBMITTED" ||
    notification.type === "APPLICATION_WITHDRAWN"
  ) {
    return `/dashboard/employer/applications/${applicationId}`;
  }

  return `/dashboard/seeker/applications/${applicationId}`;
}

function formatDate(value) {
  if (!value) return "";
  return new Date(value).toLocaleString();
}

export default function NotificationList({
  initialNotifications = [],
  initialUnreadCount = 0,
  compact = false,
  onUnreadCountChange,
}) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [unreadCount, setUnreadCount] = useState(initialUnreadCount);
  const [error, setError] = useState("");
  const [pendingId, setPendingId] = useState(null);
  const [isPending, startTransition] = useTransition();

  function markRead(notification) {
    setError("");
    setPendingId(notification.id);
    startTransition(async () => {
      const result = await markNotificationReadAction(notification.id);
      setPendingId(null);
      if (!result?.success) {
        setError(result?.message || "Could not update this notification.");
        return;
      }

      setNotifications((items) =>
        items.map((item) =>
          item.id === notification.id ? { ...item, is_read: 1 } : item,
        ),
      );
      const newUnreadCount = Math.max(unreadCount - 1, 0);
      setUnreadCount(newUnreadCount);
      onUnreadCountChange?.(newUnreadCount);
    });
  }

  function markAllRead() {
    setError("");
    startTransition(async () => {
      const result = await markAllNotificationsReadAction();
      if (!result?.success) {
        setError(result?.message || "Could not update notifications.");
        return;
      }

      setNotifications((items) =>
        items.map((item) => ({ ...item, is_read: 1 })),
      );
      setUnreadCount(0);
      onUnreadCountChange?.(0);
    });
  }

  return (
    <section className='min-w-0'>
      <div className='mb-3 flex items-center justify-between gap-3'>
        {!compact && (
          <p className='text-xs text-slate-500' aria-live='polite'>
            {unreadCount} unread
          </p>
        )}
        {unreadCount > 0 && (
          <button
            type='button'
            onClick={markAllRead}
            disabled={isPending}
            className='inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 hover:text-emerald-500 disabled:opacity-50 dark:text-emerald-400'>
            <CheckCheck className='h-3.5 w-3.5' />
            {isPending && pendingId === null
              ? "Marking read..."
              : "Mark all read"}
          </button>
        )}
      </div>

      {error && (
        <p role='alert' className='mb-3 text-xs text-rose-500'>
          {error}
        </p>
      )}

      {notifications.length === 0 ? (
        <div className='flex flex-col items-center gap-2 rounded-lg border border-dashed border-slate-300 px-5 py-10 text-center dark:border-slate-700'>
          <Bell className='h-5 w-5 text-slate-400' />
          <p className='text-sm font-medium text-slate-700 dark:text-slate-200'>
            You’re all caught up
          </p>
          <p className='text-xs text-slate-500'>
            New activity will appear here.
          </p>
        </div>
      ) : (
        <ul className='divide-y divide-slate-200 dark:divide-slate-800'>
          {notifications.map((notification) => {
            const isRead = Boolean(Number(notification.is_read));
            return (
              <li
                key={notification.id}
                className={`flex items-start gap-3 py-3 ${
                  isRead ? "opacity-70" : ""
                }`}>
                <span
                  className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                    isRead ? "bg-slate-300 dark:bg-slate-700" : "bg-emerald-500"
                  }`}
                  aria-label={isRead ? "Read" : "Unread"}
                />
                <div className='min-w-0 flex-1'>
                  <Link
                    href={notificationHref(notification)}
                    className='block rounded-sm focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-emerald-500'>
                    <p className='text-sm font-semibold text-slate-900 dark:text-slate-100'>
                      {notification.title}
                    </p>
                    <p className='mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400'>
                      {notification.message?.replace(
                        /\s*Application reference:\s*[0-9a-f-]{36}/i,
                        "",
                      )}
                    </p>
                    <time className='mt-1 block text-[10px] text-slate-500'>
                      {formatDate(notification.created_at)}
                    </time>
                  </Link>
                </div>
                {!isRead && (
                  <button
                    type='button'
                    onClick={() => markRead(notification)}
                    disabled={isPending}
                    aria-label='Mark notification as read'
                    title='Mark as read'
                    className='inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-emerald-600 disabled:opacity-50 dark:hover:bg-slate-800 dark:hover:text-emerald-400'>
                    <Check className='h-4 w-4' />
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
