import PostCard from "@/components/PostCard";
import getAuthUser from "@/lib/getAuthUser";
import { dataEngine } from "@/services/dataEngine";
import Link from "next/link";
import {
  Briefcase,
  TrendingUp,
  Users,
  Radio,
  ArrowRight,
  Plus,
  LogIn,
  UserPlus,
  FolderOpen,
  Activity,
  MapPin,
  Settings,
} from "lucide-react";
import Footer from "@/components/Footer";
export const dynamic = "force-dynamic";

export default async function Home() {
  const user = await getAuthUser();
  const currentUserId = user ? String(user.userId) : null;
  const postsCollection = await dataEngine.getTimeline(currentUserId);
  const posts = postsCollection ? postsCollection.slice(0, 12) : [];

  return (
    <div>
      <div className='space-y-8 pb-16'>
        {/* ─── STATUS BAR ─── */}
        <div className='flex items-center justify-between border-b border-[var(--color-border)] pb-3'>
          <div className='flex items-center gap-2.5'>
            <span className='relative flex h-2 w-2'>
              <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/60' />
              <span className='relative inline-flex h-2 w-2 rounded-full bg-emerald-500' />
            </span>
            <span className='font-mono text-[11px] font-medium uppercase tracking-wider text-slate-400'>
              JobLink Workspace
            </span>
          </div>

          <div className='flex items-center gap-1'>
            {[
              { label: "Feed", href: "/", active: true },
              { label: "Jobs", href: "/jobs", active: false },
              {
                label: "Applications",
                href: "/dashboard/seeker/applications",
                active: false,
              },
              { label: "Settings", href: "/dashboard/settings", active: false },
            ].map((tab) => (
              <Link
                key={tab.href}
                href={tab.href}
                className={`rounded-md px-3 py-1.5 font-mono text-[11px] font-medium uppercase tracking-wider transition-all duration-150 ${
                  tab.active
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/50"
                }`}>
                {tab.label}
              </Link>
            ))}
          </div>
        </div>

        {/* ─── HERO ─── */}
        <section className='rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 md:p-10'>
          <div className='max-w-2xl space-y-5'>
            <div className='inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1'>
              <span className='h-1.5 w-1.5 rounded-full bg-emerald-400' />
              <span className='font-mono text-[10px] font-medium uppercase tracking-widest text-emerald-400'>
                Talent & Opportunity Portal
              </span>
            </div>

            <h1 className='text-3xl font-semibold tracking-tight text-slate-100 md:text-4xl'>
              Connect with top companies and{" "}
              <span className='text-emerald-400'>accelerate your career.</span>
            </h1>

            <p className='text-sm leading-relaxed text-slate-400 max-w-lg'>
              Curated engineering roles, streamlined applications, and direct
              employer engagement — built for modern technical talent.
            </p>

            <div className='flex flex-wrap items-center gap-3 pt-1'>
              <Link
                href='/jobs'
                className='inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-medium text-[var(--color-slate)] transition-all duration-150 hover:bg-emerald-400 active:scale-[0.98]'>
                Browse Jobs
                <ArrowRight className='h-3.5 w-3.5' />
              </Link>

              {user ? (
                <Link
                  href='/posts/create'
                  className='inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-transparent px-5 py-2.5 text-sm font-medium text-slate-300 transition-all duration-150 hover:border-slate-600 hover:bg-slate-800/50 hover:text-slate-100 active:scale-[0.98]'>
                  <Plus className='h-3.5 w-3.5' />
                  Create Post
                </Link>
              ) : (
                <>
                  <Link
                    href='/login'
                    className='inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-medium text-[var(--color-slate)] transition-all duration-150 hover:bg-emerald-400 active:scale-[0.98]'>
                    <LogIn className='h-3.5 w-3.5' />
                    Sign In
                  </Link>
                  <Link
                    href='/register'
                    className='inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-transparent px-5 py-2.5 text-sm font-medium text-slate-300 transition-all duration-150 hover:border-slate-600 hover:bg-slate-800/50 hover:text-slate-100 active:scale-[0.98]'>
                    <UserPlus className='h-3.5 w-3.5' />
                    Create Account
                  </Link>
                </>
              )}
            </div>
          </div>
        </section>

        {/* ─── FEATURE CARDS ─── */}
        <section className='grid gap-3 md:grid-cols-3'>
          {[
            {
              icon: Briefcase,
              title: "Career-Focused Matches",
              desc: "Discover roles aligned with your stack, experience level, and growth trajectory.",
            },
            {
              icon: TrendingUp,
              title: "Application Visibility",
              desc: "Track every submission through the pipeline with real-time status updates.",
            },
            {
              icon: Users,
              title: "Employer Connections",
              desc: "Engage directly with hiring teams through transparent, structured conversations.",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className='group rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-5 transition-all duration-150 hover:border-slate-700 hover:bg-[var(--color-surface-soft)]'>
              <div className='flex h-9 w-9 items-center justify-center rounded-md border border-slate-800 bg-slate-900 text-emerald-400'>
                <feature.icon className='h-4 w-4' />
              </div>
              <h3 className='mt-4 text-sm font-medium text-slate-200'>
                {feature.title}
              </h3>
              <p className='mt-1.5 text-xs leading-relaxed text-slate-500'>
                {feature.desc}
              </p>
            </div>
          ))}
        </section>

        {/* ─── MAIN GRID ─── */}
        <section className='grid grid-cols-1 lg:grid-cols-12 gap-6 items-start'>
          {/* Feed */}
          <div className='lg:col-span-8 space-y-4'>
            <div className='flex items-center justify-between border-b border-[var(--color-border)] pb-2.5'>
              <div className='flex items-center gap-2.5'>
                <Activity className='h-3.5 w-3.5 text-emerald-400' />
                <h2 className='font-mono text-[11px] font-medium uppercase tracking-widest text-slate-400'>
                  Live Activity Stream
                </h2>
              </div>
              <span className='font-mono text-[10px] tracking-wide text-slate-600'>
                {posts.length} record{posts.length !== 1 ? "s" : ""}
              </span>
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
                <div className='flex h-10 w-10 items-center justify-center rounded-lg border border-slate-800 bg-[var(--color-slate)]'>
                  <FolderOpen className='h-4 w-4 text-slate-600' />
                </div>
                <h3 className='mt-4 text-sm font-medium text-slate-300'>
                  No active updates
                </h3>
                <p className='mt-1 max-w-xs text-center text-xs leading-relaxed text-slate-500'>
                  Be the first to share a project or career opportunity with the
                  network.
                </p>
                <div className='mt-5 font-mono text-[10px] tracking-wider text-slate-700 uppercase'>
                  Status: <span className='text-slate-600'>EMPTY_SET</span>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className='lg:col-span-4 space-y-4 lg:sticky lg:top-24'>
            {user && (
              <div className='rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-5'>
                <div className='flex items-center gap-3'>
                  <div className='flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-slate-700 bg-[var(--color-slate)] overflow-hidden'>
                    {user.profile_pic_url ? (
                      <img
                        src={user.profile_pic_url}
                        className='h-full w-full object-cover'
                        alt={user.name}
                      />
                    ) : (
                      <span className='font-mono text-sm font-semibold text-emerald-400'>
                        {user.name ? user.name.slice(0, 2).toUpperCase() : "JL"}
                      </span>
                    )}
                  </div>
                  <div className='min-w-0'>
                    <h3 className='truncate text-sm font-medium text-slate-200'>
                      {user.name}
                    </h3>
                    <div className='mt-0.5 flex items-center gap-1 text-slate-500'>
                      <MapPin className='h-3 w-3' />
                      <span className='font-mono text-[11px] tracking-wide'>
                        {user.location || "Remote"}
                      </span>
                    </div>
                  </div>
                </div>

                <p className='mt-3 text-xs leading-relaxed text-slate-500 line-clamp-2'>
                  {user.bio || "No professional bio configured yet."}
                </p>

                <Link
                  href='/dashboard/settings'
                  className='mt-4 flex items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-800/40 py-2 text-xs font-medium text-slate-300 transition-all duration-150 hover:border-slate-600 hover:bg-slate-800 hover:text-slate-100'>
                  <Settings className='h-3.5 w-3.5' />
                  Edit Profile
                </Link>
              </div>
            )}

            {/* Metrics */}
            <div className='rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-5 space-y-3'>
              <div className='flex items-center gap-2'>
                <Radio className='h-3.5 w-3.5 text-emerald-400' />
                <h3 className='font-mono text-[11px] font-medium uppercase tracking-widest text-slate-400'>
                  Workspace Overview
                </h3>
              </div>

              <div className='space-y-2'>
                <div className='flex items-center justify-between rounded-md border border-slate-800 bg-[var(--color-slate)] px-3 py-2'>
                  <span className='text-xs text-slate-500'>Account</span>
                  <span className='font-mono text-[10px] font-medium uppercase tracking-wider text-emerald-400'>
                    Active
                  </span>
                </div>
                <div className='flex items-center justify-between rounded-md border border-slate-800 bg-[var(--color-slate)] px-3 py-2'>
                  <span className='text-xs text-slate-500'>Visibility</span>
                  <span className='font-mono text-[10px] font-medium uppercase tracking-wider text-emerald-400'>
                    Public
                  </span>
                </div>
              </div>
            </div>
          </aside>
        </section>
      </div>
      <Footer />
    </div>
  );
}
