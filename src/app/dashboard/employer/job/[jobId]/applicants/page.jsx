// app/dashboard/employer/jobs/[jobId]/applicants/page.jsx

import getAuthUser from "@/lib/getAuthUser";
import { redirect } from "next/navigation";
import Link from "next/link";
import { reviewApplicationAction } from "@/actions/employerActions";
import { employerEngine } from "@/engines/employerEngine";

export default async function EmployerApplicantReviewPage({ params }) {
  const authUser = await getAuthUser();
  if (!authUser) redirect("/login");

  const resolvedParams = await params;
  const jobId = resolvedParams?.jobId;
  const userId = String(authUser.userId || authUser.id);

  let job = null;
  let applications = [];

  try {
    // Strictly fetching view context via the engine layer — zero direct database queries!
    job = await employerEngine.getJobById(jobId, userId);
    if (!job) return redirect("/dashboard/employer");

    applications = await employerEngine.getJobApplicants(jobId);
  } catch (error) {
    console.error("Applicant Screen Engine Fetch Error:", error);
    return redirect("/dashboard/employer");
  }

  return (
    <div className='max-w-5xl mx-auto py-12 px-6 space-y-8'>
      <div>
        <Link
          href='/dashboard/employer'
          className='text-xs font-mono text-emerald-400 hover:underline mb-2 block'>
          &larr; Back to Employer Dashboard
        </Link>
        <h1 className='text-3xl font-bold text-white tracking-tight'>
          Applicant Review:{" "}
          <span className='text-emerald-400'>{job?.title}</span>
        </h1>
        <p className='text-sm text-slate-400 mt-1'>
          Evaluate candidate submissions, update statuses, and provide
          constructive feedback.
        </p>
      </div>

      <div className='space-y-6'>
        {applications.length === 0 ? (
          <div className='bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center space-y-3'>
            <p className='text-slate-400 text-sm'>
              No candidates have applied to this position yet.
            </p>
          </div>
        ) : (
          applications.map((app) => (
            <div
              key={app.id}
              className='bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6'>
              <div className='flex justify-between items-center'>
                <div>
                  <h2 className='text-lg font-bold text-white'>
                    {app.candidate_name || "Candidate"}
                  </h2>
                  <p className='text-xs font-mono text-slate-400'>
                    📧 {app.candidate_email}
                  </p>
                </div>
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
              </div>

              <div className='space-y-2'>
                <span className='text-xs font-mono text-slate-400 uppercase tracking-wider block'>
                  Cover Letter / Pitch:
                </span>
                <div className='bg-slate-950/80 border border-slate-800/80 p-4 rounded-xl text-sm text-slate-300'>
                  {app.cover_letter}
                </div>
              </div>

              {/* Server Action Form Execution */}
              <form
                action={reviewApplicationAction}
                className='pt-4 border-t border-slate-800/80 space-y-4'>
                <input type='hidden' name='application_id' value={app.id} />
                <input type='hidden' name='job_id' value={jobId} />

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className='space-y-1.5'>
                    <label className='text-xs font-mono text-slate-300 block'>
                      Update Status
                    </label>
                    <select
                      name='status'
                      defaultValue={app.status}
                      className='w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono'>
                      <option value='PENDING'>PENDING</option>
                      <option value='ACCEPTED'>ACCEPTED</option>
                      <option value='REJECTED'>REJECTED</option>
                    </select>
                  </div>

                  <div className='space-y-1.5'>
                    <label className='text-xs font-mono text-slate-300 block'>
                      Feedback / Rejection Reason
                    </label>
                    <input
                      type='text'
                      name='employer_feedback'
                      defaultValue={app.employer_feedback || ""}
                      placeholder='Optional notes or feedback for candidate...'
                      className='w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-emerald-500'
                    />
                  </div>
                </div>

                <div className='flex justify-end'>
                  <button
                    type='submit'
                    className='bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold px-4 py-2 rounded-xl text-xs transition-all'>
                    Save Review Decision
                  </button>
                </div>
              </form>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
