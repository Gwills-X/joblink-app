"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Bookmark } from "lucide-react";
import { setSavedOpportunityAction } from "@/actions/savedJobs";

export default function SaveOpportunityButton({
  jobId,
  currentUserId,
  initiallySaved = false,
}) {
  const [isSaved, setIsSaved] = useState(initiallySaved);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  if (!currentUserId) {
    return (
      <Link
        href={`/login?next=${encodeURIComponent(`/jobs/${jobId}`)}`}
        aria-label='Sign in to save this opportunity'
        title='Sign in to save this opportunity'
        className='inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-300 text-slate-500 transition hover:border-emerald-500 hover:text-emerald-600 dark:border-slate-700 dark:text-slate-400 dark:hover:text-emerald-400'>
        <Bookmark className='h-4 w-4' />
      </Link>
    );
  }

  function toggleSaved() {
    setMessage("");
    startTransition(async () => {
      const result = await setSavedOpportunityAction(jobId, !isSaved);
      if (!result?.success) {
        setMessage(result?.message || "Could not update saved opportunities.");
        return;
      }

      setIsSaved(result.isSaved);
      setMessage(result.message);
      router.refresh();
    });
  }

  return (
    <div className='flex flex-col items-end gap-1'>
      <button
        type='button'
        onClick={toggleSaved}
        disabled={isPending}
        aria-pressed={isSaved}
        aria-label={isSaved ? "Remove saved opportunity" : "Save opportunity"}
        title={isSaved ? "Remove from saved opportunities" : "Save opportunity"}
        className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition disabled:cursor-wait disabled:opacity-50 ${
          isSaved
            ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
            : "border-slate-300 text-slate-500 hover:border-emerald-500 hover:text-emerald-600 dark:border-slate-700 dark:text-slate-400 dark:hover:text-emerald-400"
        }`}>
        <Bookmark
          className='h-4 w-4'
          fill={isSaved ? "currentColor" : "none"}
        />
      </button>
      <span
        aria-live='polite'
        className={`max-w-40 text-right text-[10px] ${
          message.startsWith("Could not") ||
          message === "Opportunity not found."
            ? "text-rose-500"
            : "text-emerald-700 dark:text-emerald-400"
        }`}>
        {isPending ? "Updating..." : message}
      </span>
    </div>
  );
}
