import Link from "next/link";
import CreatorActions from "@/components/CreatorActions";
import SaveOpportunityButton from "@/components/SaveOpportunityButton";

const typeStyles = {
  JOB: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
  PROJECT: "border-blue-500/20 bg-blue-500/10 text-blue-400",
  COLLABORATION: "border-purple-500/20 bg-purple-500/10 text-purple-400",
  PARTNERSHIP: "border-orange-500/20 bg-orange-500/10 text-orange-400",
};

export default function OpportunityCard({ opportunity, currentUserId }) {
  const listingType = String(opportunity.listing_type || "JOB").toUpperCase();
  const typeStyle = typeStyles[listingType] || typeStyles.JOB;
  const remainingSlots = Number(opportunity.remaining_slots || 0);

  return (
    <article className='flex min-w-0 flex-col justify-between gap-5 rounded-2xl border border-slate-200 bg-white p-5 text-slate-900 shadow-md transition-all hover:border-emerald-300 hover:shadow-lg dark:border-slate-700/80 dark:bg-slate-800/60 dark:text-white dark:shadow-xl dark:hover:border-slate-600'>
      <div className='space-y-4'>
        <div className='flex items-start justify-between gap-3'>
          <div className='flex min-w-0 flex-wrap items-center gap-2'>
            <span className='rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1 font-mono text-xs uppercase text-emerald-700 dark:border-slate-700 dark:bg-slate-700 dark:text-emerald-400'>
              {opportunity.employment_type || "OPPORTUNITY"}
            </span>
            <span
              className={`rounded-md border px-2.5 py-1 font-mono text-xs ${typeStyle}`}>
              {listingType}
            </span>
          </div>
          <div className='flex shrink-0 items-center gap-2'>
            <span className='font-mono text-[10px] text-slate-500'>
              {opportunity.created_at
                ? new Date(opportunity.created_at).toLocaleDateString()
                : "Recently"}
            </span>
            <SaveOpportunityButton
              jobId={opportunity.id}
              currentUserId={currentUserId}
              initiallySaved={Boolean(opportunity.is_saved)}
            />
          </div>
        </div>

        <div className='flex min-w-0 items-start gap-3'>
          {opportunity.logo_url ? (
            <img
              src={opportunity.logo_url}
              alt=''
              className='h-10 w-10 shrink-0 rounded-lg border border-slate-200 object-cover dark:border-slate-700'
            />
          ) : null}
          <div className='min-w-0'>
            <h3 className='line-clamp-2 text-lg font-bold tracking-tight text-slate-900 transition-colors hover:text-emerald-700 dark:text-white dark:hover:text-emerald-400'>
              {opportunity.title}
            </h3>
            <p className='mt-1 truncate font-mono text-xs text-slate-600 dark:text-slate-400'>
              {opportunity.company_name || "Independent listing"} ·{" "}
              {opportunity.location || "Remote"}
            </p>
          </div>
        </div>

        <p className='line-clamp-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400'>
          {opportunity.description}
        </p>
      </div>

      <div className='space-y-4 border-t border-slate-200 pt-4 dark:border-slate-700/80'>
        <CreatorActions
          creatorId={opportunity.posted_by}
          creatorName={opportunity.posted_by_name || opportunity.company_name}
          currentUserId={currentUserId}
          isInitiallyFollowing={Boolean(opportunity.isFollowing)}
        />
        <div className='flex flex-wrap items-center justify-between gap-2'>
          <span className='font-mono text-xs font-semibold text-emerald-400'>
            {opportunity.salary || "Competitive / Equity"}
          </span>
          <span className='font-mono text-[10px] text-slate-600 dark:text-slate-400'>
            {remainingSlots} {remainingSlots === 1 ? "slot" : "slots"} remaining
          </span>
        </div>
        <Link
          href={`/jobs/${opportunity.id}`}
          className='block rounded-xl bg-emerald-500 px-4 py-2.5 text-center text-xs font-semibold text-slate-950 shadow-md shadow-emerald-500/10 transition-all hover:bg-emerald-400'>
          View Opportunity →
        </Link>
      </div>
    </article>
  );
}
