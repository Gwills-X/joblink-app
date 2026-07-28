import getAuthUser from "@/lib/getAuthUser";
import { redirect } from "next/navigation";
import Link from "next/link";
import { seekerEngine } from "@/services/seekerEngine";

export default async function SeekerApplicationTrackerPage() {
  const authUser = await getAuthUser();
  if (!authUser) redirect("/login");

  const userId = String(authUser.userId || authUser.id);

  // Optional: Check if seeker profile exists (falls back or throws if uninitialized)
  let seekerProfile = null;
  try {
    if (typeof seekerEngine.getSeekerProfile === "function") {
      seekerProfile = await seekerEngine.getSeekerProfile(userId);
    }
  } catch (e) {
    seekerProfile = null;
  }

  // Profile Guard: If seeker profile hasn't been created yet
  if (seekerProfile === false || seekerProfile === null) {
    return (
      <div className='max-w-4xl mx-auto py-16 px-6'>
        <div className='bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-10 text-center space-y-6 shadow-2xl'>
          <div className='w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center text-xl font-mono font-bold shadow-inner'>
            ⚡
          </div>
          <div className='space-y-2 max-w-md mx-auto'>
            <h1 className='text-2xl font-bold text-white tracking-tight'>
              Candidate Profile Required
            </h1>
            <p className='text-xs sm:text-sm text-slate-400'>
              You must register and configure your candidate profile before you
              can apply for open marketplace listings or track applications.
            </p>
          </div>
          <div>
            <Link
              href='/dashboard/seeker/profile'
              className='inline-flex items-center justify-center bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-xl transition-all shadow-lg shadow-emerald-500/20'>
              Set Up Seeker Profile &rarr;
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const applications = await seekerEngine.getSeekerApplications(userId);

  return (
    <div className='max-w-5xl mx-auto py-12 px-6 space-y-8'>
      {/* Header */}
      <div>
        <span className='text-emerald-400 font-mono text-xs font-bold tracking-widest uppercase mb-2 block'>
          Candidate Hub
        </span>
        <h1 className='text-3xl font-bold text-white tracking-tight'>
          Application <span className='text-emerald-400'>Tracker</span>
        </h1>
        <p className='text-sm text-slate-400 mt-1'>
          Monitor your active job submissions, pitch statuses, and review open
          opportunities.
        </p>
      </div>

      {/* Applications List Section */}
      <div className='space-y-4'>
        {applications.length === 0 ? (
          <div className='bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center space-y-3'>
            <p className='text-slate-400 text-sm'>
              You haven't applied to any jobs or collaborations yet.
            </p>
            <Link
              href='/jobs'
              className='inline-block text-emerald-400 font-medium text-xs hover:underline'>
              Browse open marketplace listings &rarr;
            </Link>
          </div>
        ) : (
          applications.map((app) => (
            <div
              key={app.id}
              className='bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 transition-all hover:border-slate-700'>
              {/* Application Info */}
              <div className='space-y-2 flex-1'>
                <div className='flex items-center gap-3 flex-wrap'>
                  <span className='text-xs font-mono text-slate-400 uppercase bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800'>
                    {app.employment_type}
                  </span>
                  <span
                    className={`text-xs font-mono px-2.5 py-1 rounded-md border ${
                      app.status === "PENDING"
                        ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                        : app.status === "ACCEPTED"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                    }`}>
                    {app.status}
                  </span>
                  <span className='text-xs font-mono text-slate-500'>
                    Applied on:{" "}
                    {new Date(
                      app.applied_at || app.created_at,
                    ).toLocaleDateString()}
                  </span>
                </div>

                <h2 className='text-xl font-bold text-white tracking-tight'>
                  {app.job_title}
                </h2>

                <div className='flex items-center gap-6 text-xs font-mono text-slate-400'>
                  <span>🏢 {app.company_name}</span>
                </div>

                <p className='text-xs text-slate-400 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 mt-2'>
                  <strong className='text-slate-300'>
                    Pitch/Cover Letter:
                  </strong>{" "}
                  {app.cover_letter}
                </p>
              </div>

              {/* Actions */}
              <div className='flex items-center gap-3 w-full md:w-auto justify-end border-t md:border-t-0 pt-4 md:pt-0 border-slate-800/80'>
                <Link
                  href={`/jobs/${app.job_id}`}
                  className='bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-xl text-xs font-semibold transition-all'>
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
