import BackLink from "@/components/BackLink";

export default function ContactPage() {
  return (
    <main className='max-w-3xl mx-auto py-16 px-6 sm:px-8 selection:bg-emerald-500/20 selection:text-emerald-400'>
      <BackLink />

      <div className='mt-8 space-y-8'>
        {/* Header Section */}
        <div>
          <span className='text-emerald-400 font-mono text-xs font-bold tracking-widest uppercase mb-3 block'>
            Get in Touch
          </span>
          <h1 className='text-4xl sm:text-5xl font-bold text-white tracking-tight'>
            Contact <span className='text-emerald-400'>Support</span>
          </h1>
          <p className='text-sm text-slate-400 mt-2'>
            Have questions, feedback, or need technical assistance with your
            account? We are here to help.
          </p>
        </div>

        {/* Content Card */}
        <div className='bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-8 sm:p-10 shadow-xl space-y-6 text-slate-400 leading-relaxed text-sm sm:text-base'>
          <p>
            You can reach our engineering and support team directly via email.
            We strive to review and respond to all platform inquiries promptly.
          </p>

          <div className='p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 inline-flex items-center gap-3'>
            <span className='text-xs font-mono text-slate-500 uppercase'>
              Direct Email:
            </span>
            <a
              href='mailto:support@joblink.vercel.app'
              className='text-emerald-400 font-bold hover:text-emerald-300 font-mono text-sm transition-colors'>
              support@joblink.vercel.app
            </a>
          </div>

          <div className='pt-6 border-t border-slate-800/80 space-y-2'>
            <p className='text-xs font-mono text-slate-500 uppercase tracking-wider'>
              Operations Center
            </p>
            <p className='text-slate-300 font-medium text-xs sm:text-sm'>
              Based in Bauchi, Nigeria • Maintained by{" "}
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
