import getAuthUser from "@/lib/getAuthUser";
import { redirect } from "next/navigation";
import Link from "next/link";
import { updateSeekerProfileProfile } from "@/actions/seekerActions";
import { ArrowLeft, Save } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SeekerProfileSetupPage() {
  const authUser = await getAuthUser();
  if (!authUser) redirect("/login");

  return (
    <div className='mx-auto max-w-3xl space-y-6 py-8 px-4'>
      <div className='flex flex-col gap-4 border-b border-slate-800 pb-5 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <span className='block font-mono text-[11px] font-medium uppercase tracking-widest text-slate-500'>
            Candidate Onboarding
          </span>
          <h1 className='mt-1 text-xl font-semibold tracking-tight text-slate-100'>
            Professional Profile
          </h1>
          <p className='mt-1 max-w-md text-xs leading-relaxed text-slate-500'>
            Configure your headline and technical focus for job matching. Basic
            info syncs from{" "}
            <Link
              href='/dashboard/settings'
              className='text-emerald-400 transition-colors duration-150 hover:text-emerald-300'>
              Account Settings
            </Link>
            .
          </p>
        </div>

        <Link
          href='/dashboard/seeker/applications'
          className='inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-transparent px-3 py-2 text-xs font-medium text-slate-400 transition-all duration-150 hover:border-slate-600 hover:bg-slate-800/50 hover:text-slate-200'>
          <ArrowLeft className='h-3.5 w-3.5' />
          Back
        </Link>
      </div>

      <div className='rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-8'>
        <form action={updateSeekerProfileProfile} className='space-y-5'>
          <div>
            <label
              htmlFor='headline'
              className='mb-1.5 block font-mono text-[11px] font-medium uppercase tracking-wider text-slate-400'>
              Professional Headline
            </label>
            <input
              type='text'
              id='headline'
              name='headline'
              defaultValue={authUser.headline || ""}
              required
              placeholder='e.g. Senior Full-Stack Developer | React & Laravel'
              className='block w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 transition-all duration-150'
            />
          </div>

          <div>
            <label
              htmlFor='interest_field'
              className='mb-1.5 block font-mono text-[11px] font-medium uppercase tracking-wider text-slate-400'>
              Core Technical Focus
            </label>
            <input
              type='text'
              id='interest_field'
              name='interest_field'
              defaultValue={authUser.interest_field || "Full-Stack Development"}
              required
              placeholder='e.g. Cloud Computing, Frontend, DevOps'
              className='block w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 transition-all duration-150'
            />
          </div>

          <div className='flex items-center justify-end gap-3 border-t border-slate-800 pt-5'>
            <Link
              href='/dashboard/seeker/applications'
              className='rounded-lg px-4 py-2 text-xs font-medium text-slate-500 transition-colors duration-150 hover:text-slate-300'>
              Cancel
            </Link>
            <button
              type='submit'
              className='inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-medium text-[var(--color-slate)] transition-all duration-150 hover:bg-emerald-400 active:scale-[0.98]'>
              <Save className='h-3.5 w-3.5' />
              Save Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
