import getAuthUser from "@/lib/getAuthUser";
import { redirect } from "next/navigation";
import Link from "next/link";
import { seekerEngine } from "@/services/seekerEngine";
import OpportunityCard from "@/components/OpportunityCard";
import {
  ArrowRight,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  XCircle,
  Zap,
} from "lucide-react";

export const dynamic = "force-dynamic";

function statusStyle(status) {
  switch (status) {
    case "ACCEPTED":
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-400";
    case "REJECTED":
      return "border-rose-500/20 bg-rose-500/10 text-rose-400";
    case "SHORTLISTED":
      return "border-blue-500/20 bg-blue-500/10 text-blue-400";
    case "WITHDRAWN":
      return "border-slate-500/20 bg-slate-500/10 text-slate-400";
    default:
      return "border-amber-500/20 bg-amber-500/10 text-amber-400";
  }
}

function StatusIcon({ status }) {
  if (status === "ACCEPTED") {
    return <CheckCircle2 className='h-3 w-3' />;
  }

  if (status === "REJECTED") {
    return <XCircle className='h-3 w-3' />;
  }

  return <Clock className='h-3 w-3' />;
}

export default async function SeekerApplicationTrackerPage() {
  const authUser = await getAuthUser();
  if (!authUser) redirect("/login");

  const userId = String(authUser.userId || authUser.id);
  const hasProfile = await seekerEngine.hasSeekerProfile(userId);
  let listings = [];

  try {
    listings = await seekerEngine.getMarketplaceListings("ALL", "", userId);
  } catch (error) {
    console.error("Seeker marketplace fetch failed:", error);
  }

  if (!hasProfile) {
    return (
      <div className='mx-auto max-w-6xl space-y-8 px-4 py-8'>
        <div className='flex flex-col items-center rounded-xl border border-dashed border-slate-800 px-6 py-12 text-center'>
          <div className='flex h-11 w-11 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950'>
            <Zap className='h-5 w-5 text-slate-600' />
          </div>

          <h1 className='mt-4 text-base font-semibold text-slate-900 dark:text-slate-100'>
            Candidate Profile Required
          </h1>

          <p className='mt-1 max-w-sm text-xs leading-relaxed text-slate-500'>
            Complete your professional profile before applying for jobs or
            tracking applications.
          </p>

          <Link
            href='/dashboard/seeker/profile/create'
            className='mt-5 inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2.5 text-xs font-semibold text-slate-950 transition hover:bg-emerald-400'>
            Create Profile
            <ArrowRight className='h-3.5 w-3.5' />
          </Link>
        </div>

        <section className='space-y-4'>
          <div className='flex items-end justify-between border-b border-slate-800 pb-3'>
            <div>
              <span className='font-mono text-[10px] uppercase tracking-widest text-slate-500'>
                Open opportunities
              </span>
              <h2 className='mt-1 text-lg font-semibold text-slate-100'>
                Browse jobs before you apply
              </h2>
            </div>
            <Link
              href='/jobs'
              className='text-xs font-medium text-emerald-400 hover:text-emerald-300'>
              See all jobs →
            </Link>
          </div>
          {listings.length > 0 ? (
            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
              {listings.slice(0, 5).map((listing) => (
                <OpportunityCard
                  key={listing.id}
                  opportunity={listing}
                  currentUserId={userId}
                />
              ))}
            </div>
          ) : (
            <p className='rounded-xl border border-dashed border-slate-800 px-5 py-10 text-center text-xs text-slate-500'>
              No open opportunities are available right now.
            </p>
          )}
        </section>
      </div>
    );
  }

  const applications = await seekerEngine.getSeekerApplications(userId);
  const appliedJobIds = new Set(
    applications.map((application) => String(application.job_id)),
  );
  const availableListings = listings
    .filter((listing) => !appliedJobIds.has(String(listing.id)))
    .slice(0, 5);

  return (
    <div className='mx-auto max-w-5xl space-y-5 px-4 py-7'>
      <div className='flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between'>
        <div>
          <span className='font-mono text-[10px] uppercase tracking-widest text-slate-500'>
            Candidate Hub
          </span>
          <h1 className='mt-1 text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100'>
            Application <span className='text-emerald-400'>Tracker</span>
          </h1>
          <p className='mt-1 text-xs text-slate-500'>
            Track every application, review decision and employer response.
          </p>
        </div>

        <Link
          href='/jobs'
          className='self-start rounded-lg border border-slate-700 px-3 py-2 text-[11px] font-medium text-slate-400 transition hover:border-emerald-500/30 hover:text-emerald-400'>
          Browse Jobs →
        </Link>
      </div>

      {applications.length === 0 ? (
        <div className='flex flex-col items-center rounded-xl border border-dashed border-slate-300 px-6 py-14 text-center dark:border-slate-800'>
          <div className='flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950'>
            <FileText className='h-4 w-4 text-slate-600' />
          </div>

          <h2 className='mt-4 text-sm font-semibold text-slate-900 dark:text-slate-300'>
            No applications yet
          </h2>

          <p className='mt-1 text-xs text-slate-500'>
            Applications you submit will appear here.
          </p>

          <Link
            href='/jobs'
            className='mt-4 text-[11px] font-medium text-emerald-400 hover:text-emerald-300'>
            Explore opportunities →
          </Link>
        </div>
      ) : (
        <div className='space-y-3'>
          {applications.map((app) => (
            <div
              key={app.id}
              className='rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-emerald-300 sm:p-5 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none dark:hover:border-slate-700'>
              <div className='flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
                <div className='min-w-0'>
                  <div className='mb-2 flex flex-wrap items-center gap-2'>
                    <span className='rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-emerald-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-500'>
                      {app.employment_type || "Opportunity"}
                    </span>

                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-wider ${statusStyle(
                        app.status,
                      )}`}>
                      <StatusIcon status={app.status} />
                      {app.status}
                    </span>

                    <span className='flex items-center gap-1 font-mono text-[9px] text-slate-600'>
                      <Calendar className='h-3 w-3' />
                      {new Date(app.applied_at).toLocaleDateString()}
                    </span>
                  </div>

                  <Link
                    href={`/dashboard/seeker/applications/${app.id}`}
                    className='text-sm font-semibold text-slate-900 transition hover:text-emerald-700 dark:text-slate-200 dark:hover:text-emerald-400'>
                    {app.job_title}
                  </Link>

                  <div className='mt-1 flex items-center gap-1 text-xs text-slate-500'>
                    <Building2 className='h-3 w-3 text-slate-600' />
                    {app.company_name || "Independent Employer"}
                  </div>

                  {app.status === "REJECTED" && app.rejection_reason && (
                    <div className='mt-3 rounded-lg border border-rose-500/10 bg-rose-500/5 px-3 py-2'>
                      <p className='font-mono text-[9px] uppercase tracking-wider text-rose-400'>
                        Employer Feedback
                      </p>
                      <p className='mt-1 line-clamp-2 text-[11px] leading-relaxed text-slate-400'>
                        {app.rejection_reason}
                      </p>
                    </div>
                  )}

                  {app.status === "ACCEPTED" && (
                    <p className='mt-2 text-[11px] text-emerald-400'>
                      Your application has been accepted.
                    </p>
                  )}

                  {app.status === "SHORTLISTED" && (
                    <p className='mt-2 text-[11px] text-blue-400'>
                      You have been shortlisted by the employer.
                    </p>
                  )}
                </div>

                <Link
                  href={`/dashboard/seeker/applications/${app.id}`}
                  className='inline-flex items-center justify-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-[11px] font-medium text-emerald-400 transition hover:border-emerald-500/50 hover:bg-emerald-500/20'>
                  View Application
                  <ArrowRight className='h-3 w-3' />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      <section className='space-y-4'>
        <div className='flex items-end justify-between border-b border-slate-800 pb-3'>
          <div>
            <span className='font-mono text-[10px] uppercase tracking-widest text-slate-500'>
              Next opportunities
            </span>
            <h2 className='mt-1 text-lg font-semibold text-slate-100'>
              Jobs you have not applied for
            </h2>
          </div>
          <Link
            href='/jobs'
            className='text-xs font-medium text-emerald-400 hover:text-emerald-300'>
            See all jobs →
          </Link>
        </div>
        {availableListings.length > 0 ? (
          <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
            {availableListings.map((listing) => (
              <OpportunityCard
                key={listing.id}
                opportunity={listing}
                currentUserId={userId}
              />
            ))}
          </div>
        ) : (
          <p className='rounded-xl border border-dashed border-slate-800 px-5 py-10 text-center text-xs text-slate-500'>
            You have reviewed every currently available opportunity.
          </p>
        )}
      </section>
    </div>
  );
}
