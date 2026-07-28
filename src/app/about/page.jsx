import BackLink from "@/components/BackLink";

export default function AboutPage() {
  return (
    <main className='max-w-3xl mx-auto py-16 px-6 sm:px-8 selection:bg-emerald-500/20 selection:text-emerald-400'>
      <BackLink />

      <div className='mt-8 space-y-8'>
        {/* Header Section */}
        <div>
          <span className='text-emerald-400 font-mono text-xs font-bold tracking-widest uppercase mb-3 block'>
            Our Mission
          </span>
          <h1 className='text-4xl sm:text-5xl font-bold text-white tracking-tight'>
            About <span className='text-emerald-400'>JobLink</span>
          </h1>
        </div>

        {/* Content Card */}
        <div className='bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-8 sm:p-10 shadow-xl space-y-6 text-slate-400 leading-relaxed text-sm sm:text-base'>
          <p>
            JobLink is a modern professional career platform engineered to
            bridge the gap between top-tier talent and world-class opportunities
            across the tech industry and beyond.
          </p>
          <p>
            Our goal is to provide a secure, structured environment where
            professionals can showcase their skills, discover new roles, and
            accelerate their career growth. Whether you are a full-stack
            developer in Bauchi or a recruiter scaling a global team, your
            presence strengthens our collective talent network.
          </p>

          {/* Footer / Credits */}
          <div className='pt-6 mt-6 border-t border-slate-800/80'>
            <p className='text-xs font-mono text-slate-500 uppercase tracking-wider mb-2'>
              Platform Architecture
            </p>
            <p className='text-slate-300 font-medium'>
              Independently designed, engineered, and managed by{" "}
              <span className='text-emerald-400 font-bold'>
                GW-TECK SOLUTIONS
              </span>
              .
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
