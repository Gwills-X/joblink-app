import PostCard from "@/components/PostCard";
import getAuthUser from "@/lib/getAuthUser";
import { dataEngine } from "@/services/dataEngine";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus, FileText, Heart, MessageCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const user = await getAuthUser();
  if (!user) return redirect("/login");

  const postsCollection = await dataEngine.getTimeline(
    String(user.userId || user.id),
  );
  const filteredPosts = postsCollection.filter(
    (post) => String(user.userId || user.id) === String(post.authorId),
  );
  const hasPosts = filteredPosts.length > 0;
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
      {/* Header */}
      <div className='flex flex-col gap-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <span className='block font-mono text-[11px] font-medium uppercase tracking-widest text-slate-500'>
            Universal Workspace
          </span>
          <h1 className='mt-1 text-xl font-semibold tracking-tight text-slate-100'>
            {user.name}
          </h1>
          <p className='mt-1 max-w-md text-xs leading-relaxed text-slate-500'>
            Manage published updates and keep your opportunities front and
            center.
          </p>
        </div>

        <div className='flex items-center gap-3'>
          <div className='flex items-center gap-4 rounded-lg border border-slate-800 bg-slate-950 px-4 py-2'>
            <div className='flex items-center gap-1.5'>
              <Heart className='h-3.5 w-3.5 text-slate-600' />
              <span className='font-mono text-[11px] font-medium text-slate-400'>
                {totalLikes}
              </span>
            </div>
            <div className='h-3 w-px bg-slate-800' />
            <div className='flex items-center gap-1.5'>
              <MessageCircle className='h-3.5 w-3.5 text-slate-600' />
              <span className='font-mono text-[11px] font-medium text-slate-400'>
                {totalComments}
              </span>
            </div>
          </div>
          <Link
            href='/posts/create'
            className='inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-medium text-[var(--color-slate)] transition-all duration-150 hover:bg-emerald-400 active:scale-[0.98]'>
            <Plus className='h-3.5 w-3.5' />
            New Post
          </Link>
        </div>
      </div>

      {/* Posts */}
      <div className='space-y-4'>
        <div className='flex items-center justify-between border-b border-slate-800 pb-2.5'>
          <span className='font-mono text-[11px] font-medium uppercase tracking-widest text-slate-500'>
            Published Artifacts
          </span>
          <span className='font-mono text-[10px] tracking-wide text-slate-600'>
            {filteredPosts.length} record{filteredPosts.length !== 1 ? "s" : ""}
          </span>
        </div>

        {hasPosts ? (
          <div className='grid gap-3 md:grid-cols-2'>
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                className='rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-3 transition-all duration-150 hover:border-slate-700'>
                <PostCard
                  post={post}
                  currentUserId={String(user.userId || user.id)}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className='flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-800 py-16 px-6'>
            <div className='flex h-10 w-10 items-center justify-center rounded-lg border border-slate-800 bg-[var(--color-slate)]'>
              <FileText className='h-4 w-4 text-slate-600' />
            </div>
            <h3 className='mt-4 text-sm font-medium text-slate-300'>
              No posts yet
            </h3>
            <p className='mt-1 text-xs text-slate-500'>
              No authored content detected in your professional sector.
            </p>
            <Link
              href='/posts/create'
              className='mt-4 inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-transparent px-4 py-2 text-xs font-medium text-slate-300 transition-all duration-150 hover:border-slate-600 hover:bg-slate-800/50 hover:text-slate-100'>
              <Plus className='h-3.5 w-3.5' />
              Author First Post
            </Link>
            <div className='mt-4 font-mono text-[10px] tracking-wider text-slate-700 uppercase'>
              Status: <span className='text-slate-600'>EMPTY_SET</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
