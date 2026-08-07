import getAuthUser from "@/lib/getAuthUser";
import { redirect } from "next/navigation";
import Link from "next/link";
import { reviewApplicationAction } from "@/actions/employerActions";
import { employerEngine } from "@/services/employerEngine";
import { ArrowLeft, Mail, FileText, ExternalLink } from "lucide-react";

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
              className='rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-4 transition-all duration-150 hover:border-slate-700'>
              <div className='flex flex-col md:flex-row items-start md:items-center justify-between gap-4'>
                <div>
                  <h2 className='text-sm font-semibold text-slate-100'>
                    {app.candidate_name || "Candidate"}
                  </h2>
                  <div className='mt-1 flex items-center gap-1.5 text-xs text-slate-400'>
                    <Mail className='h-3 w-3 text-emerald-400' />
                    <span className='font-mono text-[11px] tracking-wide'>
                      {app.candidate_email}
                    </span>
                  </div>
                </div>

                <div className='flex items-center gap-3'>
                  <span
                    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider ${
                      app.status === "PENDING"
                        ? "border-amber-500/20 bg-amber-500/10 text-amber-400"
                        : app.status === "ACCEPTED"
                          ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                          : "border-rose-500/20 bg-rose-500/10 text-rose-400"
                    }`}>
                    {app.status}
                  </span>

                  <Link
                    href={`/dashboard/employer/applications/${app.id}`}
                    className='inline-flex items-center gap-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold px-3 py-1.5 rounded-lg text-xs transition-all'>
                    View Full Details & Chat{" "}
                    <ExternalLink className='h-3 w-3' />
                  </Link>
                </div>
              </div>

              {/* Snippet preview */}
              <div className='rounded-lg border border-slate-800 bg-slate-950 p-3 text-xs text-slate-400 line-clamp-2'>
                <span className='font-mono text-[10px] text-slate-500 uppercase block mb-1'>
                  Cover Letter Preview:
                </span>
                {app.cover_letter}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
