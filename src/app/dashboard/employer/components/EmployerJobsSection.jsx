import Link from "next/link";
import { Building2, MapPin, Trash2 } from "lucide-react";
import { deleteJobAction } from "@/actions/employerActions";

export default function EmployerJobsSection({ jobs = [] }) {
  return (
    <section className='space-y-4'>
      {/* Section Header */}
      <div className='flex items-center justify-between border-b border-slate-800 pb-3'>
        <div>
          <span className='font-mono text-[11px] font-medium uppercase tracking-widest text-slate-500'>
            Active Postings
          </span>

          <p className='mt-1 text-xs text-slate-600'>
            Manage your jobs and collaboration listings.
          </p>
        </div>

        <span className='font-mono text-[10px] tracking-wide text-slate-600'>
          {jobs.length} record{jobs.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* No Jobs */}
      {jobs.length === 0 ? (
        <div className='flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-800 px-6 py-16 text-center'>
          <div className='flex h-10 w-10 items-center justify-center rounded-lg border border-slate-800 bg-slate-950'>
            <Building2 className='h-4 w-4 text-slate-600' />
          </div>

          <h3 className='mt-4 text-sm font-medium text-slate-300'>
            No listings yet
          </h3>

          <p className='mt-1 max-w-sm text-xs text-slate-500'>
            You haven't posted any jobs or collaboration projects yet.
          </p>

          <Link
            href='/dashboard/employer/job/new'
            className='mt-4 font-mono text-[11px] text-emerald-400 transition-colors hover:text-emerald-300'>
            Create your first listing →
          </Link>

          <div className='mt-4 font-mono text-[10px] uppercase tracking-wider text-slate-700'>
            Status: <span className='text-slate-600'>NO_RECORDS</span>
          </div>
        </div>
      ) : (
        <div className='space-y-3'>
          {jobs.map((job) => (
            <div
              key={job.id}
              className='group flex flex-col gap-4 rounded-lg border border-slate-800 bg-slate-900/40 p-5 transition-all duration-150 hover:border-slate-700 sm:flex-row sm:items-center sm:justify-between'>
              {/* Job Information */}
              <div className='min-w-0 space-y-2'>
                <div className='flex flex-wrap items-center gap-2'>
                  {/* Employment Type */}
                  {job.employment_type && (
                    <span className='rounded-md border border-slate-800 bg-slate-950 px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider text-slate-400'>
                      {job.employment_type}
                    </span>
                  )}

                  {/* Listing Type */}
                  {job.listing_type && (
                    <span
                      className={`rounded-full border px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider ${
                        job.listing_type === "PROJECT"
                          ? "border-violet-500/20 bg-violet-500/10 text-violet-400"
                          : "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                      }`}>
                      {job.listing_type}
                    </span>
                  )}

                  {/* Company */}
                  <span className='flex items-center gap-1 text-xs text-slate-500'>
                    <Building2 className='h-3 w-3 text-slate-600' />
                    {job.company_name || "Independent"}
                  </span>
                </div>

                {/* Job Title */}
                <h3 className='truncate text-sm font-semibold text-slate-200'>
                  {job.title}
                </h3>

                {/* Job Meta */}
                <div className='flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500'>
                  <span className='flex items-center gap-1'>
                    <MapPin className='h-3 w-3 text-slate-600' />
                    {job.location || "Remote"}
                  </span>

                  <span className='font-mono text-[11px]'>
                    {job.salary || "Competitive"}
                  </span>

                  {job.created_at && (
                    <span className='font-mono text-[11px]'>
                      {new Date(job.created_at).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className='flex items-center gap-2 border-t border-slate-800 pt-3 sm:border-t-0 sm:pt-0'>
                <Link
                  href={`/dashboard/employer/job/${job.id}/applicants`}
                  className='flex-1 rounded-lg border border-slate-700 bg-slate-800/40 px-3 py-2 text-center text-xs font-medium text-slate-300 transition-all hover:border-slate-600 hover:bg-slate-800 hover:text-slate-100 sm:flex-none'>
                  Applicants ({job.applicant_count || 0})
                </Link>

                <form action={deleteJobAction.bind(null, job.id)}>
                  <button
                    type='submit'
                    className='inline-flex items-center gap-1.5 rounded-lg border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-xs font-medium text-rose-400 transition-all hover:bg-rose-500/20'>
                    <Trash2 className='h-3.5 w-3.5' />
                    Delete
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
