"use client";

import { useEffect, useState } from "react";
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

  const [companyId, setCompanyId] = useState("");
  const [listingType, setListingType] = useState("JOB");

  const isCompanyPost = Boolean(companyId);

  // ---------------------------------------------------------
  // Keep listing type valid when company selection changes
  // ---------------------------------------------------------

  useEffect(() => {
    if (isCompanyPost && listingType === "COLLABORATION") {
      setListingType("JOB");
    }

    if (!isCompanyPost && listingType === "PARTNERSHIP") {
      setListingType("JOB");
    }
  }, [isCompanyPost, listingType]);

  return (
    <div className='rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-8'>
      <div className='mb-6'>
        <h2 className='text-lg font-semibold text-slate-100'>
          Post a New Listing
        </h2>

        <p className='mt-1 text-sm text-slate-500'>
          Create a job, project, collaboration, or partnership opportunity.
        </p>
      </div>

      {state?.errors?.server && (
        <div className='mb-5 rounded-lg border border-rose-500/20 bg-rose-500/10 p-3 text-xs text-rose-400'>
          {state.errors.server[0]}
        </div>
      )}

      <form action={formAction} className='space-y-5'>
        {/* COMPANY */}

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
            value={companyId}
            onChange={(e) => setCompanyId(e.target.value)}
            disabled={isPending}
            className='block w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 transition-all duration-150 disabled:opacity-50'>
            <option value=''>Personal / Independent Post</option>

            {companies.map((company, index) => (
              <option key={company.id || index} value={company.id}>
                {company.name}
              </option>
            ))}
          </select>

          <p className='mt-1.5 text-xs text-slate-600'>
            {isCompanyPost
              ? "This listing will be published on behalf of the selected company."
              : "This listing will be published as your independent post."}
          </p>
        </div>

        {/* TITLE */}

        <div>
          <label
            htmlFor='title'
            className='mb-1.5 block font-mono text-[11px] font-medium uppercase tracking-wider text-slate-400'>
            Listing Title <span className='text-rose-400'>*</span>
          </label>

          <input
            type='text'
            id='title'
            name='title'
            required
            disabled={isPending}
            placeholder={
              listingType === "JOB"
                ? "e.g. Senior Full-Stack Developer"
                : listingType === "PROJECT"
                  ? "e.g. E-commerce Website Development"
                  : listingType === "COLLABORATION"
                    ? "e.g. Looking for a UI/UX Designer to Collaborate"
                    : "e.g. Partnership Opportunity for Digital Product"
            }
            className='block w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 transition-all duration-150 disabled:opacity-50'
          />
        </div>

        {/* EMPLOYMENT + LISTING TYPE */}

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
              disabled={isPending}
              className='block w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 transition-all duration-150 disabled:opacity-50'>
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
              value={listingType}
              onChange={(e) => setListingType(e.target.value)}
              disabled={isPending}
              className='block w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 transition-all duration-150 disabled:opacity-50'>
              <option value='JOB'>Job Opening</option>

              <option value='PROJECT'>Project</option>

              {!isCompanyPost && (
                <option value='COLLABORATION'>Collaboration</option>
              )}

              {isCompanyPost && (
                <option value='PARTNERSHIP'>Partnership</option>
              )}
            </select>

            <p className='mt-1.5 text-xs text-slate-600'>
              {isCompanyPost
                ? "Companies can create jobs, projects, and partnerships."
                : "Independent posts can be jobs, projects, or collaborations."}
            </p>
          </div>
        </div>

        {/* LOCATION + SALARY */}

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
              disabled={isPending}
              placeholder='e.g. Remote, Lagos, Nigeria'
              className='block w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 transition-all duration-150 disabled:opacity-50'
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
              disabled={isPending}
              placeholder='e.g. ₦300,000 - ₦500,000'
              className='block w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 transition-all duration-150 disabled:opacity-50'
            />
          </div>
        </div>

        {/* DEADLINE + MAX APPLICANTS */}

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
              disabled={isPending}
              className='block w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 transition-all duration-150 disabled:opacity-50'
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
              disabled={isPending}
              className='block w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 transition-all duration-150 disabled:opacity-50'
            />
          </div>
        </div>

        {/* DESCRIPTION */}

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
            disabled={isPending}
            placeholder={
              listingType === "JOB"
                ? "Describe the role, responsibilities, qualifications, and requirements..."
                : listingType === "PROJECT"
                  ? "Describe the project, what needs to be done, required skills, and expected outcome..."
                  : listingType === "COLLABORATION"
                    ? "Describe what you are working on, what skills you need, and how you would like to collaborate..."
                    : "Describe the partnership opportunity, what your company brings, what you are looking for, and how both parties can work together..."
            }
            className='block w-full resize-y rounded-lg border border-slate-800 bg-slate-950 px-3 py-2.5 text-sm leading-relaxed text-slate-100 placeholder:text-slate-600 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 transition-all duration-150 disabled:opacity-50'
          />
        </div>

        {/* SUBMIT */}

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
