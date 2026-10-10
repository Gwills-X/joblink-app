import Link from "next/link";
import { redirect } from "next/navigation";
import getAuthUser from "@/lib/getAuthUser";
import { savedJobsEngine } from "@/services/savedJobsEngine";
import SavedOpportunityCard from "@/components/SavedOpportunityCard";

export const dynamic = "force-dynamic";

export default async function SavedOpportunitiesPage() {
  const user = await getAuthUser();
  if (!user) redirect("/login");

  const userId = String(user.userId || user.id);
  let opportunities = [];
  let loadError = false;

  try {
    opportunities = await savedJobsEngine.list(userId);
  } catch (error) {
    console.error("Saved opportunities could not be loaded:", error);
    loadError = true;
  }

  return (
    <div className='mx-auto max-w-4xl px-4 py-6'>
      <div className='mb-5 flex flex-wrap items-end justify-between gap-3 border-b border-slate-200 pb-4 dark:border-slate-800'>
        <div>
          <p className='font-mono text-[10px] uppercase text-slate-500'>
            Candidate Hub
          </p>
          <h1 className='mt-1 text-xl font-semibold text-slate-900 dark:text-slate-100'>
            Saved Jobs & Opportunities
          </h1>
        </div>
        <Link
          href='/jobs'
          className='text-xs font-medium text-emerald-700 hover:underline dark:text-emerald-400'>
          Browse opportunities
        </Link>
      </div>

      {loadError ? (
        <div
          role='alert'
          className='rounded-lg border border-rose-500/30 bg-rose-500/5 p-5 text-sm text-rose-700 dark:text-rose-300'>
          Saved opportunities couldn’t be loaded. Refresh the page to try again.
        </div>
      ) : opportunities.length === 0 ? (
        <div className='rounded-lg border border-dashed border-slate-300 px-5 py-12 text-center dark:border-slate-700'>
          <h2 className='text-sm font-semibold text-slate-800 dark:text-slate-200'>
            No saved opportunities yet
          </h2>
          <p className='mt-1 text-xs text-slate-500'>
            Opportunities you bookmark will appear here.
          </p>
          <Link
            href='/jobs'
            className='mt-4 inline-block text-xs font-semibold text-emerald-700 hover:underline dark:text-emerald-400'>
            Explore opportunities
          </Link>
        </div>
      ) : (
        <div className='divide-y divide-slate-200 dark:divide-slate-800'>
          {opportunities.map((opportunity) => (
            <SavedOpportunityCard
              key={opportunity.id}
              opportunity={opportunity}
              currentUserId={userId}
            />
          ))}
        </div>
      )}
    </div>
  );
}
