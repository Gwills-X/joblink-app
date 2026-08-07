import getAuthUser from "@/lib/getAuthUser";
import { redirect } from "next/navigation";
import Link from "next/link";
import { employerEngine } from "@/services/employerEngine";
import { deleteJobAction } from "@/actions/employerActions";
import { Building2, MapPin, ArrowRight, Trash2 } from "lucide-react";

export default async function EmployerDashboardPage() {
  const authUser = await getAuthUser();
  if (!authUser) redirect("/login");

  const userId = String(authUser.userId || authUser.id);

  let companyProfile = null;
  try {
    companyProfile = await employerEngine.getCompanyProfile(userId);
  } catch (error) {
    console.error("Employer profile lookup failed:", error);
    companyProfile = null;
  }

  let jobs = [];
  try {
    jobs = await employerEngine.getEmployerJobs(userId);
  } catch (error) {
    console.error("Employer Dashboard Fetch Error:", error);
  }

  if (!companyProfile) {
    return (
      <div className='mx-auto max-w-4xl py-8 px-4'>
        <div className='rounded-xl border border-(--color-border) bg-(--color-surface) p-8'>
          <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
            <div>
              <span className='block font-mono text-[11px] font-medium uppercase tracking-widest text-slate-500'>
                Employer Hub
              </span>
              <h1 className='mt-1 text-xl font-semibold tracking-tight text-slate-100'>
                Start hiring or collaborate without a company profile
              </h1>
              <p className='mt-2 text-sm text-slate-500'>
                Create your company profile later, or publish an independent job
                or collaboration listing right now.
              </p>
            </div>
            <div className='grid gap-3 sm:grid-cols-2'>
              <Link
                href='/dashboard/employer/company'
                className='inline-flex items-center justify-center rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-medium text-(--color-slate) transition-all duration-150 hover:bg-emerald-400 active:scale-[0.98]'>
                Create Company Profile
              </Link>
              <Link
                href='/dashboard/employer/job/new'
                className='inline-flex items-center justify-center rounded-lg border border-slate-700 bg-transparent px-5 py-2.5 text-sm font-medium text-slate-300 transition-all duration-150 hover:border-slate-600 hover:bg-slate-800/50 hover:text-slate-100'>
                Post Independent Listing
              </Link>
            </div>
          </div>

          <div className='mt-8 rounded-2xl border border-slate-800 bg-slate-950/50 p-6 text-sm text-slate-400'>
            <p className='mb-3 font-semibold text-slate-200'>What you can do here:</p>
            <ul className='space-y-2'>
              <li>• Create a company profile to post branded job listings.</li>
              <li>• Post a freelance, contract or collaboration listing without a company.</li>
              <li>• Manage applicants and company settings after you add profile details.</li>
            </ul>
          </div>
        </div>

        {jobs.length > 0 && (
          <div className='mt-8'>
            <div className='flex items-center justify-between border-b border-slate-800 pb-3'>
              <span className='font-mono text-[11px] font-medium uppercase tracking-widest text-slate-500'>
                Recent Listings
              </span>
              <span className='font-mono text-[10px] tracking-wide text-slate-600'>
                {jobs.length} record{jobs.length !== 1 ? "s" : ""}
              </span>
            </div>
            <div className='mt-4 space-y-3'>
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className='group flex flex-col gap-4 rounded-lg border border-(--color-border) bg-(--color-surface) p-5 transition-all duration-150 hover:border-slate-700 sm:flex-row sm:items-center sm:justify-between'>
                  <div className='min-w-0 space-y-2'>
                    <div className='flex flex-wrap items-center gap-2'>
                      <span className='rounded-md border border-slate-800 bg-slate-950 px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider text-slate-400'>
                        {job.employment_type}
                      </span>
                      <span
                        className={`rounded-full border px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider ${
                          job.listing_type === "PROJECT"
                            ? "border-violet-500/20 bg-violet-500/10 text-violet-400"
                            : "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                        }`}>
                        {job.listing_type}
                      </span>
                      <span className='flex items-center gap-1 text-xs text-slate-500'>
                        <Building2 className='h-3 w-3 text-slate-600' />
                        {job.company_name || "Independent"}
                      </span>
                    </div>

                    <h3 className='text-sm font-semibold text-slate-200'>
                      {job.title}
                    </h3>

                    <div className='flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500'>
                      <span className='flex items-center gap-1'>
                        <MapPin className='h-3 w-3 text-slate-600' />
                        {job.location || "Remote"}
                      </span>
                      <span className='font-mono text-[11px]'>
                        {job.salary || "Competitive"}
                      </span>
                      <span className='font-mono text-[11px]'>
                        {new Date(job.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className='flex items-center gap-2 border-t border-slate-800 pt-3 sm:border-t-0 sm:pt-0'>
                    <Link
                      href={`/dashboard/employer/job/${job.id}/applicants`}
                      className='flex-1 rounded-lg border border-slate-700 bg-slate-800/40 px-3 py-2 text-center text-xs font-medium text-slate-300 transition-all duration-150 hover:border-slate-600 hover:bg-slate-800 hover:text-slate-100 sm:flex-none'>
                      Applicants ({job.applicant_count || 0})
                    </Link>

                    <form action={deleteJobAction.bind(null, job.id)}>
                      <button
                        type='submit'
                        className='inline-flex items-center gap-1.5 rounded-lg border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-xs font-medium text-rose-400 transition-all duration-150 hover:bg-rose-500/20'>
                        <Trash2 className='h-3.5 w-3.5' />
                        Delete
                      </button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className='mx-auto max-w-6xl space-y-6 py-8 px-4'>
      <div className='flex flex-col gap-4 border-b border-slate-800 pb-5 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h1 className='text-xl font-semibold tracking-tight text-slate-100'>
            Employer <span className='text-emerald-400'>Dashboard</span>
          </h1>
          <p className='mt-1 text-xs text-slate-500'>
            Manage listings, track applications, and configure company settings.
          </p>
        </div>

        <div className='flex items-center gap-2'>
          <Link
            href='/dashboard/employer/company'
            className='inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-transparent px-4 py-2 text-xs font-medium text-slate-300 transition-all duration-150 hover:border-slate-600 hover:bg-slate-800/50 hover:text-slate-100'>
            <Building2 className='h-3.5 w-3.5' />
            Company Profile
          </Link>
          <Link
            href='/dashboard/employer/job/new'
            className='inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-xs font-medium text-(--color-slate) transition-all duration-150 hover:bg-emerald-400 active:scale-[0.98]'>
            <ArrowRight className='h-3.5 w-3.5' />
            Post Listing
          </Link>
        </div>
      </div>

      <div className='space-y-4'>
        <div className='flex items-center justify-between'>
          <span className='font-mono text-[11px] font-medium uppercase tracking-widest text-slate-500'>
            Active Postings
          </span>
          <span className='font-mono text-[10px] tracking-wide text-slate-600'>
            {jobs.length} record{jobs.length !== 1 ? "s" : ""}
          </span>
        </div>

        {jobs.length === 0 ? (
          <div className='flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-800 py-16 px-6'>
            <div className='flex h-10 w-10 items-center justify-center rounded-lg border border-slate-800 bg-(--color-slate)'>
              <Building2 className='h-4 w-4 text-slate-600' />
            </div>
            <h3 className='mt-4 text-sm font-medium text-slate-300'>
              No listings yet
            </h3>
            <p className='mt-1 text-xs text-slate-500'>
              You haven&apos;t posted any jobs or collaboration projects yet.
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
          <div className='space-y-3'>
            {jobs.map((job) => (
              <div
                key={job.id}
                className='group flex flex-col gap-4 rounded-lg border border-(--color-border) bg-(--color-surface) p-5 transition-all duration-150 hover:border-slate-700 sm:flex-row sm:items-center sm:justify-between'>
                <div className='min-w-0 space-y-2'>
                  <div className='flex flex-wrap items-center gap-2'>
                    <span className='rounded-md border border-slate-800 bg-slate-950 px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider text-slate-400'>
                      {job.employment_type}
                    </span>
                    <span
                      className={`rounded-full border px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider ${
                        job.listing_type === "PROJECT"
                          ? "border-violet-500/20 bg-violet-500/10 text-violet-400"
                          : "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                      }`}>
                      {job.listing_type}
                    </span>
                    <span className='flex items-center gap-1 text-xs text-slate-500'>
                      <Building2 className='h-3 w-3 text-slate-600' />
                      {job.company_name || "Independent"}
                    </span>
                  </div>

                  <h3 className='text-sm font-semibold text-slate-200'>
                    {job.title}
                  </h3>

                  <div className='flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500'>
                    <span className='flex items-center gap-1'>
                      <MapPin className='h-3 w-3 text-slate-600' />
                      {job.location || "Remote"}
                    </span>
                    <span className='font-mono text-[11px]'>
                      {job.salary || "Competitive"}
                    </span>
                    <span className='font-mono text-[11px]'>
                      {new Date(job.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className='flex items-center gap-2 border-t border-slate-800 pt-3 sm:border-t-0 sm:pt-0'>
                  <Link
                    href={`/dashboard/employer/job/${job.id}/applicants`}
                    className='flex-1 rounded-lg border border-slate-700 bg-slate-800/40 px-3 py-2 text-center text-xs font-medium text-slate-300 transition-all duration-150 hover:border-slate-600 hover:bg-slate-800 hover:text-slate-100 sm:flex-none'>
                    Applicants ({job.applicant_count || 0})
                  </Link>

                  <form action={deleteJobAction.bind(null, job.id)}>
                    <button
                      type='submit'
                      className='inline-flex items-center gap-1.5 rounded-lg border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-xs font-medium text-rose-400 transition-all duration-150 hover:bg-rose-500/20'>
                      <Trash2 className='h-3.5 w-3.5' />
                      Delete
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
