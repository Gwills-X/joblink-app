import BackLink from "@/components/BackLink";
import { BookOpen, Clock, ArrowRight } from "lucide-react";

export default function BlogPage() {
  return (
    <main className='mx-auto max-w-3xl py-12 px-4'>
      <BackLink />

      <div className='mt-6 space-y-8'>
        <div>
          <span className='block font-mono text-[11px] font-medium uppercase tracking-widest text-slate-500'>
            Insights & Updates
          </span>
          <h1 className='mt-2 text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100'>
            JobLink <span className='text-emerald-400'>Community Blog</span>
          </h1>
          <p className='mt-2 text-xs text-slate-500'>
            Expert perspectives on career advancement, software engineering, and
            modern talent acquisition.
          </p>
        </div>

        <div className='space-y-4'>
          <article className='group rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-150 hover:border-emerald-300 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none dark:hover:border-slate-700'>
            <div className='flex flex-wrap items-center justify-between gap-2'>
              <div className='flex items-center gap-2 text-xs text-slate-500'>
                <BookOpen className='h-3 w-3' />
                <span className='font-mono text-[11px] tracking-wide'>
                  July 2026
                </span>
              </div>
              <span className='font-mono text-[11px] font-medium text-emerald-400'>
                By GW-TECK SOLUTIONS
              </span>
            </div>

            <h2 className='mt-4 text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-200'>
              Navigating the Modern Tech Career Landscape
            </h2>

            <p className='mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-500'>
              Welcome to the official JobLink blog. In today&apos;s fast-paced
              digital economy, bridging the gap between top-tier technical skill
              sets and world-class opportunities requires more than just a
              resume — it demands a professional identity. Stay tuned for career
              advice, platform feature releases, and spotlights on leading
              innovators across the network.
            </p>

            <div className='mt-5 flex items-center justify-between border-t border-slate-200 pt-4 dark:border-slate-800'>
              <span className='inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider text-emerald-400'>
                Featured
              </span>
              <span className='flex items-center gap-1 text-xs text-slate-500'>
                <Clock className='h-3 w-3' />3 min read
              </span>
            </div>
          </article>
        </div>
      </div>
    </main>
  );
}
