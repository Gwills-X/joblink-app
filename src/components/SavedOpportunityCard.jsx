import Link from "next/link";
import { Bookmark, MapPin } from "lucide-react";
import SaveOpportunityButton from "@/components/SaveOpportunityButton";

function unavailableReason(opportunity) {
  if (opportunity.status !== "OPEN") return "This listing is closed.";

  if (Boolean(Number(opportunity.is_expired)))
    return "The application deadline has passed.";

  return "The applicant limit has been reached.";
}

export default function SavedOpportunityCard({ opportunity, currentUserId }) {
  const alreadyApplied = Boolean(opportunity.application_id);
  const isAvailable = Boolean(Number(opportunity.is_available));

  return (
    <article className='border-b border-slate-200 py-5 last:border-b-0 dark:border-slate-800'>
      <div className='flex items-start justify-between gap-4'>
        <div className='min-w-0'>
          <div className='mb-2 flex flex-wrap items-center gap-2'>
            <span className='rounded border border-slate-300 px-2 py-1 font-mono text-[10px] text-slate-600 dark:border-slate-700 dark:text-slate-400'>
              {opportunity.listing_type}
            </span>
            <span
              className={`rounded border px-2 py-1 font-mono text-[10px] ${
                isAvailable
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                  : "border-slate-300 bg-slate-100 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400"
              }`}>
              {isAvailable ? "OPEN" : "UNAVAILABLE"}
            </span>
          </div>
          <Link
            href={`/jobs/${opportunity.id}`}
            className='text-base font-semibold text-slate-900 hover:text-emerald-700 dark:text-slate-100 dark:hover:text-emerald-400'>
            {opportunity.title}
          </Link>
          <p className='mt-1 text-xs text-slate-600 dark:text-slate-400'>
            {opportunity.company_name || "Independent listing"}
          </p>
          <p className='mt-2 flex items-center gap-1.5 text-xs text-slate-500'>
            <MapPin className='h-3.5 w-3.5' />
            {opportunity.location || "Remote"}
          </p>
        </div>
        <SaveOpportunityButton
          jobId={opportunity.id}
          currentUserId={currentUserId}
          initiallySaved
        />
      </div>

      <div className='mt-4 grid grid-cols-2 gap-3 text-xs sm:grid-cols-3'>
        <div>
          <p className='text-slate-500'>Deadline</p>
          <p className='mt-1 text-slate-800 dark:text-slate-200'>
            {opportunity.deadline
              ? new Date(opportunity.deadline).toLocaleDateString()
              : "No deadline"}
          </p>
        </div>
        <div>
          <p className='text-slate-500'>Slots remaining</p>
          <p className='mt-1 text-slate-800 dark:text-slate-200'>
            {Number(opportunity.remaining_slots || 0)}
          </p>
        </div>
        <div>
          <p className='text-slate-500'>Company</p>
          <p className='mt-1 truncate text-slate-800 dark:text-slate-200'>
            {opportunity.company_name || "Independent listing"}
          </p>
        </div>
      </div>

      <div className='mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-3 dark:border-slate-800'>
        {alreadyApplied ? (
          <Link
            href={`/dashboard/seeker/applications/${opportunity.application_id}`}
            className='text-xs font-medium text-blue-700 hover:underline dark:text-blue-400'>
            Application status: {opportunity.application_status}
          </Link>
        ) : isAvailable ? (
          <Link
            href={`/jobs/${opportunity.id}/apply`}
            className='text-xs font-semibold text-emerald-700 hover:underline dark:text-emerald-400'>
            Apply now
          </Link>
        ) : (
          <p className='text-xs text-slate-500'>
            {unavailableReason(opportunity)}
          </p>
        )}
        <span className='inline-flex items-center gap-1.5 text-[11px] text-slate-500'>
          <Bookmark className='h-3 w-3' /> Saved
        </span>
      </div>
    </article>
  );
}
