import getAuthUser from "@/lib/getAuthUser";
import { redirect } from "next/navigation";
import Link from "next/link";
import { employerEngine } from "@/services/employerEngine";
import { reviewApplicationAction } from "@/actions/employerActions";
import EmployerActionModal from "../../components/EmployerActionModal";
import {
  ArrowLeft,
  Mail,
  Phone,
  Globe,
  FileText,
  UserCheck,
  Briefcase,
} from "lucide-react";
import { GitBranch } from "lucide-react";

export default async function EmployerApplicationDetailPage({ params }) {
  const authUser = await getAuthUser();
  if (!authUser) redirect("/login");

  const resolvedParams = await params;
  const applicationId = resolvedParams?.applicationId;
  const userId = String(authUser.userId || authUser.id);

  let application = null;
  try {
    application = await employerEngine.getApplicationDetailById(
      applicationId,
      userId,
    );
    if (!application) return redirect("/dashboard/employer");
  } catch (error) {
    console.error("Application Detail Fetch Error:", error);
    return redirect("/dashboard/employer");
  }

  return (
    <div className='mx-auto max-w-4xl space-y-8 py-8 px-4'>
      {/* Back Link */}
      <div>
        <Link
          href={`/dashboard/employer/jobs/${application.job_id}/applicants`}
          className='inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-emerald-400 hover:text-emerald-300 transition-colors'>
          <ArrowLeft className='h-3 w-3' />
          Back to Applicants List
        </Link>
      </div>

      {/* Header Profile Card */}
      <div className='rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md p-8 shadow-xl space-y-6'>
        <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-6'>
          <div className='space-y-1.5'>
            <div className='flex items-center gap-2'>
              <span className='font-mono text-[10px] uppercase bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800 text-slate-300'>
                Application ID: #{application.id}
              </span>
              <span
                className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider ${
                  application.status === "PENDING"
                    ? "border-amber-500/20 bg-amber-500/10 text-amber-400"
                    : application.status === "ACCEPTED"
                      ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                      : "border-rose-500/20 bg-rose-500/10 text-rose-400"
                }`}>
                {application.status}
              </span>
            </div>
            <h1 className='text-2xl font-bold text-white'>
              {application.candidate_name}
            </h1>
            <p className='text-xs font-mono text-slate-400'>
              Applied for:{" "}
              <span className='text-emerald-400'>{application.job_title}</span>
            </p>
          </div>

          <div>
            <EmployerActionModal
              application={application}
              onUpdateStatus={reviewApplicationAction}
            />
          </div>
        </div>

        {/* Contact Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono'>
          <div className='flex items-center gap-2.5 bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-slate-300'>
            <Mail className='h-4 w-4 text-emerald-400 shrink-0' />
            <span className='truncate'>{application.candidate_email}</span>
          </div>
          <div className='flex items-center gap-2.5 bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-slate-300'>
            <Phone className='h-4 w-4 text-emerald-400 shrink-0' />
            <span>{application.phone || "Not provided"}</span>
          </div>
          {application.github_repo && (
            <a
              href={application.github_repo}
              target='_blank'
              rel='noopener noreferrer'
              className='flex items-center gap-2.5 bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-slate-300 hover:border-emerald-500/50 transition-colors'>
              <GitBranch className='h-4 w-4 text-emerald-400 shrink-0' />
              <span className='truncate'>GitHub Profile / Repository</span>
            </a>
          )}
          {application.portfolio_link && (
            <a
              href={application.portfolio_link}
              target='_blank'
              rel='noopener noreferrer'
              className='flex items-center gap-2.5 bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-slate-300 hover:border-emerald-500/50 transition-colors'>
              <Globe className='h-4 w-4 text-emerald-400 shrink-0' />
              <span className='truncate'>Portfolio / Live URL</span>
            </a>
          )}
        </div>

        {/* CV / Resume Section */}
        {application.cv_url && (
          <div className='bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <div className='p-2.5 bg-emerald-500/10 rounded-lg border border-emerald-500/20 text-emerald-400'>
                <FileText className='h-5 w-5' />
              </div>
              <div>
                <h4 className='text-xs font-semibold text-white'>
                  Candidate Resume / CV
                </h4>
                <p className='text-[10px] font-mono text-slate-400 mt-0.5'>
                  Uploaded document attached for review.
                </p>
              </div>
            </div>
            <a
              href={application.cv_url}
              target='_blank'
              rel='noopener noreferrer'
              className='bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold px-4 py-2 rounded-lg text-xs transition-all'>
              Download CV &rarr;
            </a>
          </div>
        )}
      </div>

      {/* Candidate Bio */}
      {application.bio && (
        <div className='rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md p-6 space-y-3'>
          <h2 className='text-xs font-mono uppercase tracking-widest text-slate-400'>
            Candidate Short Bio
          </h2>
          <p className='text-sm text-slate-300 leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-800'>
            {application.bio}
          </p>
        </div>
      )}

      {/* Cover Letter Section */}
      <div className='rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md p-6 space-y-3'>
        <h2 className='text-xs font-mono uppercase tracking-widest text-slate-400'>
          Cover Letter / Statement of Interest
        </h2>
        <div className='text-sm text-slate-300 leading-relaxed bg-slate-950 p-6 rounded-xl border border-slate-800 whitespace-pre-line'>
          {application.cover_letter || "No cover letter provided."}
        </div>
      </div>

      {/* Employer Feedback / Chat History Notes */}
      {application.employer_feedback && (
        <div className='rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md p-6 space-y-3'>
          <h2 className='text-xs font-mono uppercase tracking-widest text-emerald-400'>
            Latest Employer Feedback & Sent Message
          </h2>
          <div className='text-xs text-slate-300 leading-relaxed bg-slate-950 p-4 rounded-xl border border-emerald-500/20'>
            {application.employer_feedback}
          </div>
        </div>
      )}
    </div>
  );
}
