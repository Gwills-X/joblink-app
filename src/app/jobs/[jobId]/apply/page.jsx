import Link from "next/link";
import { redirect } from "next/navigation";
import getAuthUser from "@/lib/getAuthUser";
import { seekerEngine } from "@/services/seekerEngine";
import JobApplicationForm from "../JobApplicationForm";

export default async function OpportunityApplicationPage({ params }) {
  const authUser = await getAuthUser();
  const { jobId } = await params;

  let job = null;
  let hasSeekerProfile = false;

  try {
    job = await seekerEngine.getJobListingById(jobId);

    if (!job) redirect("/jobs");

    if (authUser) {
      hasSeekerProfile = await seekerEngine.hasSeekerProfile(
        String(authUser.userId || authUser.id),
      );
    }
  } catch (error) {
    if (error.digest?.startsWith("NEXT_REDIRECT")) throw error;
    console.error("Opportunity Application Fetch Error:", error);
    redirect(`/jobs/${jobId}`);
  }

  const listingType = String(job.listing_type || "JOB").toUpperCase();
  const applicationLabel =
    listingType === "COLLABORATION"
      ? "Collaboration Pitch"
      : listingType === "PROJECT"
        ? "Project Proposal"
        : listingType === "PARTNERSHIP"
          ? "Partnership Proposal"
          : "Application";
  const remainingSlots = Math.max(
    Number(job.max_applicants || 0) - Number(job.applicant_count || 0),
    0,
  );

  return (
    <div className='mx-auto max-w-4xl space-y-6 px-4 py-8 sm:px-6 sm:py-12'>
      <Link
        href={`/jobs/${jobId}`}
        className='inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-400 transition-colors hover:text-emerald-300'>
        ← Back to Opportunity
      </Link>

      <div className='rounded-3xl border border-slate-200 bg-white p-6 text-slate-900 shadow-md backdrop-blur-md md:p-8 dark:border-slate-800 dark:bg-slate-900/50 dark:text-white dark:shadow-xl'>
        <p className='font-mono text-[10px] uppercase tracking-widest text-emerald-400'>
          Submit Your Details
        </p>
        <h1 className='mt-2 text-2xl font-bold tracking-tight text-slate-900 md:text-3xl dark:text-white'>
          {job.title}
        </h1>
        <p className='mt-2 text-sm text-slate-600 dark:text-slate-400'>
          {job.company_name || "Independent listing"} ·{" "}
          {job.location || "Remote"}
        </p>
      </div>

      {remainingSlots <= 0 ? (
        <div className='rounded-3xl border border-rose-500/20 bg-rose-500/5 p-10 text-center'>
          <h2 className='text-xl font-bold text-white'>
            Applications Are Currently Full
          </h2>
          <p className='mt-2 text-sm text-slate-400'>
            This opportunity is no longer accepting applications.
          </p>
        </div>
      ) : authUser && !hasSeekerProfile ? (
        <div className='rounded-3xl border border-amber-500/20 bg-amber-500/5 p-10 text-center'>
          <h2 className='text-xl font-bold text-white'>
            Create Your Profile First
          </h2>
          <p className='mx-auto mt-2 max-w-lg text-sm text-slate-400'>
            Set up your professional profile before applying so the opportunity
            owner can review your background.
          </p>
          <Link
            href='/dashboard/seeker/profile/create'
            className='mt-5 inline-flex rounded-xl bg-emerald-500 px-6 py-2.5 text-xs font-semibold text-slate-950 transition-colors hover:bg-emerald-400'>
            Create Profile →
          </Link>
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
