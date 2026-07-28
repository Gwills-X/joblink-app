import getAuthUser from "@/lib/getAuthUser";
import { redirect } from "next/navigation";
import Link from "next/link";
import { employerEngine } from "@/services/employerEngine";
import { deleteJobAction } from "@/actions/employerActions";

export default async function EmployerDashboardPage() {
  const authUser = await getAuthUser();
  if (!authUser) redirect("/login");

  const userId = String(authUser.userId || authUser.id);

  // Profile Guard Check: Ensure company profile/employer registration exists
  let companyProfile = null;
  try {
    if (typeof employerEngine.getCompanyProfile === "function") {
      companyProfile = await employerEngine.getCompanyProfile(userId);
    }
  } catch (err) {
    companyProfile = null;
  }

  if (!companyProfile) {
    return (
      <div className='max-w-4xl mx-auto py-16 px-6'>
        <div className='bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-10 text-center space-y-6 shadow-2xl'>
          <div className='w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center text-xl font-mono font-bold shadow-inner'>
            🏢
          </div>
          <div className='space-y-2 max-w-md mx-auto'>
            <h1 className='text-2xl font-bold text-white tracking-tight'>
              Employer Profile Required
            </h1>
            <p className='text-xs sm:text-sm text-slate-400'>
              You must register your company or organization profile before you
              can create job listings and review applicant pools.
            </p>
          </div>
          <div>
            <Link
              href='/dashboard/employer/company'
              className='inline-flex items-center justify-center bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-xl transition-all shadow-lg shadow-emerald-500/20'>
              Create Employer Profile &rarr;
            </Link>
          </div>
        </div>
      </div>
    );
  }

  let jobs = [];
  try {
    jobs = await employerEngine.getEmployerJobs(userId);
  } catch (error) {
    console.error("Employer Dashboard Fetch Error:", error);
  }

  return (
    <div className='max-w-6xl mx-auto py-12 px-6 space-y-10'>
      {/* Top Header & Navigation Actions */}
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-800 pb-6'>
        <div>
          <h1 className='text-3xl font-extrabold text-white tracking-tight'>
            Employer <span className='text-emerald-400'>Dashboard</span>
          </h1>
          <p className='text-sm text-slate-400 mt-1 font-mono'>
            Manage your open listings, track candidate applications, and
            configure company brand settings.
          </p>
        </div>

        <div className='flex items-center gap-3 flex-wrap'>
          <Link
            href='/dashboard/employer/company'
            className='bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium px-4 py-2.5 rounded-xl text-xs transition-all border border-slate-700 font-mono'>
            🏢 Manage Company Profile
          </Link>
          <Link
            href='/dashboard/employer/jobs/new'
            className='bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold px-5 py-2.5 rounded-xl text-xs transition-all shadow-lg shadow-emerald-500/10 font-mono'>
            + Post New Listing
          </Link>
        </div>
      </div>

      {/* Main Listings Section */}
      <div className='space-y-6'>
        <div className='flex justify-between items-center'>
          <h2 className='text-xs font-mono text-slate-400 uppercase tracking-widest'>
            Your Active Postings ({jobs.length})
          </h2>
        </div>

        {jobs.length === 0 ? (
          <div className='bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center space-y-4'>
            <p className='text-slate-400 text-sm'>
              You haven't posted any jobs or collaboration projects yet.
            </p>
            <Link
              href='/dashboard/employer/jobs/new'
              className='inline-block text-xs font-mono text-emerald-400 hover:underline'>
              Create your first listing &rarr;
            </Link>
          </div>
        ) : (
          <div className='grid grid-cols-1 gap-4'>
            {jobs.map((job) => (
              <div
                key={job.id}
                className='bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6'>
                <div className='space-y-2 flex-1'>
                  <div className='flex items-center gap-2 flex-wrap'>
                    <span className='text-xs font-mono bg-slate-950 text-slate-300 border border-slate-800 px-2.5 py-1 rounded-md'>
                      {job.employment_type}
                    </span>
                    <span
                      className={`text-xs font-mono px-2.5 py-1 rounded-md border ${
                        job.listing_type === "PROJECT"
                          ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                          : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      }`}>
                      {job.listing_type}
                    </span>
                    <span className='text-xs font-mono text-slate-400'>
                      🏢 {job.company_name || "Independent / Personal"}
                    </span>
                  </div>

                  <h3 className='text-lg font-bold text-white tracking-tight'>
                    {job.title}
                  </h3>

                  <p className='text-xs font-mono text-slate-400'>
                    📍 {job.location || "Remote"} • Salary:{" "}
                    {job.salary || "Competitive"} • Posted{" "}
                    {new Date(job.created_at).toLocaleDateString()}
                  </p>
                </div>

                {/* Actions & Applicant Counter */}
                <div className='flex items-center gap-3 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-4 md:pt-0 border-slate-800'>
                  <Link
                    href={`/dashboard/employer/jobs/${job.id}/applicants`}
                    className='bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium px-4 py-2 rounded-xl text-xs transition-all border border-slate-700 font-mono'>
                    Applicants ({job.applicant_count || 0})
                  </Link>

                  <form action={deleteJobAction.bind(null, job.id)}>
                    <button
                      type='submit'
                      className='bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 px-3 py-2 rounded-xl text-xs transition-all font-mono'>
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
