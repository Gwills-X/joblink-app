import { socialEngine } from "@/services/socialEngine";
import FollowButton from "@/components/FollowButton";
import ChatRequestButton from "@/components/ChatRequestButton";
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
    <div className='mx-auto max-w-4xl space-y-8 py-8 px-4'>
      <Link
        href='/dashboard/network'
        className='inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-slate-500 transition-colors duration-150 hover:text-emerald-400'>
        <ArrowLeft className='h-3.5 w-3.5' />
        Back to Network
      </Link>

      {/* Profile Card */}
      <div className='rounded-2xl border border-slate-700 bg-[var(--color-surface)] p-8 backdrop-blur'>
        <div className='flex flex-col gap-6 sm:flex-row sm:items-start'>
          <div className='flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-700 bg-gradient-to-br from-emerald-500/10 to-slate-900'>
            {user.profile_pic_url ? (
              <img
                src={user.profile_pic_url}
                alt={user.name}
                className='h-full w-full object-cover'
              />
            ) : (
              <UserCircle className='h-10 w-10 text-slate-600' />
            )}
          </div>

          <div className='min-w-0 flex-1'>
            <div className='flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
              <div className='space-y-2'>
                <h1 className='text-2xl font-bold tracking-tight text-slate-50'>
                  {user.name}
                </h1>
                <p className='text-sm leading-relaxed text-slate-400'>
                  {user.bio || "Crafting meaningful connections on JobLink."}
                </p>
                <div className='flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-600'>
                  {user.location && (
                    <span className='flex items-center gap-1.5 text-slate-400'>
                      <MapPin className='h-3.5 w-3.5 text-emerald-400/60' />
                      {user.location}
                    </span>
                  )}
                  {user.headline && (
                    <span className='text-slate-400 font-medium'>
                      {user.headline}
                    </span>
                  )}
                  {user.created_at && (
                    <span className='flex items-center gap-1 text-slate-500'>
                      <Calendar className='h-3.5 w-3.5' />
                      Joined {new Date(user.created_at).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>

              <div className='flex flex-col gap-2 sm:items-end'>
                <FollowButton
                  currentUserId={authUser?.userId}
                  targetId={userId}
                  isInitiallyFollowing={isFollowing}
                />
                {String(authUser.userId || authUser.id) !== String(userId) && (
                  <ChatRequestButton
                    receiverId={userId}
                    receiverName={user.name}
                  />
                )}
              </div>
            </div>

            {/* Stats */}
            <div className='mt-6 flex gap-8 border-t border-slate-700/50 pt-6'>
              <div className='space-y-1'>
                <span className='block font-mono text-base font-bold text-slate-100'>
                  {stats.followers}
                </span>
                <span className='text-[10px] uppercase tracking-wider text-slate-600'>
                  Followers
                </span>
              </div>
              <div className='space-y-1'>
                <span className='block font-mono text-base font-bold text-slate-100'>
                  {stats.following}
                </span>
                <span className='text-[10px] uppercase tracking-wider text-slate-600'>
                  Following
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Posts */}
      <div className='space-y-5'>
        <div className='flex items-baseline justify-between'>
          <div>
            <h2 className='text-xl font-semibold text-slate-50'>
              Recent Posts
            </h2>
            <p className='mt-1 text-xs text-slate-500'>
              Latest activity from {user.name}
            </p>
          </div>
          <span className='rounded-full border border-slate-700/50 bg-slate-900/40 px-2.5 py-1 text-[10px] font-semibold text-slate-400'>
            {posts.length}
          </span>
        </div>
        <div className='space-y-3'>
          {posts.length === 0 ? (
            <div className='rounded-xl border border-dashed border-slate-700/40 p-8 text-center text-sm text-slate-500'>
              <div className='mx-auto mb-3 h-8 w-8 rounded-full bg-slate-800/40' />
              No posts yet
            </div>
          ) : (
            posts.map((post) => (
              <Link
                href={`/posts/${post.id}`}
                key={post.id}
                className='group block rounded-xl border border-slate-700 bg-slate-950/50 p-5 transition-all duration-150 hover:border-emerald-500/30 hover:bg-slate-900/60'>
                <p className='line-clamp-3 text-sm leading-relaxed text-slate-300 group-hover:text-slate-200'>
                  {post.content}
                </p>
                <div className='mt-4 flex items-center gap-4 border-t border-slate-700/50 pt-3 text-xs text-slate-600'>
                  <span className='flex items-center gap-1.5'>
                    <Heart className='h-3.5 w-3.5' />
                    <span className='font-mono text-[10px]'>
                      {post.likesCount || 0}
                    </span>
                  </span>
                  <span className='flex items-center gap-1.5'>
                    <MessageSquare className='h-3.5 w-3.5' />
                    <span className='font-mono text-[10px]'>
                      {post.commentsCount || 0}
                    </span>
                  </span>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
