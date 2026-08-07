import getAuthUser from "@/lib/getAuthUser";
import { redirect } from "next/navigation";
import Link from "next/link";
import { employerEngine } from "@/services/employerEngine";
import { Building2, MapPin, Users, ArrowRight } from "lucide-react";

export default async function EmployerJobsDashboardPage() {
  const authUser = await getAuthUser();
  if (!authUser) redirect("/login");

  const userId = String(authUser.userId || authUser.id);
  const jobs = await employerEngine.getEmployerJobs(userId);

  return (
    <div className='mx-auto max-w-5xl space-y-6 py-8 px-4'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <span className='block font-mono text-[11px] font-medium uppercase tracking-widest text-slate-500'>
            Employer Control Center
          </span>
          <h1 className='mt-1 text-xl font-semibold tracking-tight text-slate-100'>
            Manage Your <span className='text-emerald-400'>Listings</span>
          </h1>
          <p className='mt-1 text-xs text-slate-500'>
            Monitor postings, adjust applicant caps, and review submissions.
          </p>
        </div>

        <Link
          href='/dashboard/employer/job/new'
          className='inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-medium text-[var(--color-slate)] transition-all duration-150 hover:bg-emerald-400 active:scale-[0.98]'>
          <ArrowRight className='h-3.5 w-3.5' />
          Post New Listing
        </Link>
      </div>

      <div className='space-y-3'>
        {jobs.length === 0 ? (
          <div className='flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-800 py-16 px-6'>
            <div className='flex h-10 w-10 items-center justify-center rounded-lg border border-slate-800 bg-[var(--color-slate)]'>
              <Building2 className='h-4 w-4 text-slate-600' />
            </div>
            <h3 className='mt-4 text-sm font-medium text-slate-300'>
              No listings yet
            </h3>
            <p className='mt-1 text-xs text-slate-500'>
              You haven&apos;t posted any jobs or collaborations yet.
            </p>
            <Link
              href='/dashboard/employer/job/new'
              className='mt-4 font-mono text-[11px] text-emerald-400 transition-colors duration-150 hover:text-emerald-300'>
              Create your first listing →
            </Link>
            <div className='mt-4 font-mono text-[10px] tracking-wider text-slate-700 uppercase'>
              Status: <span className='text-slate-600'>NO_RECORDS</span>
            </div>
          </div>
        ) : (
          jobs.map((job) => {
            const applicantCount = Number(job.applicant_count || 0);
            const maxApplicants = Number(job.max_applicants || 50);
            const isFull = applicantCount >= maxApplicants;

            return (
              <div
                key={job.id}
                className='group flex flex-col gap-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-5 transition-all duration-150 hover:border-slate-700 sm:flex-row sm:items-center sm:justify-between'>
                <div className='min-w-0 space-y-2'>
                  <div className='flex flex-wrap items-center gap-2'>
                    <span className='rounded-md border border-slate-800 bg-slate-950 px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider text-slate-400'>
                      {job.employment_type}
                    </span>
                    <span
                      className={`rounded-full border px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider ${
                        job.status === "OPEN"
                          ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                          : "border-rose-500/20 bg-rose-500/10 text-rose-400"
                      }`}>
                      {job.status}
                    </span>
                    {isFull && (
                      <span className='rounded-full border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider text-amber-400'>
                        Cap Reached
                      </span>
                    )}
                  </div>

                  <h2 className='text-sm font-semibold text-slate-200'>
                    {job.title}
                  </h2>

                  <div className='flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500'>
                    <span className='flex items-center gap-1'>
                      <Building2 className='h-3 w-3 text-slate-600' />
                      {job.company_name}
                    </span>
                    <span className='flex items-center gap-1'>
                      <MapPin className='h-3 w-3 text-slate-600' />
                      {job.location || "Remote"}
                    </span>
                    <span className='flex items-center gap-1 font-mono text-[11px]'>
                      <Users className='h-3 w-3 text-slate-600' />
                      <span className='text-slate-300'>{applicantCount}</span>
                      <span>/</span>
                      <span>{maxApplicants}</span>
                    </span>
                  </div>
                </div>

                <div className='flex items-center gap-2 border-t border-slate-800 pt-3 sm:border-t-0 sm:pt-0'>
                  <Link
                    href={`/dashboard/employer/job/${job.id}/applicants`}
                    className='flex-1 rounded-lg border border-slate-700 bg-slate-800/40 px-3 py-2 text-center text-xs font-medium text-slate-300 transition-all duration-150 hover:border-slate-600 hover:bg-slate-800 hover:text-slate-100 sm:flex-none'>
                    Applicants ({applicantCount})
                  </Link>
                  <Link
                    href={`/dashboard/employer/job/${job.id}/edit`}
                    className='rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs font-medium text-slate-400 transition-all duration-150 hover:border-slate-700 hover:text-slate-200'>
                    Edit
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
