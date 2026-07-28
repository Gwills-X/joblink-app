// app/dashboard/employer/jobs/page.jsx

import getAuthUser from "@/lib/getAuthUser";
import { redirect } from "next/navigation";
import Link from "next/link";
import { employerEngine } from "@/engines/employerEngine";

export default async function EmployerJobsDashboardPage() {
  const authUser = await getAuthUser();
  if (!authUser) redirect("/login");

  // Fetch jobs via the engine layer
  const userId = String(authUser.userId || authUser.id);
  const jobs = await employerEngine.getEmployerJobs(userId);

  return (
    <div className='max-w-5xl mx-auto py-12 px-6 space-y-8'>
      {/* Header & Controls */}
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
        <div>
          <span className='text-emerald-400 font-mono text-xs font-bold tracking-widest uppercase mb-2 block'>
            Employer Control Center
          </span>
          <h1 className='text-3xl font-bold text-white tracking-tight'>
            Manage Your <span className='text-emerald-400'>Listings</span>
          </h1>
          <p className='text-sm text-slate-400 mt-1'>
            Monitor active postings, adjust applicant caps, and review incoming
            candidate submissions.
          </p>
        </div>

        <Link
          href='/jobs/create'
          className='bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold px-5 py-2.5 rounded-xl text-sm transition-all shadow-lg shadow-emerald-500/10'>
          + Post New Job / Collaboration
        </Link>
      </div>

      {/* Jobs Grid / Table Section */}
      <div className='space-y-4'>
        {jobs.length === 0 ? (
          <div className='bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center space-y-3'>
            <p className='text-slate-400 text-sm'>
              You haven't posted any jobs or collaborations yet.
            </p>
            <Link
              href='/jobs/create'
              className='inline-block text-emerald-400 font-medium text-xs hover:underline'>
              Create your first listing &rarr;
            </Link>
          </div>
        ) : (
          jobs.map((job) => {
            const applicantCount = Number(job.applicant_count || 0);
            const maxApplicants = Number(job.max_applicants || 50);
            const isFull = applicantCount >= maxApplicants;

            return (
              <div
                key={job.id}
                className='bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 transition-all hover:border-slate-700'>
                {/* Job Info */}
                <div className='space-y-2 flex-1'>
                  <div className='flex items-center gap-3 flex-wrap'>
                    <span className='text-xs font-mono text-slate-400 uppercase bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800'>
                      {job.employment_type}
                    </span>
                    <span
                      className={`text-xs font-mono px-2.5 py-1 rounded-md border ${
                        job.status === "OPEN"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                      }`}>
                      {job.status}
                    </span>
                    {isFull && (
                      <span className='text-xs font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-1 rounded-md'>
                        Max Limit Reached (Hidden Publicly)
                      </span>
                    )}
                  </div>

                  <h2 className='text-xl font-bold text-white tracking-tight'>
                    {job.title}
                  </h2>

                  <div className='flex items-center gap-6 text-xs font-mono text-slate-400'>
                    <span>🏢 {job.company_name}</span>
                    <span>📍 {job.location || "Remote"}</span>
                    <span>
                      👥 Applicants:{" "}
                      <strong className='text-white'>{applicantCount}</strong> /{" "}
                      {maxApplicants}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className='flex items-center gap-3 w-full md:w-auto justify-end border-t md:border-t-0 pt-4 md:pt-0 border-slate-800/80'>
                  <Link
                    href={`/dashboard/employer/jobs/${job.id}/applicants`}
                    className='flex-1 md:flex-none text-center bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-xl text-xs font-semibold transition-all'>
                    View Applicants ({applicantCount})
                  </Link>
                  <Link
                    href={`/dashboard/employer/jobs/${job.id}/edit`}
                    className='bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all'>
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
