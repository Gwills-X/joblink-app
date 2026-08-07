import getAuthUser from "@/lib/getAuthUser";
import { redirect } from "next/navigation";
import Link from "next/link";
import { reviewApplicationAction } from "@/actions/employerActions";
import { employerEngine } from "@/services/employerEngine";
import { ArrowLeft, Mail, FileText } from "lucide-react";

export default async function EmployerApplicantReviewPage({ params }) {
  const authUser = await getAuthUser();
  if (!authUser) redirect("/login");

  const resolvedParams = await params;
  const jobId = resolvedParams?.jobId;
  const userId = String(authUser.userId || authUser.id);

  let job = null;
  let applications = [];

  try {
    job = await employerEngine.getJobById(jobId, userId);
    if (!job) return redirect("/dashboard/employer");
    applications = await employerEngine.getJobApplicants(jobId);
  } catch (error) {
    console.error("Applicant Screen Engine Fetch Error:", error);
    return redirect("/dashboard/employer");
  }

  return (
    <div className='mx-auto max-w-5xl space-y-6 py-8 px-4'>
      <div>
        <Link
          href='/dashboard/employer'
          className='inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-emerald-400 transition-colors duration-150 hover:text-emerald-300'>
          <ArrowLeft className='h-3 w-3' />
          Back to Dashboard
        </Link>
        <h1 className='mt-3 text-xl font-semibold tracking-tight text-slate-100'>
          Applicant Review:{" "}
          <span className='text-emerald-400'>{job?.title}</span>
        </h1>
        <p className='mt-1 text-xs text-slate-500'>
          Evaluate submissions, update statuses, and provide feedback.
        </p>
      </div>

      <div className='space-y-4'>
        {applications.length === 0 ? (
          <div className='flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-800 py-16 px-6'>
            <div className='flex h-10 w-10 items-center justify-center rounded-lg border border-slate-800 bg-[var(--color-slate)]'>
              <FileText className='h-4 w-4 text-slate-600' />
            </div>
            <h3 className='mt-4 text-sm font-medium text-slate-300'>
              No applicants yet
            </h3>
            <p className='mt-1 text-xs text-slate-500'>
              No candidates have applied to this position.
            </p>
            <div className='mt-5 font-mono text-[10px] tracking-wider text-slate-700 uppercase'>
              Status: <span className='text-slate-600'>NO_RECORDS</span>
            </div>
          </div>
        ) : (
          applications.map((app) => (
            <div
              key={app.id}
              className='rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-5 space-y-5 transition-all duration-150 hover:border-slate-700'>
              <div className='flex items-start justify-between gap-4'>
                <div>
                  <h2 className='text-sm font-semibold text-slate-200'>
                    {app.candidate_name || "Candidate"}
                  </h2>
                  <div className='mt-1 flex items-center gap-1.5 text-xs text-slate-500'>
                    <Mail className='h-3 w-3' />
                    <span className='font-mono text-[11px] tracking-wide'>
                      {app.candidate_email}
                    </span>
                  </div>
                </div>
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
              </div>

              <div className='space-y-2'>
                <span className='block font-mono text-[10px] font-medium uppercase tracking-wider text-slate-500'>
                  Cover Letter
                </span>
                <div className='rounded-md border border-slate-800 bg-slate-950 p-4 text-xs leading-relaxed text-slate-400'>
                  {app.cover_letter}
                </div>
              </div>

              <form
                action={reviewApplicationAction}
                className='space-y-4 border-t border-slate-800 pt-4'>
                <input type='hidden' name='application_id' value={app.id} />
                <input type='hidden' name='job_id' value={jobId} />

                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                  <div>
                    <label className='mb-1.5 block font-mono text-[10px] font-medium uppercase tracking-wider text-slate-500'>
                      Update Status
                    </label>
                    <select
                      name='status'
                      defaultValue={app.status}
                      className='block w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-100 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 transition-all duration-150'>
                      <option value='PENDING'>PENDING</option>
                      <option value='ACCEPTED'>ACCEPTED</option>
                      <option value='REJECTED'>REJECTED</option>
                    </select>
                  </div>

                  <div>
                    <label className='mb-1.5 block font-mono text-[10px] font-medium uppercase tracking-wider text-slate-500'>
                      Feedback
                    </label>
                    <input
                      type='text'
                      name='employer_feedback'
                      defaultValue={app.employer_feedback || ""}
                      placeholder='Optional notes for candidate...'
                      className='block w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-100 placeholder:text-slate-600 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 transition-all duration-150'
                    />
                  </div>
                </div>

                <div className='flex justify-end'>
                  <button
                    type='submit'
                    className='rounded-lg bg-emerald-500 px-4 py-2 text-xs font-medium text-[var(--color-slate)] transition-all duration-150 hover:bg-emerald-400 active:scale-[0.98]'>
                    Save Decision
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
