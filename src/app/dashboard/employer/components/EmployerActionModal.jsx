"use client";

import { useState } from "react";
import { X, Send, MessageSquare } from "lucide-react";

export default function EmployerActionModal({ application, onUpdateStatus }) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [actionType, setActionType] = useState(application.status || "PENDING");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getDefaultMessage = (status) => {
    switch (status) {
      case "ACCEPTED":
        return "Congratulations! You have been selected for the next stage. The leadership team would love to invite you for a private chat session to discuss the role further.";

      case "REJECTED":
        return "Thank you for your application. After careful review, we have decided to move forward with other candidates whose profiles more closely match our current requirements.";

      case "SHORTLISTED":
        return "Thank you for your application. Your profile has been shortlisted and is currently under further consideration. We will be in touch with you regarding the next stage.";

      case "PENDING":
      default:
        return "Thank you for your application. Your application is still under review. We will contact you once a decision has been made.";
    }
  };

  const handleOpen = () => {
    const initialStatus = application.status || "PENDING";

    setActionType(initialStatus);
    setMessage(getDefaultMessage(initialStatus));
    setIsOpen(true);
  };

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;

    setActionType(newStatus);
    setMessage(getDefaultMessage(newStatus));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!message.trim()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await onUpdateStatus({
        application_id: application.application_id,
        job_id: application.job_id,
        status: actionType,
        employer_feedback: message.trim(),
      });

      if (result?.success === false) {
        console.error(
          "Application update failed:",
          result.errors || result.message,
        );
        return;
      }

      setIsOpen(false);
    } catch (error) {
      console.error("Failed to submit application update:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button
        type='button'
        onClick={handleOpen}
        className='inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 text-xs font-medium text-emerald-400 hover:bg-emerald-500/20 transition-all'>
        <MessageSquare className='h-3.5 w-3.5' />
        Send Decision & Message
      </button>

      {isOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4'>
          <div className='w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-6'>
            {/* Header */}
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
                type='button'
                onClick={() => setIsOpen(false)}
                className='rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors'>
                <X className='h-4 w-4' />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className='space-y-4'>
              {/* Status */}
              <div>
                <label className='block font-mono text-[10px] font-medium uppercase tracking-wider text-slate-400 mb-1.5'>
                  Select Outcome Status
                </label>

                <select
                  value={actionType}
                  onChange={handleStatusChange}
                  className='w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none'>
                  <option value='ACCEPTED'>ACCEPTED</option>

                  <option value='REJECTED'>REJECTED</option>

                  <option value='SHORTLISTED'>SHORTLISTED</option>

                  <option value='PENDING'>PENDING</option>
                </select>
              </div>

              {/* Message */}
              <div>
                <label className='block font-mono text-[10px] font-medium uppercase tracking-wider text-slate-400 mb-1.5'>
                  Message / Feedback
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
                  This message will be saved with the application decision.
                </p>
              </div>

              {/* Buttons */}
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

                  {isSubmitting ? "Saving..." : "Save Decision & Message"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
