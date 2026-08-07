"use client";

import Link from "next/link";
import { Radio, ArrowRight, MessageSquare, Circle } from "lucide-react";

export default function NexusHub() {
  const connections = [
    {
      id: 1,
      name: "Core Architecture Team",
      lastMessage: "Can we refine the socket...",
      time: "2m ago",
      unread: 3,
      status: "online",
    },
    {
      id: 2,
      name: "Database Migrations",
      lastMessage: "Migration failed at 4:02 PM",
      time: "1h ago",
      unread: 0,
      status: "offline",
    },
    {
      id: 3,
      name: "Frontend Sync (Chayil)",
      lastMessage: "Looks great on mobile!",
      time: "3h ago",
      unread: 1,
      status: "online",
    },
  ];

  return (
    <div className='mx-auto max-w-4xl space-y-6 py-8 px-4'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <span className='block font-mono text-[11px] font-medium uppercase tracking-widest text-slate-500'>
            Communication Streams
          </span>
          <h1 className='mt-1 text-xl font-semibold tracking-tight text-slate-100'>
            Nexus <span className='text-emerald-400'>Hub</span>
          </h1>
          <p className='mt-1 text-xs text-slate-500'>
            Active data streams and peer connections.
          </p>
        </div>
        <button className='inline-flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 font-mono text-[11px] font-medium uppercase tracking-wider text-emerald-400 transition-all duration-150 hover:bg-emerald-500/20'>
          <Radio className='h-3.5 w-3.5' />
          New Stream
        </button>
      </div>

      <div className='rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden'>
        {connections.length > 0 ? (
          <div className='divide-y divide-slate-800/50'>
            {connections.map((conn) => (
              <div
                key={conn.id}
                className='group flex items-center justify-between gap-4 px-5 py-4 transition-colors duration-150 hover:bg-slate-800/30'>
                <div className='flex items-center gap-3.5 min-w-0'>
                  <Circle
                    className={`h-2 w-2 shrink-0 fill-current ${
                      conn.status === "online"
                        ? "text-emerald-400"
                        : "text-slate-600"
                    }`}
                  />
                  <div className='min-w-0'>
                    <h3 className='truncate text-sm font-medium text-slate-200 transition-colors duration-150 group-hover:text-slate-100'>
                      {conn.name}
                    </h3>
                    <p className='mt-0.5 truncate font-mono text-[11px] tracking-wide text-slate-600'>
                      {conn.lastMessage}
                    </p>
                  </div>
                </div>

                <div className='flex shrink-0 items-center gap-4'>
                  <span className='font-mono text-[10px] tracking-wide text-slate-600'>
                    {conn.time}
                  </span>
                  {conn.unread > 0 && (
                    <span className='flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 font-mono text-[10px] font-bold text-[var(--color-slate)]'>
                      {conn.unread}
                    </span>
                  )}
                  <Link
                    href={`/nexus/${conn.id}`}
                    className='inline-flex items-center gap-1 font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-400 transition-colors duration-150 hover:text-emerald-300'>
                    Enter
                    <ArrowRight className='h-3 w-3' />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className='flex flex-col items-center justify-center py-16 px-6'>
            <MessageSquare className='h-5 w-5 text-slate-600' />
            <p className='mt-3 font-mono text-xs text-slate-500'>
              No active communication streams.
            </p>
            <div className='mt-4 font-mono text-[10px] tracking-wider text-slate-700 uppercase'>
              Status: <span className='text-slate-600'>NO_STREAMS</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
