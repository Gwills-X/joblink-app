import PostCard from "@/components/PostCard";
import OpportunityCard from "@/components/OpportunityCard";
import getAuthUser from "@/lib/getAuthUser";
import { dataEngine } from "@/services/dataEngine";
import { seekerEngine } from "@/services/seekerEngine";
import Link from "next/link";
import { ArrowRight, FolderOpen, Activity } from "lucide-react";
import Footer from "@/components/Footer";
export const dynamic = "force-dynamic";

export default async function Home() {
  const user = await getAuthUser();
  const currentUserId = user ? String(user.userId || user.id) : null;
  let opportunities = [];

  try {
    const opportunityResults = await seekerEngine.getMarketplaceListings(
      "ALL",
      "",
      currentUserId,
    );
    opportunities = opportunityResults ? opportunityResults.slice(0, 6) : [];
  } catch (error) {
    console.error("Homepage Opportunities Fetch Error:", error);
  }

  const postsCollection = await dataEngine.getTimeline(currentUserId);
  const posts = postsCollection ? postsCollection.slice(0, 4) : [];

  return (
    <div>
      <div className='space-y-8 pb-16'>
        <div className='flex flex-wrap items-center justify-between gap-3 border-b border-(--color-border) pb-4'>
          <div>
            <p className='font-mono text-[10px] font-semibold uppercase tracking-widest text-emerald-400'>
              JobLink opportunities
            </p>
            <p className='mt-1 text-sm text-slate-500'>
              The latest jobs, projects, collaborations, and partnerships.
            </p>
          </div>
          <Link
            href='/jobs'
            className='inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-300 transition-colors hover:text-emerald-200'>
            Explore all <ArrowRight className='h-3.5 w-3.5' />
          </Link>
        </div>

        {/* ─── OPPORTUNITIES ─── */}
        <section className='space-y-4'>
          <div className='flex flex-wrap items-end justify-between gap-3 border-b border-(--color-border) pb-2.5'>
            <div>
              <span className='font-mono text-[10px] font-medium uppercase tracking-widest text-emerald-400'>
                Career & Recruitment
              </span>
              <h2 className='mt-1 text-xl font-semibold tracking-tight text-slate-100'>
                Latest Opportunities
              </h2>
            </div>
            <Link
              href='/jobs'
              className='inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-emerald-300 transition-colors hover:text-emerald-200'>
              View All Opportunities <ArrowRight className='h-3.5 w-3.5' />
            </Link>
          </div>

          {opportunities.length > 0 ? (
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3'>
              {opportunities.map((opportunity) => (
                <OpportunityCard
                  key={opportunity.id}
                  opportunity={opportunity}
                  currentUserId={currentUserId}
                />
              ))}
            </div>
          ) : (
            <div className='rounded-lg border border-dashed border-slate-800 px-6 py-12 text-center'>
              <h3 className='text-sm font-medium text-slate-300'>
                No opportunities available at the moment.
              </h3>
              <Link
                href='/jobs'
                className='mt-3 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-emerald-300 hover:text-emerald-200'>
                Browse Opportunities <ArrowRight className='h-3.5 w-3.5' />
              </Link>
            </div>
          )}
        </section>

        {/* ─── MAIN GRID ─── */}
        <section className='grid grid-cols-1 gap-6 items-start'>
          {/* Professional Community */}
          <div className='space-y-4'>
            <div className='flex flex-wrap items-end justify-between gap-3 border-b border-(--color-border) pb-2.5'>
              <div className='flex items-center gap-2.5'>
                <Activity className='h-3.5 w-3.5 text-emerald-400' />
                <div>
                  <span className='block font-mono text-[10px] font-medium uppercase tracking-widest text-slate-500'>
                    Networking
                  </span>
                  <h2 className='mt-1 text-xl font-semibold tracking-tight text-slate-100'>
                    Professional Community
                  </h2>
                </div>
              </div>
              <Link
                href='/dashboard'
                className='inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-emerald-300 transition-colors hover:text-emerald-200'>
                View Community <ArrowRight className='h-3.5 w-3.5' />
              </Link>
            </div>

            {posts.length > 0 ? (
              <div className='space-y-3'>
                {posts.map((post) => (
                  <PostCard
                    post={post}
                    key={post.id}
                    currentUserId={currentUserId}
                  />
                ))}
              </div>
            ) : (
              <div className='flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-800 py-16 px-6'>
                <div className='flex h-10 w-10 items-center justify-center rounded-lg border border-slate-800 bg-(--color-slate)'>
                  <FolderOpen className='h-4 w-4 text-slate-600' />
                </div>
                <h3 className='mt-4 text-sm font-medium text-slate-300'>
                  No community posts yet
                </h3>
                <p className='mt-1 max-w-xs text-center text-xs leading-relaxed text-slate-500'>
                  Visit the community to share ideas and connect with other
                  professionals.
                </p>
                <div className='mt-5 font-mono text-[10px] tracking-wider text-slate-700 uppercase'>
                  Status: <span className='text-slate-600'>EMPTY_SET</span>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}
