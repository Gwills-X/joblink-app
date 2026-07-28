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
    <div className='max-w-3xl mx-auto bg-white border border-slate-200 rounded-xl shadow-sm p-6 sm:p-8'>
      <div className='mb-6 border-b border-slate-100 pb-4'>
        <h2 className='text-xl font-bold text-slate-900'>Post a New Listing</h2>
        <p className='text-sm text-slate-500 mt-1'>
          Create an employment opportunity, freelance gig, or collaborative
          project.
        </p>
      </div>

      {state?.errors?.server && (
        <div className='mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm'>
          {state.errors.server}
        </div>
      )}

      <form action={formAction} className='space-y-6'>
        {/* Optional Company Selection Dropdown */}
        <div>
          <label
            htmlFor='company_id'
            className='block text-sm font-semibold text-slate-700 mb-1'>
            Associated Company{" "}
            <span className='text-slate-400 font-normal'>(Optional)</span>
          </label>
          <select
            id='company_id'
            name='company_id'
            className='w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'>
            <option value=''>Personal / Independent Post (No Company)</option>
            {companies.map((company) => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </select>
          <p className='text-xs text-slate-500 mt-1'>
            Leave unselected to publish directly as an independent or community
            collaboration post.
          </p>
        </div>

        {/* Title */}
        <div>
          <label
            htmlFor='title'
            className='block text-sm font-semibold text-slate-700 mb-1'>
            Job / Project Title <span className='text-red-500'>*</span>
          </label>
          <input
            type='text'
            id='title'
            name='title'
            required
            placeholder='e.g. Senior Full-Stack Developer or Open Source Collab'
            className='w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'
          />
        </div>

        {/* Employment Type & Listing Type Grid */}
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          <div>
            <label
              htmlFor='employment_type'
              className='block text-sm font-semibold text-slate-700 mb-1'>
              Employment Type
            </label>
            <select
              id='employment_type'
              name='employment_type'
              defaultValue='FULL_TIME'
              className='w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'>
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
              className='block text-sm font-semibold text-slate-700 mb-1'>
              Listing Category
            </label>
            <select
              id='listing_type'
              name='listing_type'
              defaultValue='JOB'
              className='w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'>
              <option value='JOB'>Job Opening</option>
              <option value='PROJECT'>Collaboration Project</option>
            </select>
          </div>
        </div>

        {/* Location & Salary Grid */}
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          <div>
            <label
              htmlFor='location'
              className='block text-sm font-semibold text-slate-700 mb-1'>
              Location
            </label>
            <input
              type='text'
              id='location'
              name='location'
              placeholder='e.g. Remote, Lagos, Nigeria'
              className='w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'
            />
          </div>

          <div>
            <label
              htmlFor='salary'
              className='block text-sm font-semibold text-slate-700 mb-1'>
              Salary / Compensation Range
            </label>
            <input
              type='text'
              id='salary'
              name='salary'
              placeholder='e.g. $80k - $100k or Stipend'
              className='w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'
            />
          </div>
        </div>

        {/* Deadline & Max Applicants */}
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          <div>
            <label
              htmlFor='deadline'
              className='block text-sm font-semibold text-slate-700 mb-1'>
              Application Deadline
            </label>
            <input
              type='date'
              id='deadline'
              name='deadline'
              className='w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'
            />
          </div>

          <div>
            <label
              htmlFor='max_applicants'
              className='block text-sm font-semibold text-slate-700 mb-1'>
              Max Applicants Limit
            </label>
            <input
              type='number'
              id='max_applicants'
              name='max_applicants'
              defaultValue={50}
              min={1}
              className='w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor='description'
            className='block text-sm font-semibold text-slate-700 mb-1'>
            Job Description & Requirements{" "}
            <span className='text-red-500'>*</span>
          </label>
          <textarea
            id='description'
            name='description'
            required
            rows={6}
            placeholder='Provide a thorough overview of the role, responsibilities, tech stack, and qualifications...'
            className='w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'></textarea>
        </div>

        {/* Submit Actions */}
        <div className='flex items-center justify-end space-x-4 pt-4 border-t border-slate-100'>
          <button
            type='submit'
            disabled={isPending}
            className='px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm transition-colors text-sm disabled:opacity-50'>
            {isPending ? "Publishing Listing..." : "Publish Listing"}
          </button>
        </div>
      </form>
    </div>
  );
}
