import Link from "next/link";
import { MessageSquare, ArrowRight, Circle } from "lucide-react";

function formatChatTime(value) {
  if (!value) return "Just now";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Just now";

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export default function ChatRoomCard({ room, currentUserId }) {
  const otherUser =
    room.participant_one === currentUserId
      ? { id: room.participant_two, name: room.participant_two_name }
      : { id: room.participant_one, name: room.participant_one_name };

  const lastMessage = room.last_message || "Conversation started";
  const initials = otherUser.name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <Link
      href={`/dashboard/chats/${room.id}`}
      className='group flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-emerald-300 dark:border-slate-700 dark:bg-slate-950/60 dark:hover:border-emerald-500/50 dark:hover:bg-slate-900'>
      <div className='flex min-w-0 flex-1 items-center gap-3'>
        <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10 text-sm font-semibold text-emerald-300'>
          {initials || "U"}
        </div>

        <div className='min-w-0 flex-1'>
          <div className='flex items-center justify-between gap-2'>
            <div className='flex min-w-0 items-center gap-2'>
              <h3 className='truncate text-sm font-semibold text-slate-900 dark:text-slate-100'>
                {otherUser.name}
              </h3>
              <Circle className='h-2 w-2 fill-emerald-400 text-emerald-400' />
            </div>
            <span className='shrink-0 text-[10px] text-slate-500'>
              {formatChatTime(room.last_message_at)}
            </span>
          </div>

          <p className='mt-1 line-clamp-2 text-[11px] leading-relaxed text-slate-600 dark:text-slate-400'>
            {lastMessage}
          </p>
          {Number(room.unread_count) > 0 && (
            <span className='mt-2 inline-flex rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-semibold text-slate-950'>
              {room.unread_count} unread
            </span>
          )}
        </div>
      </div>

      <div className='inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] text-emerald-300'>
        Open
        <ArrowRight className='h-3 w-3' />
      </div>
    </Link>
  );
}
