import PostCard from "@/components/PostCard";
import getAuthUser from "@/lib/getAuthUser";
import { dataEngine } from "@/services/dataEngine";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus, FileText, Heart, MessageCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardPostsPage() {
  const user = await getAuthUser();
  if (!user) return redirect("/login");

  const postsCollection = await dataEngine.getTimeline(
    String(user.userId || user.id),
  );
  const filteredPosts = postsCollection.filter(
    (post) => String(user.userId || user.id) === String(post.authorId),
  );
  const totalLikes = filteredPosts.reduce(
    (sum, post) => sum + Number(post.likesCount || 0),
    0,
  );
  const totalComments = filteredPosts.reduce(
    (sum, post) => sum + Number(post.commentsCount || 0),
    0,
  );

  return (
    <div className='space-y-6'>
      <div className='flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-md sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-900 dark:shadow-none'>
        <div>
          <span className='block font-mono text-[11px] font-medium uppercase tracking-widest text-slate-500'>
            Published Content
          </span>
          <h1 className='mt-1 text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100'>
            {user.name}
          </h1>
          <p className='mt-1 max-w-md text-xs leading-relaxed text-slate-500'>
            Manage your posts and professional updates.
          </p>
        </div>
        <div className='flex items-center gap-3'>
          <div className='flex items-center gap-4 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 dark:border-slate-800 dark:bg-slate-950'>
            <span className='flex items-center gap-1.5 font-mono text-[11px] text-slate-600 dark:text-slate-400'>
              <Heart className='h-3.5 w-3.5' />
              {totalLikes}
            </span>
            <span className='flex items-center gap-1.5 font-mono text-[11px] text-slate-600 dark:text-slate-400'>
              <MessageCircle className='h-3.5 w-3.5' />
              {totalComments}
            </span>
          </div>
          <Link
            href='/posts/create'
            className='inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-medium text-(--color-slate) transition hover:bg-emerald-400'>
            <Plus className='h-3.5 w-3.5' />
            New Post
          </Link>
        </div>
      </div>
      <div className='space-y-4'>
        <div className='flex items-center justify-between border-b border-slate-200 pb-2.5 dark:border-slate-800'>
          <span className='font-mono text-[11px] font-medium uppercase tracking-widest text-slate-500'>
            Published Artifacts
          </span>
          <span className='font-mono text-[10px] tracking-wide text-slate-600'>
            {filteredPosts.length} record{filteredPosts.length !== 1 ? "s" : ""}
          </span>
        </div>
        {filteredPosts.length > 0 ? (
          <div className='grid gap-3 md:grid-cols-2'>
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                className='rounded-lg border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900'>
                <PostCard
                  post={post}
                  currentUserId={String(user.userId || user.id)}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className='flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 py-16 px-6 dark:border-slate-800'>
            <FileText className='h-5 w-5 text-slate-600' />
            <h3 className='mt-4 text-sm font-medium text-slate-900 dark:text-slate-300'>
              No posts yet
            </h3>
            <Link
              href='/posts/create'
              className='mt-4 inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-xs font-medium text-slate-700 dark:border-slate-700 dark:text-slate-300'>
              <Plus className='h-3.5 w-3.5' />
              Author First Post
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
