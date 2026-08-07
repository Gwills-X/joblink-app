import getAuthUser from "@/lib/getAuthUser";
import { redirect } from "next/navigation";
import Link from "next/link";
import { seekerEngine } from "@/services/seekerEngine";
import {
  Briefcase,
  Building2,
  MapPin,
  Calendar,
  ArrowRight,
  FileText,
  Zap,
} from "lucide-react";

export default async function SeekerApplicationTrackerPage() {
  const authUser = await getAuthUser();
  if (!authUser) redirect("/login");

  const userId = String(authUser.userId || authUser.id);

  const hasProfile = await seekerEngine.hasSeekerProfile(userId);

  if (!hasProfile) {
    return (
      <div className='mx-auto max-w-xl py-16 px-4'>
        <div className='flex flex-col items-center rounded-lg border border-dashed border-slate-800 py-16 px-6 text-center'>
          <div className='flex h-12 w-12 items-center justify-center rounded-lg border border-slate-800 bg-[var(--color-slate)]'>
            <Zap className='h-5 w-5 text-slate-600' />
          </div>
          <h1 className='mt-5 text-lg font-semibold tracking-tight text-slate-100'>
            Candidate Profile Required
          </h1>
          <p className='mt-2 max-w-xs text-xs leading-relaxed text-slate-500'>
            Configure your candidate profile before applying to marketplace
            listings or tracking applications.
          </p>
          <Link
            href='/dashboard/seeker/profile'
            className='mt-5 inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-medium text-[var(--color-slate)] transition-all duration-150 hover:bg-emerald-400 active:scale-[0.98]'>
            Set Up Profile
            <ArrowRight className='h-3.5 w-3.5' />
          </Link>
          <div className='mt-5 font-mono text-[10px] tracking-wider text-slate-700 uppercase'>
            Status: <span className='text-slate-600'>PROFILE_MISSING</span>
          </div>
        </div>
      </div>
    );
  }

  const applications = await seekerEngine.getSeekerApplications(userId);

  return (
    <div className='mx-auto max-w-5xl space-y-6 py-8 px-4'>
      <div>
        <span className='block font-mono text-[11px] font-medium uppercase tracking-widest text-slate-500'>
          Candidate Hub
        </span>
        <h1 className='mt-1 text-xl font-semibold tracking-tight text-slate-100'>
          Application <span className='text-emerald-400'>Tracker</span>
        </h1>
        <p className='mt-1 text-xs text-slate-500'>
          Monitor submissions, pitch statuses, and review opportunities.
        </p>
      </div>

      <div className='space-y-3'>
        {applications.length === 0 ? (
          <div className='flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-800 py-16 px-6'>
            <div className='flex h-10 w-10 items-center justify-center rounded-lg border border-slate-800 bg-[var(--color-slate)]'>
              <FileText className='h-4 w-4 text-slate-600' />
            </div>
            <h3 className='mt-4 text-sm font-medium text-slate-300'>
              No applications yet
            </h3>
            <p className='mt-1 text-xs text-slate-500'>
              You haven&apos;t applied to any jobs or collaborations yet.
            </p>
            <Link
              href='/jobs'
              className='mt-4 font-mono text-[11px] text-emerald-400 transition-colors duration-150 hover:text-emerald-300'>
              Browse marketplace →
            </Link>
            <div className='mt-4 font-mono text-[10px] tracking-wider text-slate-700 uppercase'>
              Status: <span className='text-slate-600'>NO_RECORDS</span>
            </div>
          </div>
        ) : (
          applications.map((app) => (
            <div
              key={app.id}
              className='group flex flex-col gap-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-5 transition-all duration-150 hover:border-slate-700 sm:flex-row sm:items-center sm:justify-between'>
              <div className='min-w-0 space-y-2'>
                <div className='flex flex-wrap items-center gap-2'>
                  <span className='rounded-md border border-slate-800 bg-slate-950 px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider text-slate-400'>
                    {app.employment_type}
                  </span>
                  <span
                    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider ${
                      app.status === "PENDING"
                        ? "border-amber-500/20 bg-amber-500/10 text-amber-400"
                        : app.status === "ACCEPTED"
                          ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                          : "border-rose-500/20 bg-rose-500/10 text-rose-400"
                    }`}>
                    <span
                      className={`mr-1.5 inline-block h-1.5 w-1.5 rounded-full ${
                        app.status === "PENDING"
                          ? "bg-amber-400"
                          : app.status === "ACCEPTED"
                            ? "bg-emerald-400"
                            : "bg-rose-400"
                      }`}
                    />
                    {app.status}
                  </span>
                  <span className='flex items-center gap-1 font-mono text-[10px] tracking-wide text-slate-600'>
                    <Calendar className='h-3 w-3' />
                    {new Date(
                      app.applied_at || app.created_at,
                    ).toLocaleDateString()}
                  </span>
                </div>

                <h2 className='text-sm font-semibold text-slate-200'>
                  {app.job_title}
                </h2>

                <div className='flex items-center gap-1 text-xs text-slate-500'>
                  <Building2 className='h-3 w-3 text-slate-600' />
                  {app.company_name}
                </div>

                {app.cover_letter && (
                  <p className='line-clamp-2 text-xs leading-relaxed text-slate-500'>
                    {app.cover_letter}
                  </p>
                )}
              </div>

              <div className='flex items-center gap-2 border-t border-slate-800 pt-3 sm:border-t-0 sm:pt-0'>
                <Link
                  href={`/jobs/${app.job_id}`}
                  className='flex-1 rounded-lg border border-slate-700 bg-slate-800/40 px-3 py-2 text-center text-xs font-medium text-slate-300 transition-all duration-150 hover:border-slate-600 hover:bg-slate-800 hover:text-slate-100 sm:flex-none'>
                  View Listing
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
