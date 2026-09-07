"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCheck, MessageSquareText } from "lucide-react";
import ChatRequestModal from "@/components/ChatRequestModal";
import { acceptChatRequestAction } from "@/actions/chatActions";

export default function ChatRequestButton({
  receiverId,
  receiverName,
  relationshipStatus = "NO_RELATIONSHIP",
  roomId,
  requestId,
}) {
  const [open, setOpen] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);
  const router = useRouter();

  if (!receiverId || relationshipStatus === "SELF") return null;

  if (relationshipStatus === "CHAT_EXISTS" && roomId) {
    return (
      <Link
        href={`/dashboard/chats/${roomId}`}
        className='inline-flex items-center gap-2 rounded-lg border border-emerald-500/40 bg-emerald-500/15 px-3 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-200 transition-all hover:border-emerald-500/60 hover:bg-emerald-500/25'>
        <MessageSquareText className='h-3.5 w-3.5' />
        Message
      </Link>
    );
  }

  if (relationshipStatus === "REQUEST_SENT") {
    return (
      <button
        type='button'
        disabled
        className='inline-flex cursor-not-allowed items-center gap-2 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-amber-200'>
        Request Pending
      </button>
    );
  }

  if (relationshipStatus === "REQUEST_RECEIVED" && requestId) {
    const accept = async () => {
      setIsAccepting(true);
      const result = await acceptChatRequestAction(requestId);
      if (result?.success && result.roomId)
        router.push(`/dashboard/chats/${result.roomId}`);
      else setIsAccepting(false);
    };

    return (
      <button
        type='button'
        onClick={accept}
        disabled={isAccepting}
        className='inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-3 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-950 transition-all hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60'>
        <CheckCheck className='h-3.5 w-3.5' />
        {isAccepting ? "Accepting..." : "Accept Request"}
      </button>
    );
  }

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
