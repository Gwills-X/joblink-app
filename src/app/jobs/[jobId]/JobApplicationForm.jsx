"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useToasts } from "@/components/ToastProvider";
import { applyToJobAction } from "@/actions/seekerActions";

export default function JobApplicationForm({ job, authUser }) {
  const router = useRouter();
  const { addToast } = useToasts();
  const [state, formAction, isPending] = useActionState(applyToJobAction, null);

  useEffect(() => {
    if (state) {
      if (state.success) {
        addToast({ type: "success", message: state.message });
        router.push("/dashboard/seeker/applications");
      } else if (state.message) {
        addToast({ type: "error", message: state.message });
      }
    }
  }, [state, addToast, router]);

  return (
    <div className='bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-3xl p-8 shadow-xl space-y-6'>
      <div>
        <h2 className='text-xl font-bold text-white tracking-tight'>
          Submit Your{" "}
          <span className='text-emerald-400'>Application / Pitch</span>
        </h2>
        <p className='text-xs text-slate-400 mt-1 font-mono'>
          Complete the fields below with your credentials to submit your
          candidate profile.
        </p>
      </div>

      {!authUser ? (
        <div className='bg-slate-950 border border-slate-800 rounded-2xl p-8 text-center space-y-4'>
          <p className='text-sm text-slate-300'>
            You must be logged into your account to submit an application or
            collaboration pitch.
          </p>
          <Link
            href='/login'
            className='inline-block bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold px-6 py-2.5 rounded-xl text-xs transition-all shadow-md shadow-emerald-500/10'>
            Sign In to Apply &rarr;
          </Link>
        </div>
      ) : (
        <form
          action={formAction}
          encType='multipart/form-data'
          className='space-y-6'>
          <input type='hidden' name='job_id' value={job.id} />
          <input
            type='hidden'
            name='existing_cv_url'
            value={authUser.cv_url || ""}
          />

          {/* Personal Info Grid */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='space-y-2'>
              <label className='text-xs font-mono text-slate-300 block'>
                Full Name <span className='text-emerald-400'>*</span>
              </label>
              <input
                type='text'
                name='full_name'
                defaultValue={authUser.name || ""}
                required
                placeholder='e.g. Godswill Eguavoen'
                className='w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-emerald-500 font-sans'
              />
            </div>

            <div className='space-y-2'>
              <label className='text-xs font-mono text-slate-300 block'>
                Email Address <span className='text-emerald-400'>*</span>
              </label>
              <input
                type='email'
                name='email'
                defaultValue={authUser.email || ""}
                required
                placeholder='e.g. user@example.com'
                className='w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-emerald-500 font-sans'
              />
            </div>

            <div className='space-y-2'>
              <label className='text-xs font-mono text-slate-300 block'>
                Phone Number <span className='text-emerald-400'>*</span>
              </label>
              <input
                type='tel'
                name='phone'
                defaultValue={authUser.phone || ""}
                required
                placeholder='e.g. +234 800 000 0000'
                className='w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-emerald-500 font-sans'
              />
            </div>

            <div className='space-y-2'>
              <label className='text-xs font-mono text-slate-300 block'>
                GitHub Repository Link{" "}
                <span className='text-emerald-400'>*</span>
              </label>
              <input
                type='url'
                name='github_repo'
                defaultValue={authUser.github_repo || authUser.github || ""}
                required
                placeholder='https://github.com/username'
                className='w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-emerald-500 font-sans'
              />
            </div>

            <div className='space-y-2'>
              <label className='text-xs font-mono text-slate-300 block'>
                Portfolio Link{" "}
                <span className='text-slate-500'>(Optional)</span>
              </label>
              <input
                type='url'
                name='portfolio_link'
                defaultValue={
                  authUser.portfolio_link || authUser.portfolio || ""
                }
                placeholder='https://yourportfolio.com'
                className='w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-emerald-500 font-sans'
              />
            </div>

            <div className='space-y-2'>
              <label className='text-xs font-mono text-slate-300 block'>
                CV / Resume File Upload{" "}
                <span className='text-emerald-400'>*</span>
              </label>
              <input
                type='file'
                name='cv_file'
                accept='.pdf,.doc,.docx,.txt'
                className='w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-mono file:bg-emerald-500 file:text-slate-950 hover:file:bg-emerald-400 file:cursor-pointer'
              />
              {authUser.cv_url && (
                <p className='text-[10px] font-mono text-slate-400 mt-1'>
                  📌 You already have a profile resume on file. Uploading a new
                  file will override it for this application.
                </p>
              )}
            </div>
          </div>

          {/* Description / Self Introduction */}
          <div className='space-y-2 pt-2'>
            <label className='text-xs font-mono text-slate-300 block'>
              Short Bio / About Yourself{" "}
              <span className='text-emerald-400'>*</span>
            </label>
            <textarea
              name='bio'
              rows='3'
              required
              defaultValue={authUser.bio || ""}
              placeholder='A brief description of who you are, your core strengths, and tech stack experience...'
              className='w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-emerald-500 font-sans leading-relaxed'></textarea>
          </div>

          {/* Cover Letter / Pitch */}
          <div className='space-y-2'>
            <label className='text-xs font-mono text-slate-300 block'>
              Cover Letter / Why You Are Applying{" "}
              <span className='text-emerald-400'>*</span>
            </label>
            <textarea
              name='cover_letter'
              rows='5'
              required
              placeholder='Detail why you are a great fit for this specific position or collaboration project...'
              className='w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-emerald-500 font-sans leading-relaxed'></textarea>
          </div>

          <div className='flex justify-end pt-4'>
            <button
              type='submit'
              disabled={isPending}
              className='bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold px-8 py-3.5 rounded-2xl text-xs transition-all shadow-lg shadow-emerald-500/10 disabled:opacity-50'>
              {isPending
                ? "Submitting Application..."
                : "Submit Full Application \u2192"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
