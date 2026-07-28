import PostCard from "@/components/PostCard";
import getAuthUser from "@/lib/getAuthUser";
import { dataEngine } from "@/services/dataEngine";
import Link from "next/link";
import { redirect } from "next/navigation";

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

  return (
    <div className='space-y-8'>
      {/* HEADER SECTION */}
      <div className='p-6 md:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800/80 shadow-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 relative overflow-hidden'>
        <div className='absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none'></div>

        <div className='space-y-1 relative z-10'>
          <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-widest mb-2'>
            Universal Workspace
          </div>
          <h1 className='text-3xl font-extrabold text-white tracking-tight'>
            {user.name}
          </h1>
          <p className='text-xs font-mono text-slate-400'>
            Profile Status:{" "}
            <span className='text-emerald-400 font-bold'>
              Active & Verified
            </span>
          </p>
        </div>

        <Link
          href='/posts/create'
          className='relative z-10 bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-6 py-3 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-lg shadow-emerald-500/20 text-center'>
          + Create New Post
        </Link>
      </div>

      {/* PUBLISHED ARTIFACTS CONTAINER */}
      <div className='p-6 md:p-8 rounded-3xl bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 shadow-xl space-y-6'>
        {hasPosts ? (
          <div className='space-y-6'>
            <div className='flex justify-between items-center border-b border-slate-800 pb-4'>
              <h2 className='text-xs font-mono uppercase tracking-widest font-bold text-slate-300 flex items-center gap-2'>
                <span className='w-2 h-2 rounded-full bg-emerald-500'></span>
                Published Artifacts ({filteredPosts.length})
              </h2>
            </div>

            <div className='grid gap-6 md:grid-cols-2'>
              {filteredPosts.map((post) => (
                <div
                  key={post.id}
                  className='bg-slate-950/60 border border-slate-800 rounded-2xl hover:border-emerald-500/40 transition-all p-2 shadow-md'>
                  <PostCard
                    post={post}
                    currentUserId={String(user.userId || user.id)}
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className='text-center py-20 space-y-4'>
            <div className='mx-auto w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-emerald-400 text-lg shadow-inner font-mono font-bold'>
              0
            </div>
            <div>
              <h3 className='text-sm font-bold text-white'>Matrix Vacant</h3>
              <p className='text-xs text-slate-500 mt-1 max-w-sm mx-auto'>
                No authored content or job opportunities detected in your
                professional sector yet.
              </p>
            </div>
            <Link
              href='/posts/create'
              className='inline-block text-xs font-mono font-bold text-slate-950 bg-emerald-500 hover:bg-emerald-400 px-5 py-2.5 rounded-xl transition-all shadow-md shadow-emerald-500/20 uppercase tracking-wider'>
              + Author Your First Pulse
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
