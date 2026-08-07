"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Shield, SlidersHorizontal } from "lucide-react";

export const dynamic = "force-dynamic";

export default function SettingsLayout({ children }) {
  const pathname = usePathname();

  const tabs = [
    { name: "Edit Profile", href: "/dashboard/settings", icon: User },
    { name: "Security", href: "/dashboard/settings/security", icon: Shield },
    {
      name: "Preferences",
      href: "/dashboard/settings/preferences",
      icon: SlidersHorizontal,
    },
  ];

  return (
    <div className='mx-auto max-w-3xl space-y-6 py-8 px-4'>
      <div>
        <span className='block font-mono text-[11px] font-medium uppercase tracking-widest text-slate-500'>
          Configuration
        </span>
        <h1 className='mt-1 text-xl font-semibold tracking-tight text-slate-100'>
          Account <span className='text-emerald-400'>Settings</span>
        </h1>
      </div>

      {/* Sub-Nav */}
      <div className='flex items-center gap-1 border-b border-slate-800 pb-0'>
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`inline-flex items-center gap-2 border-b-2 px-4 py-2.5 font-mono text-[11px] font-medium uppercase tracking-wider transition-all duration-150 ${
                isActive
                  ? "border-emerald-400 text-emerald-400"
                  : "border-transparent text-slate-500 hover:text-slate-300"
              }`}>
              <tab.icon className='h-3.5 w-3.5' />
              {tab.name}
            </Link>
          );
        })}
      </div>

      <div className='rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6'>
        {children}
      </div>
    </div>
  );
}
