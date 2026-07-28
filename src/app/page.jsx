import PostCard from "@/components/PostCard";
import getAuthUser from "@/lib/getAuthUser";
import { dataEngine } from "@/services/dataEngine";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function Home() {
  const user = await getAuthUser();
  const currentUserId = user ? String(user.userId) : null;
  const postsCollection = await dataEngine.getTimeline(currentUserId);
  const posts = postsCollection ? postsCollection.slice(0, 12) : [];

  return (
    <div className='space-y-10 selection:bg-emerald-500/20 selection:text-emerald-400 pb-16'>
      {/* 1. PROFESSIONAL SUB-NAVIGATION & STATUS BAR */}
      <div className='bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 rounded-2xl px-6 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl'>
        <div className='flex items-center space-x-3'>
          <span className='flex h-2.5 w-2.5 relative'>
            <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75'></span>
            <span className='relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500'></span>
          </span>
          <span className='text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold'>
            JobLink Professional Workspace
          </span>
        </div>

        {/* Quick Nav Workspace Tabs */}
        <div className='flex items-center gap-1.5 bg-slate-950/60 p-1 rounded-xl border border-slate-800/60'>
          <Link
            href='/'
            className='px-4 py-1.5 rounded-lg text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-sm transition-all'>
            Feed
          </Link>
          <Link
            href='/dashboard/applications'
            className='px-4 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-all'>
            Applications
          </Link>
          <Link
            href='/dashboard/settings'
            className='px-4 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-all'>
            Settings
          </Link>
        </div>
      </div>

      {/* 2. HERO / WELCOME BANNER (Spectacular SaaS Feel) */}
      <section className='relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800/80 p-8 md:p-12 shadow-2xl'>
        {/* Background Ambient Glow FX */}
        <div className='absolute top-0 right-0 -mt-16 -mr-16 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none'></div>
        <div className='absolute bottom-0 left-1/3 -mb-16 w-64 h-64 bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none'></div>

        <div className='relative z-10 max-w-3xl space-y-6'>
          <div className='inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-widest shadow-inner'>
            <span className='w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse'></span>
            Talent & Opportunity Portal
          </div>

          <h1 className='text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]'>
            Connect with top companies &{" "}
            <span className='text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300'>
              accelerate your career.
            </span>
          </h1>

          <p className='text-base sm:text-lg text-slate-400 leading-relaxed font-normal max-w-2xl'>
            Manage your professional presence, track job applications
            seamlessly, and collaborate with high-caliber peers across the
            network.
          </p>

          <div className='flex flex-wrap items-center gap-3.5 pt-2'>
            {user ? (
              <Link
                href='/posts/create'
                className='bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-6 py-3 rounded-xl text-xs font-mono uppercase tracking-wider transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2'>
                <span>+ Create Post / Opportunity</span>
              </Link>
            ) : (
              <>
                <Link
                  href='/login'
                  className='bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-6 py-3 rounded-xl text-xs font-mono uppercase tracking-wider transition-all shadow-lg shadow-emerald-500/20'>
                  Sign In
                </Link>
                <Link
                  href='/register'
                  className='bg-slate-800/80 hover:bg-slate-800 text-slate-200 font-bold px-6 py-3 rounded-xl text-xs font-mono uppercase tracking-wider border border-slate-700/80 transition-all shadow-sm'>
                  Create Account
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* 3. MAIN CONTENT GRID */}
      <section className='grid grid-cols-1 lg:grid-cols-12 gap-8 items-start'>
        {/* Main Feed Column (8 cols) */}
        <div className='lg:col-span-8 space-y-6'>
          <div className='flex items-center justify-between border-b border-slate-800/80 pb-3.5'>
            <h2 className='text-xs font-bold uppercase tracking-widest text-slate-300 font-mono flex items-center gap-2.5'>
              <span className='w-2 h-2 rounded-full bg-emerald-500'></span>
              Live Activity Stream
            </h2>
            <span className='text-[11px] text-slate-400 font-mono bg-slate-900/80 px-2.5 py-1 rounded-md border border-slate-800'>
              {posts.length} updates loaded
            </span>
          </div>

          {posts.length > 0 ? (
            <div className='space-y-4'>
              {posts.map((post) => (
                <PostCard
                  post={post}
                  key={post.id}
                  currentUserId={currentUserId}
                />
              ))}
            </div>
          ) : (
            <div className='min-h-[260px] flex flex-col items-center justify-center text-center p-8 rounded-2xl border border-dashed border-slate-800 bg-slate-900/20 space-y-3'>
              <div className='w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 text-lg'>
                📂
              </div>
              <div>
                <h3 className='text-sm font-semibold text-slate-300'>
                  No active updates found
                </h3>
                <p className='text-xs text-slate-500 mt-1 max-w-sm'>
                  Be the first to share a project or career opportunity with the
                  network.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Column (4 cols) */}
        <aside className='lg:col-span-4 space-y-6 lg:sticky lg:top-24'>
          {/* User Profile Card (If Logged In) */}
          {user && (
            <div className='p-6 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800 space-y-4 shadow-xl'>
              <div className='flex items-center gap-3.5'>
                <div className='w-14 h-14 rounded-2xl bg-slate-950 flex items-center justify-center overflow-hidden border border-emerald-500/30 flex-shrink-0 shadow-md'>
                  {user.profile_pic_url ? (
                    <img
                      src={user.profile_pic_url}
                      className='w-full h-full object-cover'
                      alt={user.name}
                    />
                  ) : (
                    <span className='font-extrabold text-emerald-400 font-mono text-base'>
                      {user.name ? user.name.slice(0, 2).toUpperCase() : "JL"}
                    </span>
                  )}
                </div>

                <div className='min-w-0 flex-1'>
                  <h3 className='font-bold text-white text-sm truncate'>
                    {user.name}
                  </h3>
                  <p className='text-xs text-emerald-400 font-mono truncate mt-0.5'>
                    {user.location || "Remote Developer"}
                  </p>
                </div>
              </div>

              <p className='text-xs text-slate-400 leading-relaxed line-clamp-2 bg-slate-950/40 p-3 rounded-xl border border-slate-800/50'>
                {user.bio || "No professional bio configured yet."}
              </p>

              <div className='pt-2 border-t border-slate-800/80 flex gap-2'>
                <Link
                  href='/dashboard/settings'
                  className='w-full py-2.5 text-center text-xs font-semibold font-mono uppercase tracking-wider bg-slate-800/80 hover:bg-slate-800 text-slate-200 rounded-xl transition-all border border-slate-700/80 shadow-sm'>
                  Edit Profile Settings
                </Link>
              </div>
            </div>
          )}

          {/* Quick Metrics / Stats Widget */}
          <div className='p-6 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800 space-y-4 shadow-xl'>
            <h3 className='text-xs font-bold tracking-widest uppercase text-slate-400 font-mono flex items-center gap-2'>
              <span className='w-1.5 h-1.5 rounded-full bg-emerald-400'></span>
              Workspace Overview
            </h3>

            <div className='space-y-2.5 font-mono text-xs text-slate-400'>
              <div className='p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/60 flex justify-between items-center shadow-inner'>
                <span className='text-slate-400'>Account Status</span>
                <span className='text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20'>
                  ACTIVE
                </span>
              </div>

              <div className='p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/60 flex justify-between items-center shadow-inner'>
                <span className='text-slate-400'>Profile Visibility</span>
                <span className='text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20'>
                  PUBLIC
                </span>
              </div>
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}
