import { socialEngine } from "@/services/socialEngine";
import { chatEngine } from "@/services/chatEngine";
import FollowButton from "@/components/FollowButton";
import ChatRequestButton from "@/components/ChatRequestButton";
import getAuthUser from "@/lib/getAuthUser";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Users, ArrowRight, UserCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function NetworkPage() {
  const user = await getAuthUser();
  if (!user) redirect("/login");

  const suggestions = await socialEngine.getSuggestedUsers(user.userId);
  const myStats = await socialEngine.getFollowStats(user.userId);
  const chatRelationships = await chatEngine.getRelationships(
    user.userId,
    suggestions.map((person) => person.id),
  );

  return (
    <div className='space-y-8'>
      <section className='relative overflow-hidden rounded-2xl border border-emerald-200 bg-emerald-50 p-6 shadow-sm dark:border-emerald-500/20 dark:bg-emerald-950/20 md:p-8'>
        <div className='relative z-10 max-w-2xl'>
          <span className='font-mono text-[10px] font-semibold uppercase tracking-[0.25em] text-emerald-700 dark:text-emerald-300'>
            People & Partners
          </span>
          <h1 className='mt-2 text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100'>
            Build a network that moves with you.
          </h1>
          <p className='mt-3 max-w-xl text-sm leading-relaxed text-slate-700 dark:text-slate-300'>
            Meet professionals, founders, employers, creatives, and future
            collaborators. Follow useful voices and start conversations with
            purpose.
          </p>
        </div>
        <div className='absolute -right-16 -bottom-24 h-56 w-56 rounded-full border-24 border-emerald-200/70 dark:border-emerald-500/10' />
      </section>

      <div className='grid grid-cols-1 gap-6 lg:grid-cols-4'>
        {/* Stats Sidebar */}
        <div className='lg:col-span-1'>
          <div className='rounded-lg border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-24 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none'>
            <div className='flex items-center gap-2'>
              <Users className='h-3.5 w-3.5 text-slate-600' />
              <span className='font-mono text-[11px] font-medium uppercase tracking-widest text-slate-500'>
                Your Network
              </span>
            </div>
            <div className='mt-4 grid grid-cols-2 gap-3'>
              <div className='rounded-md border border-slate-200 bg-slate-50 p-3 text-center dark:border-slate-800 dark:bg-slate-950'>
                <p className='text-lg font-semibold tracking-tight text-emerald-400'>
                  {myStats.following}
                </p>
                <p className='mt-0.5 font-mono text-[10px] uppercase tracking-wider text-slate-600'>
                  Following
                </p>
              </div>
              <div className='rounded-md border border-slate-200 bg-slate-50 p-3 text-center dark:border-slate-800 dark:bg-slate-950'>
                <p className='text-lg font-semibold tracking-tight text-emerald-400'>
                  {myStats.followers}
                </p>
                <p className='mt-0.5 font-mono text-[10px] uppercase tracking-wider text-slate-600'>
                  Followers
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Directory */}
        <div className='lg:col-span-3 space-y-4'>
          <div>
            <span className='block font-mono text-[11px] font-medium uppercase tracking-widest text-emerald-600 dark:text-emerald-400'>
              Suggested connections
            </span>
            <h2 className='mt-1 text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100'>
              People worth knowing
            </h2>
            <p className='mt-1 text-sm text-slate-600 dark:text-slate-400'>
              Explore profiles and decide who you would like to keep in touch
              with.
            </p>
          </div>

          <div className='grid gap-4 md:grid-cols-2'>
            {suggestions.map((person) => (
              <div
                key={person.id}
                className='group flex min-h-52 flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-emerald-500/40'>
                <Link
                  href={`/dashboard/network/${person.id}`}
                  className='flex min-w-0 items-start gap-3'>
                  <div className='flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-emerald-200 bg-emerald-50 dark:border-emerald-500/20 dark:bg-emerald-500/10'>
                    {person.profile_pic_url ? (
                      <img
                        src={person.profile_pic_url}
                        alt={person.name}
                        className='h-full w-full object-cover'
                      />
                    ) : (
                      <UserCircle className='h-6 w-6 text-emerald-600 dark:text-emerald-400' />
                    )}
                  </div>
                  <div className='min-w-0'>
                    <h3 className='truncate text-sm font-semibold text-slate-900 transition-colors duration-150 group-hover:text-emerald-700 dark:text-slate-200 dark:group-hover:text-emerald-400'>
                      {person.name}
                    </h3>
                    <p className='mt-1 line-clamp-3 text-xs leading-relaxed text-slate-600 dark:text-slate-400'>
                      {person.bio ||
                        "Open to meaningful professional connections."}
                    </p>
                  </div>
                </Link>

                <div className='mt-5 flex flex-wrap items-center gap-2 border-t border-slate-200 pt-4 dark:border-slate-800'>
                  <FollowButton
                    currentUserId={user.userId}
                    targetId={person.id}
                    isInitiallyFollowing={person.isFollowing}
                  />
                  <ChatRequestButton
                    receiverId={person.id}
                    receiverName={person.name}
                    relationshipStatus={chatRelationships[person.id]?.status}
                    roomId={chatRelationships[person.id]?.roomId}
                    requestId={chatRelationships[person.id]?.requestId}
                  />
                  <Link
                    href={`/dashboard/network/${person.id}`}
                    className='ml-auto inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-emerald-700 dark:text-slate-400 dark:hover:text-emerald-400'>
                    View profile <ArrowRight className='h-3.5 w-3.5' />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {suggestions.length === 0 && (
            <div className='rounded-xl border border-dashed border-slate-300 p-10 text-center dark:border-slate-700'>
              <Users className='mx-auto h-8 w-8 text-emerald-500' />
              <h3 className='mt-3 text-sm font-semibold text-slate-900 dark:text-slate-100'>
                Your network is just getting started
              </h3>
              <p className='mt-1 text-sm text-slate-600 dark:text-slate-400'>
                Return as more people join JobLink and discover new connections.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
