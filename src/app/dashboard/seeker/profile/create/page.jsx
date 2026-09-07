"use client";

import Link from "next/link";
import { useActionState } from "@/lib/hooks/useActionState";
import { createSeekerProfileAction } from "@/actions/seekerActions";
import { ArrowLeft, Save, AlertCircle } from "lucide-react";

export default function CreateSeekerProfilePage() {
  const [state, formAction, isPending] = useActionState(
    createSeekerProfileAction,
    null,
  );

  return (
    <div className='mx-auto max-w-3xl space-y-5 px-4 py-7'>
      <Link
        href='/dashboard'
        className='inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-slate-500 transition hover:text-emerald-400'>
        <ArrowLeft className='h-3.5 w-3.5' />
        Dashboard
      </Link>

      <div>
        <span className='font-mono text-[10px] uppercase tracking-widest text-slate-500'>
          Candidate Onboarding
        </span>
        <h1 className='mt-1 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100'>
          Create Your Profile
        </h1>
        <p className='mt-1 text-xs leading-relaxed text-slate-500'>
          Complete your professional profile before applying for opportunities
          on JobLink.
        </p>
      </div>

      {state?.message && (
        <div
          className={`rounded-lg border px-4 py-3 text-xs ${
            state.success
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
              : "border-rose-500/30 bg-rose-500/10 text-rose-300"
          }`}>
          {state.message}
        </div>
      )}

      <form action={formAction} className='space-y-4'>
        <div className='space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none'>
          <div>
            <label className='mb-1.5 block text-xs font-semibold text-slate-900 dark:text-slate-200'>
              Professional Headline <span className='text-emerald-400'>*</span>
            </label>
            <input
              type='text'
              name='headline'
              required
              maxLength={150}
              placeholder='e.g. Full-Stack Developer | React & Node.js'
              className='w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:placeholder:text-slate-600'
            />
            <p className='mt-1 text-[10px] text-slate-600'>
              A short description of your professional role.
            </p>
          </div>

          <div>
            <label className='mb-1.5 block text-xs font-semibold text-slate-900 dark:text-slate-200'>
              Professional Bio <span className='text-emerald-400'>*</span>
            </label>
            <textarea
              name='bio'
              required
              rows={5}
              maxLength={3000}
              placeholder='Tell employers about your experience, skills and career goals...'
              className='w-full resize-none rounded-lg border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:placeholder:text-slate-600'
            />
          </div>

          <div>
            <label className='mb-1.5 block text-xs font-semibold text-slate-200'>
              Location
            </label>
            <input
              type='text'
              name='location'
              maxLength={150}
              placeholder='e.g. Abuja, Nigeria'
              className='w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-200 outline-none placeholder:text-slate-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30'
            />
          </div>

          <div>
            <label className='mb-1.5 block text-xs font-semibold text-slate-200'>
              GitHub Username
            </label>
            <input
              type='text'
              name='github_handle'
              maxLength={100}
              placeholder='your-github-username'
              className='w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-200 outline-none placeholder:text-slate-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30'
            />
          </div>

          <div>
            <label className='mb-1.5 block text-xs font-semibold text-slate-200'>
              Portfolio / Website
            </label>
            <input
              type='url'
              name='website_url'
              placeholder='https://yourportfolio.com'
              className='w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-200 outline-none placeholder:text-slate-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30'
            />
          </div>
        </div>

        <button
          type='submit'
          disabled={isPending}
          className='inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-5 py-2.5 text-xs font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.98]'>
          <Save className='h-3.5 w-3.5' />
          {isPending ? "Creating Profile..." : "Create Profile"}
        </button>
      </form>

      <div className='flex gap-3 rounded-lg border border-amber-500/20 bg-amber-500/5 p-4 text-xs text-amber-300'>
        <AlertCircle className='mt-0.5 h-4 w-4 shrink-0' />
        <div>
          <p className='font-semibold'>Profile Required</p>
          <p className='mt-1 leading-relaxed text-[11px] text-amber-200/70'>
            A complete professional profile helps employers understand your
            background and qualifications.
          </p>
        </div>
      </div>
    </div>
  );
}
