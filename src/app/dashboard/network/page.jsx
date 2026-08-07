import { socialEngine } from "@/services/socialEngine";
import FollowButton from "@/components/FollowButton";
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

  return (
    <div className='grid grid-cols-1 gap-6 lg:grid-cols-4'>
      {/* Stats Sidebar */}
      <div className='lg:col-span-1'>
        <div className='rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-5 lg:sticky lg:top-24'>
          <div className='flex items-center gap-2'>
            <Users className='h-3.5 w-3.5 text-slate-600' />
            <span className='font-mono text-[11px] font-medium uppercase tracking-widest text-slate-500'>
              Your Network
            </span>
          </div>
          <div className='mt-4 grid grid-cols-2 gap-3'>
            <div className='rounded-md border border-slate-800 bg-slate-950 p-3 text-center'>
              <p className='text-lg font-semibold tracking-tight text-emerald-400'>
                {myStats.following}
              </p>
              <p className='mt-0.5 font-mono text-[10px] uppercase tracking-wider text-slate-600'>
                Following
              </p>
            </div>
            <div className='rounded-md border border-slate-800 bg-slate-950 p-3 text-center'>
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
          <span className='block font-mono text-[11px] font-medium uppercase tracking-widest text-slate-500'>
            Discover
          </span>
          <h1 className='mt-1 text-xl font-semibold tracking-tight text-slate-100'>
            Developers
          </h1>
        </div>

        <div className='space-y-2'>
          {suggestions.map((person) => (
            <div
              key={person.id}
              className='group flex items-center justify-between gap-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4 transition-all duration-150 hover:border-slate-700'>
              <Link
                href={`/dashboard/network/${person.id}`}
                className='flex min-w-0 flex-1 items-center gap-3'>
                <div className='flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-700 bg-[var(--color-slate)]'>
                  {person.profile_pic_url ? (
                    <img
                      src={person.profile_pic_url}
                      alt={person.name}
                      className='h-full w-full object-cover'
                    />
                  ) : (
                    <UserCircle className='h-5 w-5 text-slate-600' />
                  )}
                </div>
                <div className='min-w-0'>
                  <h3 className='truncate text-sm font-medium text-slate-200 transition-colors duration-150 group-hover:text-emerald-400'>
                    {person.name}
                  </h3>
                  <p className='truncate text-xs text-slate-500'>
                    {person.bio || "No bio set."}
                  </p>
                </div>
              </Link>

              <FollowButton
                currentUserId={user.userId}
                targetId={person.id}
                isInitiallyFollowing={person.isFollowing}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
