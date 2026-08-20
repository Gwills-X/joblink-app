import Link from "next/link";
import { redirect } from "next/navigation";
import getAuthUser from "@/lib/getAuthUser";
import { seekerEngine } from "@/services/seekerEngine";
import JobApplicationForm from "./JobApplicationForm";

export default async function JobDetailViewPage({ params }) {
  const authUser = await getAuthUser();
  const { jobId } = await params;

  let job = null;
  let hasSeekerProfile = false;

  try {
    job = await seekerEngine.getJobListingById(jobId);

    if (!job) {
      redirect("/jobs");
    }

    // Check if seeker has a profile
    if (authUser) {
      hasSeekerProfile = await seekerEngine.hasSeekerProfile(
        String(authUser.userId || authUser.id),
      );
    }
  } catch (error) {
    if (error.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }

    console.error("Job Detail Engine Fetch Error:", error);
    redirect("/jobs");
  }

  // ---------------------------------------------------------
  // APPLICANT SLOT CALCULATION
  // ---------------------------------------------------------

  const maxApplicants = Number(job.max_applicants || 0);
  const applicantCount = Number(job.applicant_count || 0);

  const remainingSlots = Math.max(maxApplicants - applicantCount, 0);

  // ---------------------------------------------------------
  // LISTING TYPE
  // ---------------------------------------------------------

  const listingType = String(job.listing_type || "JOB").toUpperCase();

  const isJob = listingType === "JOB";
  const isCollaboration = listingType === "COLLABORATION";
  const isProject = listingType === "PROJECT";
  const isPartnership = listingType === "PARTNERSHIP";

  const listingLabel = isJob
    ? "Job Opening"
    : isCollaboration
      ? "Collaboration"
      : isProject
        ? "Project"
        : isPartnership
          ? "Partnership"
          : listingType;

  const applicationLabel = isJob
    ? "Application"
    : isCollaboration
      ? "Collaboration Pitch"
      : isProject
        ? "Project Proposal"
        : isPartnership
          ? "Partnership Proposal"
          : "Application";

  return (
    <div className='mx-auto max-w-4xl space-y-10 px-6 py-12'>
      {/* BACK */}
      <div>
        <Link
          href='/jobs'
          className='inline-flex items-center gap-1.5 font-mono text-xs text-emerald-400 hover:underline'>
          &larr; Back to Marketplace Feed
        </Link>
      </div>

      {/* JOB HEADER */}
      <div className='space-y-6 rounded-3xl border border-slate-800 bg-slate-900/60 p-8 shadow-xl backdrop-blur-md'>
        <div className='flex flex-col items-start justify-between gap-4 md:flex-row md:items-center'>
          <div className='space-y-2'>
            {/* META */}
            <div className='flex flex-wrap items-center gap-2'>
              <span className='rounded-md border border-slate-800 bg-slate-950 px-3 py-1 font-mono text-xs uppercase text-slate-300'>
                {job.employment_type || "OPPORTUNITY"}
              </span>

              <span
                className={`rounded-md border px-3 py-1 font-mono text-xs ${
                  isCollaboration
                    ? "border-purple-500/20 bg-purple-500/10 text-purple-400"
                    : isPartnership
                      ? "border-orange-500/20 bg-orange-500/10 text-orange-400"
                      : isProject
                        ? "border-blue-500/20 bg-blue-500/10 text-blue-400"
                        : "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                }`}>
                {listingLabel}
              </span>
            </div>

            <h1 className='text-3xl font-extrabold tracking-tight text-white'>
              {job.title}
            </h1>

            <p className='font-mono text-sm text-slate-400'>
              🏢 {job.company_name || "Independent listing"} • 📍{" "}
              {job.location || "Remote"} • Posted{" "}
              {job.created_at
                ? new Date(job.created_at).toLocaleDateString()
                : "Recently"}
            </p>
          </div>

          {/* COMPENSATION */}
          <div className='text-left md:text-right'>
            <span className='block font-mono text-xs uppercase text-slate-400'>
              Compensation
            </span>

            <span className='mt-0.5 block font-mono text-base font-bold text-emerald-400'>
              {job.salary || "Competitive / Equity"}
            </span>
          </div>
        </div>

        {/* APPLICANT AVAILABILITY */}
        <div className='grid grid-cols-1 gap-3 border-t border-slate-800 pt-6 sm:grid-cols-3'>
          <div className='rounded-xl border border-slate-800 bg-slate-950/70 p-4'>
            <p className='font-mono text-[10px] uppercase tracking-wider text-slate-500'>
              Applicant Limit
            </p>

            <p className='mt-1 text-lg font-bold text-white'>{maxApplicants}</p>
          </div>

          <div className='rounded-xl border border-slate-800 bg-slate-950/70 p-4'>
            <p className='font-mono text-[10px] uppercase tracking-wider text-slate-500'>
              Applications Received
            </p>

            <p className='mt-1 text-lg font-bold text-white'>
              {applicantCount}
            </p>
          </div>

          <div
            className={`rounded-xl border p-4 ${
              remainingSlots > 0
                ? "border-emerald-500/20 bg-emerald-500/10"
                : "border-rose-500/20 bg-rose-500/10"
            }`}>
            <p className='font-mono text-[10px] uppercase tracking-wider text-slate-500'>
              Remaining Slots
            </p>

            <p
              className={`mt-1 text-lg font-bold ${
                remainingSlots > 0 ? "text-emerald-400" : "text-rose-400"
              }`}>
              {remainingSlots}
            </p>
          </div>
        </div>

        {/* DESCRIPTION */}
        <div className='space-y-4 border-t border-slate-800 pt-6'>
          <h2 className='font-mono text-xs uppercase tracking-widest text-slate-400'>
            Listing Description & Scope
          </h2>

          <div className='whitespace-pre-line rounded-2xl border border-slate-800/80 bg-slate-950/50 p-6 text-sm leading-relaxed text-slate-300'>
            {job.description}
          </div>
        </div>
      </div>

      {/* APPLICATION AREA */}
      {remainingSlots <= 0 ? (
        <div className='rounded-3xl border border-rose-500/20 bg-rose-500/5 p-10 text-center'>
          <div className='mx-auto max-w-lg space-y-3'>
            <div className='text-3xl'>⛔</div>

            <h2 className='text-xl font-bold text-white'>
              Applications Are Currently Full
            </h2>

            <p className='text-sm leading-relaxed text-slate-400'>
              This {listingLabel.toLowerCase()} has reached its maximum
              applicant capacity. The employer may increase the applicant limit
              if they want to receive additional applications.
            </p>

            <Link
              href='/jobs'
              className='mt-3 inline-block rounded-xl bg-emerald-500 px-6 py-2.5 text-xs font-semibold text-slate-950 transition hover:bg-emerald-400'>
              Browse Other Opportunities →
            </Link>
          </div>
        </div>
      ) : authUser && !hasSeekerProfile ? (
        <div className='rounded-3xl border border-amber-500/20 bg-amber-500/5 p-10 text-center'>
          <div className='mx-auto max-w-lg space-y-3'>
            <div className='text-3xl'>📋</div>

            <h2 className='text-xl font-bold text-white'>
              Create Your Profile First
            </h2>

            <p className='text-sm leading-relaxed text-slate-400'>
              You need to set up your professional profile before applying for
              opportunities. This helps employers learn about your experience
              and skills.
            </p>

            <Link
              href='/dashboard/seeker/profile/create'
              className='mt-3 inline-block rounded-xl bg-emerald-500 px-6 py-2.5 text-xs font-semibold text-slate-950 transition hover:bg-emerald-400'>
              Create Profile →
            </Link>
          </div>
        </div>
      ) : (
        <JobApplicationForm
          job={job}
          authUser={authUser}
          remainingSlots={remainingSlots}
          applicationLabel={applicationLabel}
          listingType={listingType}
        />
      )}
    </div>
  );
}
