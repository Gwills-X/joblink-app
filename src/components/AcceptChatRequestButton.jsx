"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCheck, X } from "lucide-react";
import {
  acceptChatRequestAction,
  rejectChatRequestAction,
} from "@/actions/chatActions";

export default function AcceptChatRequestButton({ requestId }) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const handleRequest = async (action) => {
    setIsPending(true);
    const result = await action(requestId);

    if (result?.success && result.roomId) {
      window.dispatchEvent(
        new CustomEvent("toast", {
          detail: { type: "success", message: result.message },
        }),
      );
      router.push(`/dashboard/chats/${result.roomId}`);
      return;
    }

    if (result?.success) {
      window.dispatchEvent(
        new CustomEvent("toast", {
          detail: { type: "success", message: result.message },
        }),
      );
      window.location.reload();
      return;
    }

    window.dispatchEvent(
      new CustomEvent("toast", {
        detail: {
          type: "error",
          message: result?.message || "Unable to create the chat room.",
        },
      }),
    );
    setIsPending(false);
  };

  return (
    <div className='flex flex-wrap gap-2'>
      <button
        type='button'
        onClick={() => handleRequest(acceptChatRequestAction)}
        disabled={isPending}
        className='inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-3 py-2 text-xs font-semibold text-slate-950 transition-all hover:bg-emerald-400 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60'>
        <CheckCheck className='h-3.5 w-3.5' />
        {isPending ? "Working..." : "Accept & Chat"}
      </button>
      <button
        type='button'
        onClick={() => handleRequest(rejectChatRequestAction)}
        disabled={isPending}
        className='inline-flex items-center gap-2 rounded-lg border border-slate-600 px-3 py-2 text-xs font-semibold text-slate-300 transition hover:border-rose-400 hover:text-rose-300 disabled:cursor-not-allowed disabled:opacity-60'>
        <X className='h-3.5 w-3.5' />
        Decline
      </button>
    </div>
  );
}
