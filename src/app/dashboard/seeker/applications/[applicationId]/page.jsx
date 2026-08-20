import getAuthUser from "@/lib/getAuthUser";
import { redirect } from "next/navigation";
import Link from "next/link";
import { seekerEngine } from "@/services/seekerEngine";
import WithdrawApplicationButton from "../../components/WithdrawApplicationButton";
import {
  ArrowLeft,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  GitBranchIcon,
  Globe,
  MapPin,
  Mail,
  Phone,
  XCircle,
  AlertCircle,
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
    return <CheckCircle2 className='h-4 w-4' />;
  }

  if (status === "REJECTED") {
    return <XCircle className='h-4 w-4' />;
  }

  if (status === "SHORTLISTED") {
    return <CheckCircle2 className='h-4 w-4' />;
  }

  return <Clock className='h-4 w-4' />;
}

function Info({ label, value }) {
  return (
    <div className='rounded-lg border border-slate-800 bg-slate-950 p-3'>
      <p className='font-mono text-[9px] uppercase tracking-wider text-slate-600'>
        {label}
      </p>
      <p className='mt-1 break-words text-xs text-slate-300'>
        {value || "Not provided"}
      </p>
    </div>
  );
}

function ExternalLink({ icon, label, href }) {
  return (
    <a
      href={href}
      target='_blank'
      rel='noopener noreferrer'
      className='flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-950 p-3 text-xs text-slate-300 transition hover:border-emerald-500/30 hover:text-emerald-400'>
      {icon}
      <span>{label}</span>
    </a>
  );
}

export default async function SeekerApplicationDetailsPage({ params }) {
  const user = await getAuthUser();

  if (!user) redirect("/login");

  const resolvedParams = await params;
  const applicationId = resolvedParams?.applicationId;

  if (!applicationId) {
    redirect("/dashboard/seeker/applications");
  }

  const userId = String(user.userId || user.id);

  const application = await seekerEngine.getSeekerApplicationDetails(
    applicationId,
    userId,
  );

  if (!application) {
    redirect("/dashboard/seeker/applications");
  }

  const {
    status,
    rejection_reason,
    employer_feedback,
    job_title,
    company_name,
    location,
    applied_at,
  } = application;

  const isPending = status === "PENDING";
  const isRejected = status === "REJECTED";
  const isAccepted = status === "ACCEPTED";
  const isShortlisted = status === "SHORTLISTED";
  const isWithdrawn = status === "WITHDRAWN";

  return (
    <div className='mx-auto max-w-5xl space-y-5 px-4 py-7'>
      <Link
        href='/dashboard/seeker/applications'
        className='inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-slate-500 transition hover:text-emerald-400'>
        <ArrowLeft className='h-3.5 w-3.5' />
        Back to Applications
      </Link>

      {/* Header */}
      <section className='rounded-xl border border-slate-800 bg-slate-900/60 p-5'>
        <div className='flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
          <div>
            <div className='flex flex-wrap items-center gap-2'>
              <span className='rounded-md border border-slate-800 bg-slate-950 px-2 py-1 font-mono text-[9px] uppercase tracking-wider text-slate-600'>
                #{application.application_id}
              </span>

              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[9px] uppercase tracking-wider ${statusStyle(
                  status,
                )}`}>
                <StatusIcon status={status} />
                {status}
              </span>
            </div>

            <h1 className='mt-3 text-xl font-semibold text-slate-100'>
              {job_title}
            </h1>

            <div className='mt-2 flex flex-wrap gap-3 text-[11px] text-slate-500'>
              <span className='flex items-center gap-1.5'>
                <Building2 className='h-3 w-3' />
                {company_name || "Independent Employer"}
              </span>

              {location && (
                <span className='flex items-center gap-1.5'>
                  <MapPin className='h-3 w-3' />
                  {location}
                </span>
              )}

              <span className='flex items-center gap-1.5'>
                <Calendar className='h-3 w-3' />
                Applied {new Date(applied_at).toLocaleDateString()}
              </span>
            </div>
          </div>

          {application.job_id && (
            <Link
              href={`/jobs/${application.job_id}`}
              className='inline-flex items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2 text-[11px] font-medium text-slate-300 transition hover:border-emerald-500/40 hover:text-emerald-400'>
              <Briefcase className='h-3.5 w-3.5' />
              View Listing
            </Link>
          )}
        </div>
      </section>

      {/* Decision */}
      {isRejected && (
        <section className='rounded-xl border border-rose-500/20 bg-rose-500/5 p-5'>
          <div className='flex gap-3'>
            <XCircle className='mt-0.5 h-5 w-5 shrink-0 text-rose-400' />

            <div className='min-w-0'>
              <h2 className='text-sm font-semibold text-rose-300'>
                Application Not Selected
              </h2>

              <p className='mt-1 text-xs leading-relaxed text-slate-400'>
                The employer has reviewed your application and decided not to
                proceed with it.
              </p>

              {rejection_reason ? (
                <div className='mt-4 rounded-lg border border-rose-500/10 bg-slate-950/60 p-3'>
                  <p className='font-mono text-[9px] uppercase tracking-wider text-rose-400'>
                    Reason
                  </p>
                  <p className='mt-1 whitespace-pre-line text-xs leading-relaxed text-slate-300'>
                    {rejection_reason}
                  </p>
                </div>
              ) : (
                <p className='mt-3 text-[11px] text-slate-600'>
                  The employer did not provide a specific rejection reason.
                </p>
              )}

              {employer_feedback && (
                <div className='mt-3 rounded-lg border border-slate-800 bg-slate-950/60 p-3'>
                  <p className='font-mono text-[9px] uppercase tracking-wider text-slate-500'>
                    Employer Feedback
                  </p>
                  <p className='mt-1 whitespace-pre-line text-xs leading-relaxed text-slate-300'>
                    {employer_feedback}
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {isAccepted && (
        <section className='rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5'>
          <div className='flex gap-3'>
            <CheckCircle2 className='mt-0.5 h-5 w-5 shrink-0 text-emerald-400' />
            <div>
              <h2 className='text-sm font-semibold text-emerald-300'>
                Application Accepted
              </h2>
              <p className='mt-1 text-xs leading-relaxed text-slate-400'>
                Congratulations. The employer has accepted your application.
              </p>

              {employer_feedback && (
                <div className='mt-3 rounded-lg border border-emerald-500/10 bg-slate-950/50 p-3'>
                  <p className='font-mono text-[9px] uppercase tracking-wider text-emerald-400'>
                    Employer Message
                  </p>
                  <p className='mt-1 whitespace-pre-line text-xs leading-relaxed text-slate-300'>
                    {employer_feedback}
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {isShortlisted && (
        <section className='rounded-xl border border-blue-500/20 bg-blue-500/5 p-5'>
          <div className='flex gap-3'>
            <CheckCircle2 className='mt-0.5 h-5 w-5 shrink-0 text-blue-400' />
            <div>
              <h2 className='text-sm font-semibold text-blue-300'>
                You Have Been Shortlisted
              </h2>
              <p className='mt-1 text-xs leading-relaxed text-slate-400'>
                Your application has moved to the employer&apos;s shortlist.
                Watch this page for further updates.
              </p>

              {employer_feedback && (
                <div className='mt-3 rounded-lg border border-blue-500/10 bg-slate-950/50 p-3'>
                  <p className='font-mono text-[9px] uppercase tracking-wider text-blue-400'>
                    Employer Feedback
                  </p>
                  <p className='mt-1 whitespace-pre-line text-xs leading-relaxed text-slate-300'>
                    {employer_feedback}
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {isPending && (
        <section className='rounded-xl border border-amber-500/20 bg-amber-500/5 p-5'>
          <div className='flex gap-3'>
            <AlertCircle className='mt-0.5 h-5 w-5 shrink-0 text-amber-400' />
            <div>
              <h2 className='text-sm font-semibold text-amber-300'>
                Application Under Review
              </h2>
              <p className='mt-1 text-xs leading-relaxed text-slate-400'>
                Your application has been submitted successfully. The employer
                has not made a final decision yet.
              </p>
            </div>
          </div>
        </section>
      )}

      {isWithdrawn && (
        <section className='rounded-xl border border-slate-700 bg-slate-900/50 p-5'>
          <div className='flex gap-3'>
            <Clock className='mt-0.5 h-5 w-5 shrink-0 text-slate-400' />
            <div>
              <h2 className='text-sm font-semibold text-slate-300'>
                Application Withdrawn
              </h2>
              <p className='mt-1 text-xs leading-relaxed text-slate-500'>
                You withdrew this application. A new application cannot be
                submitted for the same opportunity.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Opportunity */}
      <section className='rounded-xl border border-slate-800 bg-slate-900/60 p-5'>
        <div className='mb-4 flex items-center gap-2'>
          <Briefcase className='h-4 w-4 text-emerald-400' />
          <h2 className='text-sm font-semibold text-slate-200'>
            Opportunity Details
          </h2>
        </div>

        <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-3'>
          <Info label='Employment Type' value={application.employment_type} />
          <Info label='Listing Type' value={application.listing_type} />
          <Info label='Location' value={application.location} />
          <Info label='Salary' value={application.salary} />
          <Info
            label='Deadline'
            value={
              application.deadline
                ? new Date(application.deadline).toLocaleDateString()
                : "No deadline"
            }
          />
          <Info label='Listing Status' value={application.job_status} />
        </div>

        <div className='mt-4 rounded-lg border border-slate-800 bg-slate-950 p-4'>
          <p className='mb-2 font-mono text-[9px] uppercase tracking-wider text-slate-600'>
            Job Description
          </p>
          <p className='whitespace-pre-line text-xs leading-relaxed text-slate-400'>
            {application.job_description || "No description provided."}
          </p>
        </div>
      </section>

      {/* Submitted application */}
      <section className='rounded-xl border border-slate-800 bg-slate-900/60 p-5'>
        <div className='mb-4 flex items-center gap-2'>
          <FileText className='h-4 w-4 text-emerald-400' />
          <h2 className='text-sm font-semibold text-slate-200'>
            Your Submitted Application
          </h2>
        </div>

        <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-3'>
          <Info
            label='Full Name'
            value={
              <span className='flex items-center gap-1.5'>
                <span>{application.full_name}</span>
              </span>
            }
          />
          <Info
            label='Email'
            value={
              <span className='flex items-center gap-1.5'>
                <Mail className='h-3 w-3 text-slate-600' />
                {application.email}
              </span>
            }
          />
          <Info
            label='Phone'
            value={
              <span className='flex items-center gap-1.5'>
                <Phone className='h-3 w-3 text-slate-600' />
                {application.phone}
              </span>
            }
          />
        </div>

        <div className='mt-4 space-y-3'>
          <div>
            <p className='mb-1.5 font-mono text-[9px] uppercase tracking-wider text-slate-600'>
              Cover Letter
            </p>
            <div className='rounded-lg border border-slate-800 bg-slate-950 p-4 text-xs leading-relaxed text-slate-300'>
              <p className='whitespace-pre-line'>
                {application.cover_letter || "No cover letter submitted."}
              </p>
            </div>
          </div>

          {application.bio && (
            <div>
              <p className='mb-1.5 font-mono text-[9px] uppercase tracking-wider text-slate-600'>
                Professional Bio
              </p>
              <div className='rounded-lg border border-slate-800 bg-slate-950 p-4 text-xs leading-relaxed text-slate-300'>
                {application.bio}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Documents */}
      <section className='rounded-xl border border-slate-800 bg-slate-900/60 p-5'>
        <div className='mb-4 flex items-center gap-2'>
          <FileText className='h-4 w-4 text-emerald-400' />
          <h2 className='text-sm font-semibold text-slate-200'>
            Submitted Documents & Links
          </h2>
        </div>

        <div className='grid gap-2 sm:grid-cols-3'>
          {application.github_repo && (
            <ExternalLink
              icon={<GitBranchIcon className='h-4 w-4' />}
              label='GitHub Repository'
              href={application.github_repo}
            />
          )}

          {application.portfolio_link && (
            <ExternalLink
              icon={<Globe className='h-4 w-4' />}
              label='Portfolio'
              href={application.portfolio_link}
            />
          )}

          {application.cv_url && (
            <ExternalLink
              icon={<FileText className='h-4 w-4' />}
              label='View CV / Resume'
              href={application.cv_url}
            />
          )}
        </div>

        {!application.github_repo &&
          !application.portfolio_link &&
          !application.cv_url && (
            <p className='text-xs text-slate-600'>
              No external documents or links were submitted.
            </p>
          )}
      </section>

      {/* Withdraw */}
      {isPending && (
        <section className='flex flex-col gap-3 rounded-xl border border-slate-800 bg-slate-900/40 p-4 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <h3 className='text-xs font-semibold text-slate-300'>
              No longer interested?
            </h3>
            <p className='mt-1 text-[10px] text-slate-600'>
              You can withdraw while the application is still pending.
            </p>
          </div>

          <WithdrawApplicationButton
            applicationId={application.application_id}
          />
        </section>
      )}
    </div>
  );
}
