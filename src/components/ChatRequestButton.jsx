"use client";

import { useState } from "react";
import { MessageSquareText } from "lucide-react";
import ChatRequestModal from "@/components/ChatRequestModal";

export default function ChatRequestButton({ receiverId, receiverName }) {
  const [open, setOpen] = useState(false);

  if (!receiverId) return null;

  return (
    <>
      <button
        type='button'
        onClick={() => setOpen(true)}
        className='inline-flex items-center gap-2 rounded-lg border border-emerald-500/40 bg-emerald-500/15 px-3 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-200 transition-all hover:border-emerald-500/60 hover:bg-emerald-500/25 active:scale-95'>
        <MessageSquareText className='h-3.5 w-3.5' />
        Connect
      </button>

      <ChatRequestModal
        receiverId={receiverId}
        receiverName={receiverName}
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
