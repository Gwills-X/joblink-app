import Link from "next/link";

export default function WorkspaceSwitcher({
  currentRole = "seeker",
  hasSeekerProfile = true,
  hasEmployerProfile = false,
}) {
  const isEmployerActive = currentRole === "employer";

  return (
    <div className='panel p-4 flex flex-col gap-4 font-mono'>
      <div className='flex items-center justify-between text-xs text-slate-400 uppercase tracking-wider border-b border-slate-800/70 pb-3'>
        <span>Active Workspace</span>
        <span className='text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20'>
          {isEmployerActive ? "Employer Mode" : "Candidate Mode"}
        </span>
      </div>

      <div className='grid grid-cols-2 gap-3'>
        {hasSeekerProfile ? (
          <Link
            href='/dashboard/seeker/applications'
            className={`flex flex-col items-start p-3 rounded-3xl border transition-all ${
              !isEmployerActive
                ? "bg-emerald-500/10 border-emerald-500/40 text-white shadow-lg shadow-emerald-500/10"
                : "bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
            }`}>
            <span className='text-xs font-semibold uppercase tracking-[0.2em]'>
              Seeker Hub
            </span>
            <span className='text-[10px] text-slate-500 mt-1'>
              Manage applications
            </span>
          </Link>
        ) : (
          <Link
            href='/dashboard/seeker/profile'
            className='flex flex-col items-start p-3 rounded-xl border border-dashed border-slate-700 bg-slate-950/30 text-slate-400 hover:border-emerald-500/50 hover:text-emerald-400 transition-all'>
            <span className='text-xs font-bold uppercase tracking-wider'>
              + Seeker Profile
            </span>
            <span className='text-[10px] text-slate-500 mt-1'>
              Set up profile
            </span>
          </Link>
        )}

        {hasEmployerProfile ? (
          <Link
            href='/dashboard/employer'
            className={`flex flex-col items-start p-3 rounded-3xl border transition-all ${
              isEmployerActive
                ? "bg-emerald-500/10 border-emerald-500/40 text-white shadow-lg shadow-emerald-500/10"
                : "bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
            }`}>
            <span className='text-xs font-semibold uppercase tracking-[0.2em]'>
              Employer Portal
            </span>
            <span className='text-[10px] text-slate-500 mt-1'>
              Manage jobs & team
            </span>
          </Link>
        ) : (
          <Link
            href='/dashboard/employer/company'
            className='flex flex-col items-start p-3 rounded-xl border border-dashed border-slate-700 bg-slate-950/30 text-slate-400 hover:border-emerald-500/50 hover:text-emerald-400 transition-all'>
            <span className='text-xs font-bold uppercase tracking-wider'>
              + Company Profile
            </span>
            <span className='text-[10px] text-slate-500 mt-1'>
              Set up company
            </span>
          </Link>
        )}
      </div>
    </div>
  );
}
