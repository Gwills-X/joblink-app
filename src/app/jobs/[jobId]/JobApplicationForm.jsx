"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useToasts } from "@/components/ToastProvider";
import { applyToJobAction } from "@/actions/seekerActions";

export default function JobApplicationForm({
  job,
  authUser,
  remainingSlots,
  applicationLabel = "Application",
  listingType = "JOB",
}) {
  const router = useRouter();
  const { addToast } = useToasts();

  const [state, formAction, isPending] = useActionState(applyToJobAction, null);

  const [cvFileSelected, setCvFileSelected] = useState(false);

  const isJob = listingType === "JOB";

  const heading = isJob
    ? "Submit Your Application"
    : `Submit Your ${applicationLabel}`;

  const description = isJob
    ? "Complete the fields below with your credentials to apply for this position."
    : `Complete the fields below to submit your ${applicationLabel.toLowerCase()} for this opportunity.`;

  const submitButtonText = isJob
    ? "Submit Full Application →"
    : `Submit ${applicationLabel} →`;

  useEffect(() => {
    if (!state) return;

    if (state.success) {
      addToast({
        type: "success",
        message: state.message || `${applicationLabel} submitted successfully.`,
      });

      router.push("/dashboard/seeker/applications");
    } else if (state.message) {
      addToast({
        type: "error",
        message: state.message,
      });
    }
  }, [state, addToast, router, applicationLabel]);

  // ---------------------------------------------------------
  // NOT LOGGED IN
  // ---------------------------------------------------------

  if (!authUser) {
    return (
      <div className='space-y-4 rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-900 shadow-md backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/60 dark:text-white dark:shadow-xl'>
        <p className='text-sm text-slate-700 dark:text-slate-300'>
          You must be logged into your account to submit an{" "}
          {isJob ? "application" : "opportunity proposal"}.
        </p>

        <Link
          href='/login'
          className='inline-block rounded-xl bg-emerald-500 px-6 py-2.5 text-xs font-semibold text-slate-950 shadow-md shadow-emerald-500/10 transition-all hover:bg-emerald-400'>
          Sign In to Continue →
        </Link>
      </div>
    );
  }

  // ---------------------------------------------------------
  // FORM
  // ---------------------------------------------------------

  return (
    <div className='space-y-6 rounded-3xl border border-slate-200 bg-white p-8 text-slate-900 shadow-md backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/60 dark:text-white dark:shadow-xl'>
      {/* HEADER */}
      <div className='space-y-2'>
        <div className='flex flex-wrap items-center justify-between gap-3'>
          <h2 className='text-xl font-bold tracking-tight text-slate-900 dark:text-white'>
            {heading}
          </h2>

          <span className='rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 font-mono text-xs font-semibold text-emerald-400'>
            {remainingSlots} {remainingSlots === 1 ? "slot" : "slots"} remaining
          </span>
        </div>

        <p className='font-mono text-xs text-slate-600 dark:text-slate-400'>
          {description}
        </p>
      </div>

      {/* SERVER ERROR */}
      {state?.errors?.server && (
        <div className='rounded-xl border border-rose-500/20 bg-rose-500/10 p-4'>
          <p className='text-xs leading-relaxed text-rose-400'>
            {Array.isArray(state.errors.server)
              ? state.errors.server[0]
              : state.errors.server}
          </p>
        </div>
      )}

      <form action={formAction} className='space-y-6'>
        <input type='hidden' name='job_id' value={job.id} />

        <input
          type='hidden'
          name='existing_cv_url'
          value={authUser.cv_url || ""}
        />

        <input type='hidden' name='listing_type' value={listingType} />

        {/* PERSONAL INFORMATION */}
        <div className='space-y-4'>
          <div>
            <h3 className='text-sm font-semibold text-slate-900 dark:text-white'>
              Personal Information
            </h3>

            <p className='mt-1 text-xs text-slate-600 dark:text-slate-500'>
              Make sure your contact information is correct.
            </p>
          </div>

          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            {/* NAME */}
            <div className='space-y-2'>
              <label className='block font-mono text-xs text-slate-700 dark:text-slate-300'>
                Full Name <span className='text-emerald-400'>*</span>
              </label>

              <input
                type='text'
                name='full_name'
                defaultValue={authUser.name || ""}
                required
                placeholder='e.g. Godswill Eguavoen'
                disabled={isPending}
                className='w-full rounded-xl border border-slate-300 bg-slate-50 p-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 disabled:opacity-50'
              />
            </div>

            {/* EMAIL */}
            <div className='space-y-2'>
              <label className='block font-mono text-xs text-slate-700 dark:text-slate-300'>
                Email Address <span className='text-emerald-400'>*</span>
              </label>

              <input
                type='email'
                name='email'
                defaultValue={authUser.email || ""}
                required
                placeholder='e.g. user@example.com'
                disabled={isPending}
                className='w-full rounded-xl border border-slate-300 bg-slate-50 p-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 disabled:opacity-50'
              />
            </div>

            {/* PHONE */}
            <div className='space-y-2'>
              <label className='block font-mono text-xs text-slate-700 dark:text-slate-300'>
                Phone Number <span className='text-emerald-400'>*</span>
              </label>

              <input
                type='tel'
                name='phone'
                defaultValue={authUser.phone || ""}
                required
                placeholder='e.g. +234 800 000 0000'
                disabled={isPending}
                className='w-full rounded-xl border border-slate-300 bg-slate-50 p-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 disabled:opacity-50'
              />
            </div>

            {/* GITHUB */}
            <div className='space-y-2'>
              <label className='block font-mono text-xs text-slate-700 dark:text-slate-300'>
                GitHub Repository Link{" "}
                <span className='text-emerald-400'>*</span>
              </label>

              <input
                type='url'
                name='github_repo'
                defaultValue={authUser.github_repo || authUser.github || ""}
                required
                placeholder='https://github.com/username'
                disabled={isPending}
                className='w-full rounded-xl border border-slate-300 bg-slate-50 p-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 disabled:opacity-50'
              />
            </div>

            {/* PORTFOLIO */}
            <div className='space-y-2'>
              <label className='block font-mono text-xs text-slate-700 dark:text-slate-300'>
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
                disabled={isPending}
                className='w-full rounded-xl border border-slate-300 bg-slate-50 p-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 disabled:opacity-50'
              />
            </div>

            {/* CV */}
            <div className='space-y-2'>
              <label className='block font-mono text-xs text-slate-700 dark:text-slate-300'>
                CV / Resume <span className='text-emerald-400'>*</span>
              </label>

              <input
                type='file'
                name='cv_file'
                accept='.pdf,.doc,.docx,.txt'
                disabled={isPending}
                onChange={(event) => {
                  setCvFileSelected(Boolean(event.target.files?.length));
                }}
                className='w-full rounded-xl border border-slate-300 bg-slate-50 p-2.5 text-xs text-slate-700 file:mr-4 file:rounded-lg file:border-0 file:bg-emerald-500 file:px-4 file:py-2 file:font-mono file:text-xs file:text-slate-950 hover:file:bg-emerald-400 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300'
              />

              {authUser.cv_url ? (
                <p className='text-[10px] leading-relaxed text-slate-600 dark:text-slate-400'>
                  📌 You already have a resume saved to your profile. You can
                  use it, or upload a new one for this{" "}
                  {isJob ? "application" : "proposal"}.
                </p>
              ) : (
                <p className='text-[10px] leading-relaxed text-amber-400'>
                  Please upload your CV/resume to continue.
                </p>
              )}

              {cvFileSelected && (
                <p className='text-[10px] font-mono text-emerald-400'>
                  ✓ New resume selected
                </p>
              )}
            </div>
          </div>
        </div>

        {/* BIO */}
        <div className='space-y-2 border-t border-slate-200 pt-6 dark:border-slate-800'>
          <label className='block font-mono text-xs text-slate-700 dark:text-slate-300'>
            Short Bio / About Yourself{" "}
            <span className='text-emerald-400'>*</span>
          </label>

          <textarea
            name='bio'
            rows={4}
            required
            defaultValue={authUser.bio || ""}
            disabled={isPending}
            placeholder='Tell the employer about yourself, your experience, strengths, skills, and relevant background...'
            className='w-full rounded-xl border border-slate-300 bg-slate-50 p-4 text-sm leading-relaxed text-slate-900 outline-none placeholder:text-slate-400 focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 disabled:opacity-50'
          />
        </div>

        {/* COVER LETTER / PITCH */}
        <div className='space-y-2'>
          <label className='block font-mono text-xs text-slate-700 dark:text-slate-300'>
            {isJob
              ? "Cover Letter / Why You Are Applying"
              : `${applicationLabel} / Why You Are Interested`}{" "}
            <span className='text-emerald-400'>*</span>
          </label>

          <textarea
            name='cover_letter'
            rows={6}
            required
            disabled={isPending}
            placeholder={
              isJob
                ? "Explain why you are a strong fit for this position..."
                : `Explain your interest in this ${listingType.toLowerCase()} and what you can bring to the opportunity...`
            }
            className='w-full rounded-xl border border-slate-300 bg-slate-50 p-4 text-sm leading-relaxed text-slate-900 outline-none placeholder:text-slate-400 focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 disabled:opacity-50'
          />
        </div>

        {/* SUBMIT */}
        <div className='flex flex-col gap-4 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800'>
          <div>
            <p className='font-mono text-[10px] text-slate-500'>
              By submitting, your information will be sent to the listing owner
              for review.
            </p>
          </div>

          <button
            type='submit'
            disabled={isPending || remainingSlots <= 0}
            className='rounded-2xl bg-emerald-500 px-8 py-3.5 text-xs font-semibold text-slate-950 shadow-lg shadow-emerald-500/10 transition-all hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50'>
            {isPending ? "Submitting..." : submitButtonText}
          </button>
        </div>
      </form>
    </div>
  );
}
