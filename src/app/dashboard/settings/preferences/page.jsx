"use client";

import { Bell, Globe, Moon } from "lucide-react";

export default function PreferencesPage() {
  return (
    <div className='space-y-6'>
      <div>
        <span className='block font-mono text-[11px] font-medium uppercase tracking-widest text-slate-500'>
          Configuration
        </span>
        <h2 className='mt-1 text-lg font-semibold tracking-tight text-slate-100'>
          App Preferences
        </h2>
      </div>

      <div className='space-y-2'>
        {[
          {
            icon: Bell,
            label: "Email Notifications",
            desc: "Receive alerts when someone interacts with your pulse.",
            checked: true,
          },
          {
            icon: Globe,
            label: "Public Profile",
            desc: "Make your activity feed visible to the public.",
            checked: false,
          },
          {
            icon: Moon,
            label: "Compact Mode",
            desc: "Reduce padding and spacing across the interface.",
            checked: false,
          },
        ].map((item) => (
          <div
            key={item.label}
            className='flex items-center justify-between rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4 transition-all duration-150 hover:border-slate-700'>
            <div className='flex items-center gap-3'>
              <div className='flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-slate-800 bg-slate-950 text-slate-500'>
                <item.icon className='h-3.5 w-3.5' />
              </div>
              <div>
                <h3 className='text-sm font-medium text-slate-200'>
                  {item.label}
                </h3>
                <p className='text-xs text-slate-500'>{item.desc}</p>
              </div>
            </div>
            <input
              type='checkbox'
              defaultChecked={item.checked}
              className='h-4 w-4 accent-emerald-500'
            />
          </div>
        ))}
      </div>
    </div>
  );
}
