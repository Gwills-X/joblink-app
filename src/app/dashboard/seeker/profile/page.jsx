import getAuthUser from "@/lib/getAuthUser";
import { redirect } from "next/navigation";
import Link from "next/link";

import { updateSeekerProfileProfile } from "@/actions/seekerActions";

export const dynamic = "force-dynamic";

export default async function SeekerProfileSetupPage() {
  const authUser = await getAuthUser();
  if (!authUser) redirect("/login");

  return (
    <div className='max-w-4xl mx-auto py-12 px-6 space-y-8'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-6'>
        <div>
          <span className='text-emerald-400 font-mono text-xs font-bold tracking-widest uppercase mb-1 block'>
            Candidate Onboarding
          </span>
          <h1 className='text-3xl font-bold text-white tracking-tight'>
            Professional Marketplace Profile
          </h1>
          <p className='text-sm text-slate-400 mt-1'>
            Configure your professional headline and core technical focus for
            job matching. Your basic account info (Name, Bio, Location) is
            synced from your{" "}
            <Link
              href='/dashboard/settings'
              className='text-emerald-400 underline'>
              Account Settings
            </Link>
            .
          </p>
        </div>

        <Link
          href='/dashboard/seeker/applications'
          className='bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-xl text-xs font-mono transition-all border border-slate-700 text-center'>
          &larr; Back to Applications
        </Link>
      </div>

      {/* Form Container */}
      <div className='bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl'>
        <form action={updateSeekerProfileProfile} className='space-y-6'>
          {/* Professional Headline */}
          <div className='space-y-2'>
            <label className='text-xs font-mono uppercase tracking-wider text-slate-300 font-bold block'>
              Professional Headline
            </label>
            <input
              type='text'
              name='headline'
              defaultValue={authUser.headline || ""}
              required
              placeholder='e.g. Senior Full-Stack Web Developer | React & Laravel Specialist'
              className='w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-mono transition-all'
            />
          </div>

          {/* Core Technical Interest Field */}
          <div className='space-y-2'>
            <label className='text-xs font-mono uppercase tracking-wider text-slate-300 font-bold block'>
              Core Technical Focus / Stack
            </label>
            <input
              type='text'
              name='interest_field'
              defaultValue={authUser.interest_field || "Full-Stack Development"}
              required
              placeholder='e.g. Full-Stack Development, Cloud Computing, Frontend'
              className='w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-mono transition-all'
            />
          </div>

          {/* Form Action Controls */}
          <div className='pt-4 flex items-center justify-end gap-4 border-t border-slate-800'>
            <Link
              href='/dashboard/seeker/applications'
              className='px-6 py-3 rounded-xl text-xs font-mono uppercase tracking-wider text-slate-400 hover:text-white transition-all'>
              Cancel
            </Link>
            <button
              type='submit'
              className='bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider px-8 py-3 rounded-xl transition-all shadow-lg shadow-emerald-500/20'>
              Save Marketplace Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
