import getAuthUser from "@/lib/getAuthUser";
import { redirect } from "next/navigation";
import Link from "next/link";
import { updateSeekerProfileProfile } from "@/actions/seekerActions";
import { ArrowLeft, Save, UserRound } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SeekerProfileSetupPage() {
  const authUser = await getAuthUser();
  if (!authUser) redirect("/login");

  return (
    <div className='mx-auto max-w-3xl space-y-5 px-4 py-7'>
      <div className='flex flex-col gap-4 border-b border-slate-800 pb-5 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <span className='block font-mono text-[10px] font-medium uppercase tracking-widest text-slate-500'>
            Candidate Onboarding
          </span>
          <h1 className='mt-1 text-xl font-semibold tracking-tight text-slate-100'>
            Professional Profile
          </h1>
          <p className='mt-1 max-w-lg text-xs leading-relaxed text-slate-500'>
            Keep your professional headline and technical focus updated for
            better job matching. Basic account information comes from{" "}
            <Link
              href='/dashboard/settings'
              className='text-emerald-400 hover:text-emerald-300'>
              Account Settings
            </Link>
            .
          </p>
        </div>

        <Link
          href='/dashboard/seeker/applications'
          className='inline-flex items-center gap-1.5 self-start rounded-lg border border-slate-700 px-3 py-2 text-xs font-medium text-slate-400 transition hover:border-slate-600 hover:bg-slate-800/50 hover:text-slate-200 sm:self-auto'>
          <ArrowLeft className='h-3.5 w-3.5' />
          Applications
        </Link>
      </div>

      <div className='rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-6'>
        <div className='mb-5 flex items-center gap-3'>
          <div className='flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-950'>
            <UserRound className='h-4 w-4 text-emerald-400' />
          </div>
          <div>
            <h2 className='text-sm font-semibold text-slate-200'>
              Professional Information
            </h2>
            <p className='text-[11px] text-slate-500'>
              These details appear in your candidate profile.
            </p>
          </div>
        </div>

        <form action={updateSeekerProfileProfile} className='space-y-4'>
          <div>
            <label
              htmlFor='headline'
              className='mb-1.5 block font-mono text-[10px] font-medium uppercase tracking-wider text-slate-400'>
              Professional Headline
            </label>
            <input
              id='headline'
              name='headline'
              type='text'
              defaultValue={authUser.headline || ""}
              required
              maxLength={150}
              placeholder='e.g. Full-Stack Developer | React & Laravel'
              className='w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20'
            />
          </div>

          <div>
            <label
              htmlFor='interest_field'
              className='mb-1.5 block font-mono text-[10px] font-medium uppercase tracking-wider text-slate-400'>
              Core Technical Focus
            </label>
            <input
              id='interest_field'
              name='interest_field'
              type='text'
              defaultValue={authUser.interest_field || "Full-Stack Development"}
              required
              maxLength={150}
              placeholder='e.g. Cloud Computing, Frontend, DevOps'
              className='w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20'
            />
          </div>

          <div className='flex items-center justify-end gap-2 border-t border-slate-800 pt-4'>
            <Link
              href='/dashboard/seeker/applications'
              className='rounded-lg px-4 py-2 text-xs font-medium text-slate-500 transition hover:text-slate-300'>
              Cancel
            </Link>
            <button
              type='submit'
              className='inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2.5 text-xs font-semibold text-slate-950 transition hover:bg-emerald-400 active:scale-[0.98]'>
              <Save className='h-3.5 w-3.5' />
              Save Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
