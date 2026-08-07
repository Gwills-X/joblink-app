"use client";

import { useState } from "react";
import { X, Send, MessageSquare } from "lucide-react";

export default function EmployerActionModal({ application, onUpdateStatus }) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [actionType, setActionType] = useState(
    application.status || "ACCEPTED",
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onUpdateStatus({
        application_id: application.id,
        job_id: application.job_id,
        status: actionType,
        employer_feedback: message,
      });
      setIsOpen(false);
    } catch (err) {
      console.error("Failed to submit status update:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => {
          setActionType(
            application.status === "REJECTED" ? "REJECTED" : "ACCEPTED",
          );
          setMessage(
            application.status === "ACCEPTED"
              ? "Congratulations! You have been selected for the next stage. The leadership team would love to invite you for a private chat session to discuss the role further."
              : "Thank you for your application. After careful review, we have decided to move forward with other candidates whose profiles more closely match our current requirements.",
          );
          setIsOpen(true);
        }}
        className='inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 text-xs font-medium text-emerald-400 hover:bg-emerald-500/20 transition-all'>
        <MessageSquare className='h-3.5 w-3.5' />
        Send Decision & Message
      </button>

      {isOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4'>
          <div className='w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-6'>
            <div className='flex items-center justify-between border-b border-slate-800 pb-4'>
              <div>
                <h3 className='text-sm font-semibold text-white'>
                  Candidate Communication & Decision
                </h3>
                <p className='text-xs text-slate-400 mt-0.5 font-mono'>
                  {application.candidate_name} ({application.candidate_email})
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className='rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors'>
                <X className='h-4 w-4' />
              </button>
            </div>

            <form onSubmit={handleSubmit} className='space-y-4'>
              <div>
                <label className='block font-mono text-[10px] font-medium uppercase tracking-wider text-slate-400 mb-1.5'>
                  Select Outcome Status
                </label>
                <select
                  value={actionType}
                  onChange={(e) => setActionType(e.target.value)}
                  className='w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none'>
                  <option value='ACCEPTED'>
                    ACCEPTED (Invite for Chat / Interview)
                  </option>
                  <option value='REJECTED'>
                    REJECTED (Polite Decline Note)
                  </option>
                  <option value='PENDING'>PENDING (Under Review)</option>
                </select>
              </div>

              <div>
                <label className='block font-mono text-[10px] font-medium uppercase tracking-wider text-slate-400 mb-1.5'>
                  Message / Chat Invitation Notes
                </label>
                <textarea
                  rows='5'
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder='Write a personalized message to the applicant...'
                  className='w-full rounded-xl border border-slate-800 bg-slate-950 p-3.5 text-xs text-white focus:border-emerald-500 focus:outline-none leading-relaxed'
                  required
                />
                <p className='text-[10px] text-slate-500 mt-1.5 font-mono'>
                  This message will update their status and trigger
                  notifications for your chat/interview session.
                </p>
              </div>

              <div className='flex justify-end gap-3 pt-2 border-t border-slate-800'>
                <button
                  type='button'
                  onClick={() => setIsOpen(false)}
                  className='rounded-xl border border-slate-800 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors'>
                  Cancel
                </button>
                <button
                  type='submit'
                  disabled={isSubmitting}
                  className='inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 px-5 py-2 text-xs font-semibold text-slate-950 hover:bg-emerald-400 transition-all disabled:opacity-50'>
                  <Send className='h-3.5 w-3.5' />
                  {isSubmitting ? "Sending..." : "Send Message & Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
