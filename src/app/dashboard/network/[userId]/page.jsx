import { socialEngine } from "@/services/socialEngine";
import FollowButton from "@/components/FollowButton";
import Link from "next/link";
import { notFound } from "next/navigation";
import getAuthUser from "@/lib/getAuthUser";
import {
  ArrowLeft,
  MessageSquare,
  Heart,
  Users,
  MapPin,
  Calendar,
  UserCircle,
} from "lucide-react";

export default async function UserProfilePage({ params }) {
  const { userId } = await params;
  const authUser = await getAuthUser();

  if (!authUser) return <div>Please log in.</div>;

  const user = await socialEngine.getUserFullProfile(userId);
  if (!user) return notFound();

  const posts = await socialEngine.getUserPosts(userId);
  const stats = await socialEngine.getFollowStats(userId);
  const isFollowing = await socialEngine.checkIfFollowing(
    authUser.userId,
    userId,
  );

  return (
    <div className='mx-auto max-w-3xl space-y-6 py-8 px-4'>
      <Link
        href='/dashboard/network'
        className='inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-slate-500 transition-colors duration-150 hover:text-emerald-400'>
        <ArrowLeft className='h-3.5 w-3.5' />
        Back to Network
      </Link>

      {/* Profile Card */}
      <div className='rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6'>
        <div className='flex flex-col gap-5 sm:flex-row sm:items-start'>
          <div className='flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-700 bg-[var(--color-slate)]'>
            {user.profile_pic_url ? (
              <img
                src={user.profile_pic_url}
                alt={user.name}
                className='h-full w-full object-cover'
              />
            ) : (
              <UserCircle className='h-8 w-8 text-slate-600' />
            )}
          </div>

          <div className='min-w-0 flex-1'>
            <div className='flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between'>
              <div>
                <h1 className='text-lg font-semibold tracking-tight text-slate-100'>
                  {user.name}
                </h1>
                <p className='mt-1 text-xs leading-relaxed text-slate-500'>
                  {user.bio}
                </p>
                <div className='mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600'>
                  {user.location && (
                    <span className='flex items-center gap-1'>
                      <MapPin className='h-3 w-3' />
                      {user.location}
                    </span>
                  )}
                  <span className='flex items-center gap-1 font-mono text-[11px]'>
                    <Calendar className='h-3 w-3' />
                    Joined {new Date(user.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <FollowButton
                currentUserId={authUser?.userId}
                targetId={userId}
                isInitiallyFollowing={isFollowing}
              />
            </div>

            {/* Stats */}
            <div className='mt-5 flex gap-6 border-t border-slate-800 pt-4'>
              <div className='flex items-center gap-2'>
                <Users className='h-3.5 w-3.5 text-slate-600' />
                <span className='font-mono text-sm font-semibold text-slate-300'>
                  {stats.followers}
                </span>
                <span className='font-mono text-[10px] uppercase tracking-wider text-slate-600'>
                  Followers
                </span>
              </div>
              <div className='flex items-center gap-2'>
                <Users className='h-3.5 w-3.5 text-slate-600' />
                <span className='font-mono text-sm font-semibold text-slate-300'>
                  {stats.following}
                </span>
                <span className='font-mono text-[10px] uppercase tracking-wider text-slate-600'>
                  Following
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Posts */}
      <div className='space-y-4'>
        <span className='block font-mono text-[11px] font-medium uppercase tracking-widest text-slate-500'>
          Recent Posts
        </span>
        <div className='space-y-3'>
          {posts.map((post) => (
            <Link
              href={`/posts/${post.id}`}
              key={post.id}
              className='group block rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-5 transition-all duration-150 hover:border-slate-700'>
              <p className='line-clamp-3 text-sm leading-relaxed text-slate-400 transition-colors duration-150 group-hover:text-slate-300'>
                {post.content}
              </p>
              <div className='mt-4 flex items-center gap-4 border-t border-slate-800 pt-3'>
                <span className='flex items-center gap-1.5 text-xs text-slate-600'>
                  <Heart className='h-3.5 w-3.5' />
                  <span className='font-mono text-[11px]'>
                    {post.likesCount || 0}
                  </span>
                </span>
                <span className='flex items-center gap-1.5 text-xs text-slate-600'>
                  <MessageSquare className='h-3.5 w-3.5' />
                  <span className='font-mono text-[11px]'>
                    {post.commentsCount || 0}
                  </span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
