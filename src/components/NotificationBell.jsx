"use client";

import Link from "next/link";
import { useState } from "react";
import { Bell } from "lucide-react";
import NotificationList from "@/components/NotificationList";

export default function NotificationBell({
  notifications = [],
  unreadCount = 0,
  loadError = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentUnreadCount, setCurrentUnreadCount] = useState(unreadCount);

  return (
    <div className='relative z-20'>
      <button
        type='button'
        onClick={() => setIsOpen((open) => !open)}
        aria-label={`Notifications${currentUnreadCount ? `, ${currentUnreadCount} unread` : ""}`}
        aria-expanded={isOpen}
        className='relative inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-600 transition hover:border-emerald-500 hover:text-emerald-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:text-emerald-400'>
        <Bell className='h-4 w-4' />
        {unreadCount > 0 && (
          <span className='absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold leading-none text-white'>
            {currentUnreadCount > 99 ? "99+" : currentUnreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className='absolute right-0 top-12 w-[min(24rem,calc(100vw-2rem))] rounded-lg border border-slate-200 bg-white p-4 shadow-xl dark:border-slate-700 dark:bg-slate-900'>
          <div className='mb-3 flex items-center justify-between gap-3 border-b border-slate-200 pb-3 dark:border-slate-800'>
            <h2 className='text-sm font-semibold text-slate-900 dark:text-slate-100'>
              Notifications
            </h2>
            <Link
              href='/dashboard/notifications'
              onClick={() => setIsOpen(false)}
              className='text-xs font-medium text-emerald-600 hover:text-emerald-500 dark:text-emerald-400'>
              View all
            </Link>
          </div>
          {loadError ? (
            <p role='alert' className='py-5 text-center text-xs text-rose-500'>
              Notifications couldn’t be loaded.
            </p>
          ) : (
            <NotificationList
              initialNotifications={notifications}
              initialUnreadCount={unreadCount}
              compact
              onUnreadCountChange={setCurrentUnreadCount}
            />
          )}
        </div>
      )}
    </div>
  );
}
