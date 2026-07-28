import BackLink from "@/components/BackLink";

export default function BlogPage() {
  return (
    <main className='max-w-3xl mx-auto py-16 px-6 sm:px-8 selection:bg-emerald-500/20 selection:text-emerald-400'>
      <BackLink />

      <div className='mt-8 space-y-8'>
        {/* Header Section */}
        <div>
          <span className='text-emerald-400 font-mono text-xs font-bold tracking-widest uppercase mb-3 block'>
            Insights & Updates
          </span>
          <h1 className='text-4xl sm:text-5xl font-bold text-white tracking-tight'>
            JobLink <span className='text-emerald-400'>Community Blog</span>
          </h1>
          <p className='text-sm text-slate-400 mt-2'>
            Expert perspectives on career advancement, software engineering, and
            modern talent acquisition.
          </p>
        </div>

        {/* Blog Articles List */}
        <div className='space-y-6'>
          <article className='bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-8 shadow-xl space-y-4'>
            <div className='flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-slate-500'>
              <span>July 2026</span>
              <span className='text-emerald-400 font-medium'>
                By GW-TECK SOLUTIONS
              </span>
            </div>

            <h2 className='text-2xl font-bold text-white tracking-tight'>
              Navigating the Modern Tech Career Landscape
            </h2>

            <p className='text-slate-400 text-sm sm:text-base leading-relaxed'>
              Welcome to the official JobLink blog. In today&apos;s fast-paced
              digital economy, bridging the gap between top-tier technical skill
              sets and world-class opportunities requires more than just a
              resume—it demands a professional identity. Stay tuned for career
              advice, platform feature releases, and spotlights on leading
              innovators across the network.
            </p>

            <div className='pt-4 border-t border-slate-800/80 flex items-center justify-between'>
              <span className='inline-flex items-center px-3 py-1 rounded-md text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-widest'>
                Featured Article
              </span>
              <span className='text-xs text-slate-400 font-medium'>
                3 min read
              </span>
            </div>
          </article>
        </div>
      </div>
    </main>
  );
}
