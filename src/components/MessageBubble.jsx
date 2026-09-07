"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { deleteMessageAction } from "@/actions/chatActions";

export default function MessageBubble({ message, currentUserId, roomId }) {
  const isMine = message.sender_id === currentUserId;
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm("Delete message?")) return;
    setIsDeleting(true);
    const result = await deleteMessageAction(String(message.id), roomId);
    if (!result?.success) setIsDeleting(false);
  };

  return (
    <div className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
          isMine
            ? "bg-emerald-500 text-slate-950"
            : "border border-slate-200 bg-white text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
        }`}>
        <div
          className={`mb-1 text-[10px] uppercase tracking-[0.2em] ${
            isMine ? "text-slate-900/70" : "text-slate-600 dark:text-slate-400"
          }`}>
          {isMine ? "You" : message.sender_name}
        </div>
        <p className='whitespace-pre-wrap break-words'>{message.content}</p>
        <button
          type='button'
          onClick={handleDelete}
          disabled={isDeleting}
          title='Delete message'
          className='mt-2 inline-flex text-slate-900/60 transition hover:text-rose-700 disabled:opacity-50 dark:text-slate-400/70 dark:hover:text-rose-300'>
          <Trash2 className='h-3.5 w-3.5' />
        </button>
      </div>
    </div>
  );
}
