"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { withdrawApplicationAction } from "@/actions/seekerActions";
import { Loader2, Trash2 } from "lucide-react";

export default function WithdrawApplicationButton({ applicationId }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const handleWithdraw = () => {
    const confirmed = window.confirm(
      "Are you sure you want to withdraw this application? You will not be able to submit another application for this listing.",
    );

    if (!confirmed) return;

    setError("");

    startTransition(async () => {
      const result = await withdrawApplicationAction(applicationId);

      if (!result?.success) {
        setError(result?.message || "Unable to withdraw application.");
        return;
      }

      router.push("/dashboard/seeker/applications");
      router.refresh();
    });
  };

  return (
    <div>
      <button
        type='button'
        onClick={handleWithdraw}
        disabled={isPending}
        className='inline-flex items-center gap-2 rounded-lg border border-rose-500/20 bg-rose-500/5 px-3 py-2 text-[11px] font-medium text-rose-400 transition hover:border-rose-500/40 hover:bg-rose-500/10 disabled:cursor-not-allowed disabled:opacity-50'>
        {isPending ? (
          <Loader2 className='h-3.5 w-3.5 animate-spin' />
        ) : (
          <Trash2 className='h-3.5 w-3.5' />
        )}
        {isPending ? "Withdrawing..." : "Withdraw Application"}
      </button>

      {error && <p className='mt-2 text-[10px] text-rose-400'>{error}</p>}
    </div>
  );
}
