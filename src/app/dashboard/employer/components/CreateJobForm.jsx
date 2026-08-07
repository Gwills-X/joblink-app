"use client";

import useActionState from "@/lib/hooks/useActionState";
import { createJobAction } from "@/actions/employerActions";

const initialState = {
  success: false,
  errors: {},
};

export default function CreateJobForm({ companies = [] }) {
  const [state, formAction, isPending] = useActionState(
    createJobAction,
    initialState,
  );

  return (
    <div className='mx-auto max-w-3xl rounded-xl border border-(--color-border) bg-(--color-surface) p-6 sm:p-8'>
      <div className='mb-6 border-b border-slate-800 pb-4'>
        <h2 className='text-lg font-semibold tracking-tight text-slate-100'>
          Post a New Listing
        </h2>
        <p className='mt-1 text-xs text-slate-500'>
          Publish an independent job, freelance gig, or collaborative project.
        </p>
      </div>

      {state?.errors?.server && (
        <div className='mb-5 rounded-lg border border-rose-500/20 bg-rose-500/10 p-3 text-xs text-rose-400'>
          {state.errors.server}
        </div>
      )}

      <form action={formAction} className='space-y-5'>
        <div>
          <label
            htmlFor='company_id'
            className='mb-1.5 block font-mono text-[11px] font-medium uppercase tracking-wider text-slate-400'>
            Associated Company{" "}
            <span className='text-slate-600 normal-case'>(Optional)</span>
          </label>
          <select
            id='company_id'
            name='company_id'
            className='block w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 transition-all duration-150'>
            <option value=''>Personal / Independent Post</option>
            {companies.map((company) => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </select>
          <p className='mt-1.5 text-xs text-slate-600'>
            Leave unselected to publish directly as an independent or community
            collaboration post.
          </p>
        </div>

        <div>
          <label
            htmlFor='title'
            className='mb-1.5 block font-mono text-[11px] font-medium uppercase tracking-wider text-slate-400'>
            Job / Project Title <span className='text-rose-400'>*</span>
          </label>
          <input
            type='text'
            id='title'
            name='title'
            required
            placeholder='e.g. Senior Full-Stack Developer'
            className='block w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 transition-all duration-150'
          />
        </div>

        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
          <div>
            <label
              htmlFor='employment_type'
              className='mb-1.5 block font-mono text-[11px] font-medium uppercase tracking-wider text-slate-400'>
              Employment Type
            </label>
            <select
              id='employment_type'
              name='employment_type'
              defaultValue='FULL_TIME'
              className='block w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 transition-all duration-150'>
              <option value='FULL_TIME'>Full Time</option>
              <option value='PART_TIME'>Part Time</option>
              <option value='CONTRACT'>Contract</option>
              <option value='INTERNSHIP'>Internship</option>
              <option value='REMOTE'>Remote</option>
            </select>
          </div>

          <div>
            <label
              htmlFor='listing_type'
              className='mb-1.5 block font-mono text-[11px] font-medium uppercase tracking-wider text-slate-400'>
              Listing Category
            </label>
            <select
              id='listing_type'
              name='listing_type'
              defaultValue='JOB'
              className='block w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 transition-all duration-150'>
              <option value='JOB'>Job Opening</option>
              <option value='PROJECT'>Collaboration Project</option>
            </select>
          </div>
        </div>

        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
          <div>
            <label
              htmlFor='location'
              className='mb-1.5 block font-mono text-[11px] font-medium uppercase tracking-wider text-slate-400'>
              Location
            </label>
            <input
              type='text'
              id='location'
              name='location'
              placeholder='e.g. Remote, Lagos, Nigeria'
              className='block w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 transition-all duration-150'
            />
          </div>

          <div>
            <label
              htmlFor='salary'
              className='mb-1.5 block font-mono text-[11px] font-medium uppercase tracking-wider text-slate-400'>
              Compensation Range
            </label>
            <input
              type='text'
              id='salary'
              name='salary'
              placeholder='e.g. $80k - $100k'
              className='block w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 transition-all duration-150'
            />
          </div>
        </div>

        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
          <div>
            <label
              htmlFor='deadline'
              className='mb-1.5 block font-mono text-[11px] font-medium uppercase tracking-wider text-slate-400'>
              Application Deadline
            </label>
            <input
              type='date'
              id='deadline'
              name='deadline'
              className='block w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 transition-all duration-150'
            />
          </div>

          <div>
            <label
              htmlFor='max_applicants'
              className='mb-1.5 block font-mono text-[11px] font-medium uppercase tracking-wider text-slate-400'>
              Max Applicants
            </label>
            <input
              type='number'
              id='max_applicants'
              name='max_applicants'
              defaultValue={50}
              min={1}
              className='block w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 transition-all duration-150'
            />
          </div>
        </div>

        <div>
          <label
            htmlFor='description'
            className='mb-1.5 block font-mono text-[11px] font-medium uppercase tracking-wider text-slate-400'>
            Description & Requirements <span className='text-rose-400'>*</span>
          </label>
          <textarea
            id='description'
            name='description'
            required
            rows={6}
            placeholder='Provide a thorough overview of the role, responsibilities, tech stack, and qualifications...'
            className='block w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 transition-all duration-150'
          />
        </div>

        <div className='flex items-center justify-end gap-3 border-t border-slate-800 pt-5'>
          <button
            type='submit'
            disabled={isPending}
            className='rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-medium text-(--color-slate) transition-all duration-150 hover:bg-emerald-400 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50'>
            {isPending ? "Publishing..." : "Publish Listing"}
          </button>
        </div>
      </form>
    </div>
  );
}
