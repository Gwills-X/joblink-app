"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  FileText,
  Briefcase,
  BarChart3,
  Users,
  MessageSquare,
  Settings,
  Bookmark,
  Bell,
} from "lucide-react";

export default function DashboardNav() {
  const pathname = usePathname();

  const tabs = [
    { name: "My Posts", href: "/dashboard/posts", icon: LayoutGrid },
    {
      name: "Candidate Hub",
      href: "/dashboard/seeker/applications",
      icon: FileText,
    },
    { name: "Saved Jobs", href: "/dashboard/seeker/saved", icon: Bookmark },
    { name: "Notifications", href: "/dashboard/notifications", icon: Bell },
    { name: "Employer Hub", href: "/dashboard/employer", icon: Briefcase },
    { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
    { name: "Network", href: "/dashboard/network", icon: Users },
    { name: "Chat", href: "/dashboard/chats", icon: MessageSquare },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <nav className='flex flex-row gap-1 overflow-x-auto rounded-lg border border-slate-200 bg-white p-1.5 lg:w-64 lg:flex-col lg:overflow-visible dark:bg-slate-900 dark:border-slate-800'>
      <div className='hidden px-3 py-2 lg:block'>
        <span className='font-mono text-[10px] font-medium uppercase tracking-widest text-slate-600'>
          Workspace
        </span>
      </div>
      {tabs.map((tab) => {
        const isActive =
          pathname === tab.href ||
          (tab.href !== "/dashboard" && pathname.startsWith(tab.href));
        return (
          <Link
            key={tab.name}
            href={tab.href}
            className={`relative flex items-center gap-2.5 whitespace-nowrap rounded-md px-3 py-2 text-xs font-medium transition-all duration-150 ${
              isActive
                ? "bg-emerald-500/10 text-emerald-400"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-500 dark:hover:bg-slate-800/50 dark:hover:text-slate-300"
            }`}>
            <tab.icon className='h-3.5 w-3.5 shrink-0' />
            <span className='hidden lg:inline'>{tab.name}</span>
            {isActive && (
              <span className='absolute right-2 top-1/2 hidden h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-emerald-400 lg:inline' />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
