import Link from "next/link";
import { redirect } from "next/navigation";
import getAuthUser from "@/lib/getAuthUser";
import { seekerEngine } from "@/services/seekerEngine";
import { opportunityCommentEngine } from "@/services/opportunityCommentEngine";
import OpportunityComments from "@/components/OpportunityComments";
import OpportunityEngagement from "@/components/OpportunityEngagement";

export default async function JobDetailViewPage({ params }) {
  const authUser = await getAuthUser();
  const { jobId } = await params;

  let job = null;
  let comments = [];

  try {
    job = await seekerEngine.getJobListingById(jobId);

    if (!job) {
      redirect("/jobs");
    }

    comments = await opportunityCommentEngine.getComments(jobId);
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

  return (
    <div className='mx-auto max-w-5xl space-y-8 px-4 py-8 sm:px-6 sm:py-12'>
      {/* BACK */}
      <div>
        <Link
          href='/jobs'
          className='inline-flex items-center gap-1.5 font-mono text-xs text-emerald-400 hover:underline'>
          &larr; Back to Marketplace Feed
        </Link>
      </div>

      {/* OPPORTUNITY DETAILS */}
      <div className='space-y-6 rounded-3xl border border-slate-200 bg-white p-6 text-slate-900 shadow-md transition-shadow hover:shadow-lg md:p-8 dark:border-slate-800 dark:bg-slate-900/60 dark:text-white dark:shadow-xl dark:hover:shadow-emerald-950/20'>
        <div className='flex flex-col items-start justify-between gap-4 md:flex-row md:items-center'>
          <div className='space-y-2'>
            {/* META */}
            <div className='flex flex-wrap items-center gap-2'>
              <span className='rounded-md border border-emerald-200 bg-emerald-50 px-3 py-1 font-mono text-xs uppercase text-emerald-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300'>
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

            <h1 className='text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl dark:text-white'>
              {job.title}
            </h1>

            <p className='font-mono text-sm text-slate-600 dark:text-slate-400'>
              🏢 {job.company_name || "Independent listing"} • 📍{" "}
              {job.location || "Remote"} • Posted{" "}
              {job.created_at
                ? new Date(job.created_at).toLocaleDateString()
                : "Recently"}
            </p>
          </div>

          <div className='rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-left md:min-w-52 md:text-right dark:border-emerald-500/20 dark:bg-emerald-500/5'>
            <span className='block font-mono text-xs uppercase text-slate-600 dark:text-slate-400'>
              Compensation
            </span>

            <span className='mt-0.5 block font-mono text-base font-bold text-emerald-400'>
              {job.salary || "Competitive / Equity"}
            </span>
          </div>
        </div>

        {/* AVAILABILITY */}
        <div className='grid grid-cols-1 gap-3 border-t border-slate-200 pt-6 sm:grid-cols-3 dark:border-slate-800'>
          <div className='rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/70'>
            <p className='font-mono text-[10px] uppercase tracking-wider text-slate-500'>
              Applicant Limit
            </p>

            <p className='mt-1 text-lg font-bold text-slate-900 dark:text-white'>
              {maxApplicants}
            </p>
          </div>

          <div className='rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/70'>
            <p className='font-mono text-[10px] uppercase tracking-wider text-slate-500'>
              Applications Received
            </p>

            <p className='mt-1 text-lg font-bold text-slate-900 dark:text-white'>
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
        <div className='space-y-4 border-t border-slate-200 pt-6 dark:border-slate-800'>
          <h2 className='font-mono text-xs uppercase tracking-widest text-slate-400'>
            Listing Description & Scope
          </h2>

          <div className='whitespace-pre-line rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm leading-relaxed text-slate-700 dark:border-slate-800/80 dark:bg-slate-950/50 dark:text-slate-300'>
            {job.description}
          </div>
        </div>

        <OpportunityEngagement commentCount={comments.length} />
      </div>

      {/* APPLICATION CTA */}
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
      ) : (
        <div className='sticky bottom-4 z-10 flex items-center justify-between gap-4 rounded-2xl border border-emerald-200 bg-white/95 p-4 shadow-2xl shadow-slate-900/10 backdrop-blur-md dark:border-emerald-500/20 dark:bg-slate-900/95 dark:shadow-black/30'>
          <div className='hidden sm:block'>
            <p className='text-sm font-semibold text-slate-900 dark:text-white'>
              Interested in this opportunity?
            </p>
            <p className='mt-0.5 text-xs text-slate-600 dark:text-slate-500'>
              Review the requirements and submit your details.
            </p>
          </div>
          <Link
            href={`/jobs/${jobId}/apply`}
            className='ml-auto inline-flex items-center justify-center rounded-xl bg-emerald-500 px-6 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/10 transition-all hover:bg-emerald-400 hover:shadow-emerald-500/20 active:scale-[0.98]'>
            Apply Now →
          </Link>
        </div>
      )}

      <OpportunityComments
        id='discussion'
        opportunityId={jobId}
        comments={comments}
        currentUserId={authUser ? String(authUser.userId || authUser.id) : null}
      />
    </div>
  );
}
