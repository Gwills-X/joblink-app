"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  BriefcaseBusiness,
  ChevronDown,
  FileText,
  LayoutDashboard,
  LogOut,
  MapPin,
  Settings,
} from "lucide-react";

export default function UserMenu({ user, logoutAction }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const initial = user?.name?.charAt(0).toUpperCase() || "U";
  const isActive = (href) =>
    pathname === href || pathname.startsWith(`${href}/`);

  const menuLinkClass = (href) =>
    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
      isActive(href)
        ? "bg-emerald-500/10 text-emerald-300"
        : "text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
    }`;

  return (
    <div className='relative'>
      <button
        type='button'
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-haspopup='menu'
        className='group flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-2 py-1.5 text-sm text-slate-700 shadow-sm transition-all hover:border-emerald-300 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:shadow-none dark:hover:border-emerald-500/30 dark:hover:bg-slate-900 dark:hover:text-white'>
        <span className='flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-950'>
          {user?.profile_pic_url ? (
            <img
              src={user.profile_pic_url}
              alt=''
              className='h-full w-full object-cover'
            />
          ) : (
            <span className='font-mono text-xs font-bold text-emerald-400'>
              {initial}
            </span>
          )}
        </span>
        <span className='hidden max-w-28 truncate font-medium lg:block'>
          {user?.name || "Account"}
        </span>
        <ChevronDown
          className={`h-4 w-4 text-slate-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <>
          <button
            type='button'
            aria-label='Close account menu'
            className='fixed inset-0 z-40 cursor-default'
            onClick={() => setIsOpen(false)}
          />
          <div
            role='menu'
            className='absolute right-0 z-50 mt-2 w-60 rounded-xl border border-slate-200 bg-white p-2 text-slate-900 shadow-2xl shadow-slate-900/10 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:shadow-black/30'>
            <div className='border-b border-slate-200 px-3 py-2.5 dark:border-slate-800'>
              <p className='truncate text-sm font-semibold text-slate-900 dark:text-white'>
                {user?.name || "Account"}
              </p>
              <div className='mt-1 flex items-center gap-2 text-[10px] text-slate-500'>
                <span className='font-mono uppercase tracking-wider text-emerald-400'>
                  {user?.role || "member"}
                </span>
                <span className='text-slate-700'>/</span>
                <span className='flex min-w-0 items-center gap-1 truncate'>
                  <MapPin className='h-3 w-3 shrink-0' />
                  {user?.location || "Bauchi, Nigeria"}
                </span>
              </div>
            </div>
            <div className='mt-2 space-y-1'>
              <Link
                href='/dashboard/settings'
                role='menuitem'
                onClick={() => setIsOpen(false)}
                className={menuLinkClass("/dashboard/settings")}>
                <Settings className='h-4 w-4' />
                Edit Profile
              </Link>
              <Link
                href='/dashboard'
                role='menuitem'
                onClick={() => setIsOpen(false)}
                className={menuLinkClass("/dashboard")}>
                <LayoutDashboard className='h-4 w-4' />
                Dashboard
              </Link>
              <Link
                href='/dashboard/seeker/applications'
                role='menuitem'
                onClick={() => setIsOpen(false)}
                className={menuLinkClass("/dashboard/seeker/applications")}>
                <FileText className='h-4 w-4' />
                Applications
              </Link>
            </div>
            <div className='mt-2 border-t border-slate-200 pt-2 dark:border-slate-800'>
              <p className='px-3 pb-2 font-mono text-[9px] uppercase tracking-widest text-slate-600'>
                Workspace Status
              </p>
              <div className='flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-[11px] dark:bg-slate-800/70'>
                <span className='flex items-center gap-2 text-slate-600 dark:text-slate-400'>
                  <BriefcaseBusiness className='h-3.5 w-3.5' /> Account
                </span>
                <span className='font-mono text-emerald-400'>Active</span>
              </div>
              <div className='mt-1 flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-[11px] dark:bg-slate-800/70'>
                <span className='text-slate-600 dark:text-slate-400'>
                  Visibility
                </span>
                <span className='font-mono text-emerald-400'>Public</span>
              </div>
            </div>
            <div className='mt-2 border-t border-slate-200 pt-2 dark:border-slate-800'>
              <form action={logoutAction}>
                <button
                  type='submit'
                  role='menuitem'
                  className='flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-rose-300 transition-colors hover:bg-rose-500/10 hover:text-rose-200'>
                  <LogOut className='h-4 w-4' />
                  Sign Out
                </button>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
