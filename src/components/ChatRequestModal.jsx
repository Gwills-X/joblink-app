"use client";

import { useState } from "react";
import { MessageSquareText, X } from "lucide-react";
import { sendChatRequestAction } from "@/actions/chatActions";

export default function ChatRequestModal({
  receiverId,
  receiverName,
  open,
  onClose,
}) {
  const [message, setMessage] = useState(
    "Hi, I’d like to connect and learn more about your work.",
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  if (!open) return null;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);

    const formData = new FormData();
    formData.append("receiver_id", receiverId);
    formData.append("message", message);

    const result = await sendChatRequestAction(formData);
    setFeedback(result);
    setIsSubmitting(false);

    if (result?.success) {
      setMessage("Hi, I’d like to connect and learn more about your work.");
      setTimeout(() => onClose && onClose(), 700);
    }
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-slate-950/10 px-4 backdrop-blur-sm dark:bg-slate-950/80'>
      <div className='w-full max-w-lg rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-2xl dark:border-slate-700 dark:bg-slate-900 dark:text-white'>
        <div className='flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-700'>
          <div className='flex items-center gap-3'>
            <div className='rounded-lg bg-emerald-500/10 p-2 text-emerald-400'>
              <MessageSquareText className='h-4 w-4' />
            </div>
            <div>
              <h3 className='text-base font-semibold text-slate-900 dark:text-slate-100'>
                Chat request
              </h3>
              <p className='text-xs text-slate-500'>
                Send a request to {receiverName}
              </p>
            </div>
          </div>

          <button
            type='button'
            onClick={onClose}
            className='rounded-lg border border-slate-200 p-2 text-slate-600 hover:text-slate-900 dark:border-slate-700 dark:text-slate-400 dark:hover:text-slate-100'>
            <X className='h-4 w-4' />
          </button>
        </div>

        <form onSubmit={handleSubmit} className='space-y-5 p-5'>
          <div>
            <label className='mb-2 block text-[11px] font-medium uppercase tracking-widest text-slate-500'>
              Message
            </label>
            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              rows={5}
              className='w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-3 text-sm text-slate-900 outline-none ring-0 transition placeholder:text-slate-400 focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:placeholder:text-slate-500'
              placeholder='I’d like to connect and learn more about your work.'
            />
          </div>

          {feedback && (
            <div
              className={`rounded-lg border px-3 py-2 text-sm ${feedback.success ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300" : "border-red-500/30 bg-red-500/10 text-red-300"}`}>
              {feedback.message}
            </div>
          )}

          <div className='flex justify-end gap-3'>
            <button
              type='button'
              onClick={onClose}
              className='rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700 dark:border-slate-700 dark:text-slate-300'>
              Cancel
            </button>
            <button
              type='submit'
              disabled={isSubmitting}
              className='rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-70'>
              {isSubmitting ? "Sending..." : "Send Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
