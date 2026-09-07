import getAuthUser from "@/lib/getAuthUser";
import { redirect } from "next/navigation";
import Link from "next/link";
import { employerEngine } from "@/services/employerEngine";
import { updateJobAction } from "@/actions/employerActions";

export const dynamic = "force-dynamic";

export default async function EmployerJobEditPage({ params }) {
  const authUser = await getAuthUser();
  if (!authUser) redirect("/login");

  const jobId = params?.jobId;
  const userId = String(authUser.userId || authUser.id);
  const job = await employerEngine.getJobById(jobId, userId);

  if (!job) redirect("/dashboard/employer");

  return (
    <div className='mx-auto max-w-4xl py-8 px-4'>
      <div className='flex flex-col gap-4 border-b border-slate-800 pb-5 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <span className='block font-mono text-[11px] font-medium uppercase tracking-widest text-slate-500'>
            Edit Listing
          </span>
          <h1 className='mt-1 text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100'>
            Update {job.title}
          </h1>
          <p className='mt-1 text-xs text-slate-500'>
            Make changes to the job details, status, or applicant cap.
          </p>
        </div>

        <div className='flex items-center gap-2'>
          <Link
            href='/dashboard/employer'
            className='inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-transparent px-4 py-2 text-xs font-medium text-slate-700 transition-all duration-150 hover:border-slate-400 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-700 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-800/50 dark:hover:text-slate-100'>
            Employer Dashboard
          </Link>
          <Link
            href={`/dashboard/employer/job/${jobId}/applicants`}
            className='inline-flex items-center gap-2 rounded-lg bg-slate-100 px-4 py-2 text-xs font-medium text-slate-700 transition-all duration-150 hover:bg-slate-200 hover:text-slate-900 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-900/80 dark:hover:text-white'>
            View Applicants
          </Link>
        </div>
      </div>

      <div className='rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none'>
        <form action={updateJobAction.bind(null, jobId)} className='space-y-6'>
          <div>
            <label className='mb-1.5 block font-mono text-[11px] font-medium uppercase tracking-wider text-slate-600 dark:text-slate-400'>
              Job Title
            </label>
            <input
              name='title'
              defaultValue={job.title}
              required
              className='block w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 transition-all duration-150 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100'
            />
          </div>

          <div>
            <label className='mb-1.5 block font-mono text-[11px] font-medium uppercase tracking-wider text-slate-400'>
              Description
            </label>
            <textarea
              name='description'
              defaultValue={job.description}
              rows={6}
              required
              className='block w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 transition-all duration-150'
            />
          </div>

          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
            <div>
              <label className='mb-1.5 block font-mono text-[11px] font-medium uppercase tracking-wider text-slate-400'>
                Employment Type
              </label>
              <select
                name='employment_type'
                defaultValue={job.employment_type || "FULL_TIME"}
                className='block w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 transition-all duration-150'>
                <option value='FULL_TIME'>Full Time</option>
                <option value='PART_TIME'>Part Time</option>
                <option value='CONTRACT'>Contract</option>
                <option value='INTERNSHIP'>Internship</option>
                <option value='REMOTE'>Remote</option>
              </select>
            </div>

            <div>
              <label className='mb-1.5 block font-mono text-[11px] font-medium uppercase tracking-wider text-slate-400'>
                Listing Type
              </label>
              <select
                name='listing_type'
                defaultValue={job.listing_type || "JOB"}
                className='block w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 transition-all duration-150'>
                <option value='JOB'>Job Opening</option>
                <option value='PROJECT'>Collaboration Project</option>
              </select>
            </div>
          </div>

          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
            <div>
              <label className='mb-1.5 block font-mono text-[11px] font-medium uppercase tracking-wider text-slate-400'>
                Location
              </label>
              <input
                name='location'
                defaultValue={job.location || ""}
                className='block w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 transition-all duration-150'
              />
            </div>
            <div>
              <label className='mb-1.5 block font-mono text-[11px] font-medium uppercase tracking-wider text-slate-400'>
                Salary Range
              </label>
              <input
                name='salary'
                defaultValue={job.salary || ""}
                className='block w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 transition-all duration-150'
              />
            </div>
          </div>

          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
            <div>
              <label className='mb-1.5 block font-mono text-[11px] font-medium uppercase tracking-wider text-slate-400'>
                Application Deadline
              </label>
              <input
                type='date'
                name='deadline'
                defaultValue={
                  job.deadline
                    ? new Date(job.deadline).toISOString().split("T")[0]
                    : ""
                }
                className='block w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 transition-all duration-150'
              />
            </div>

            <div>
              <label className='mb-1.5 block font-mono text-[11px] font-medium uppercase tracking-wider text-slate-400'>
                Max Applicants
              </label>
              <input
                type='number'
                name='max_applicants'
                defaultValue={job.max_applicants || 50}
                min={1}
                className='block w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 transition-all duration-150'
              />
            </div>
          </div>

          <div>
            <label className='mb-1.5 block font-mono text-[11px] font-medium uppercase tracking-wider text-slate-400'>
              Status
            </label>
            <select
              name='status'
              defaultValue={job.status || "OPEN"}
              className='block w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 transition-all duration-150'>
              <option value='OPEN'>Open</option>
              <option value='CLOSED'>Closed</option>
            </select>
          </div>

          <div className='flex items-center justify-end gap-3 border-t border-slate-800 pt-5'>
            <Link
              href={`/dashboard/employer/job/${jobId}/applicants`}
              className='rounded-lg px-4 py-2 text-xs font-medium text-slate-400 transition-colors duration-150 hover:text-slate-200'>
              Cancel
            </Link>
            <button
              type='submit'
              className='rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-medium text-(--color-slate) transition-all duration-150 hover:bg-emerald-400 active:scale-[0.98]'>
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
