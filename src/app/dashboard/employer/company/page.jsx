import getAuthUser from "@/lib/getAuthUser";
import { redirect } from "next/navigation";
import Link from "next/link";
import { saveCompanyProfileAction } from "@/actions/companyActions";
import { employerEngine } from "@/services/employerEngine";

export const dynamic = "force-dynamic";

export default async function EmployerCompanyProfilePage() {
  const authUser = await getAuthUser();
  if (!authUser) redirect("/login");

  const ownerId = String(authUser.userId || authUser.id);
  const companyProfile = await employerEngine.getCompanyProfile(ownerId);

  return (
    <div className='mx-auto max-w-3xl py-8 px-4'>
      <div className='flex flex-col gap-4 border-b border-slate-800 pb-5 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <span className='block font-mono text-[11px] font-medium uppercase tracking-widest text-slate-500'>
            Employer Onboarding
          </span>
          <h1 className='mt-1 text-xl font-semibold tracking-tight text-slate-100'>
            {companyProfile ? "Edit Company Profile" : "Create Company Profile"}
          </h1>
          <p className='mt-1 text-xs text-slate-500'>
            Add your company details so you can post jobs and be visible to
            candidates.
          </p>
        </div>

        <Link
          href='/dashboard/employer'
          className='inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-transparent px-4 py-2 text-xs font-medium text-slate-300 transition-all duration-150 hover:border-slate-600 hover:bg-slate-800/50 hover:text-slate-100'>
          Back to Employer Dashboard
        </Link>
      </div>

      <div className='rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-8'>
        <form action={saveCompanyProfileAction} className='space-y-6'>
          <div>
            <label className='mb-1.5 block font-mono text-[11px] font-medium uppercase tracking-wider text-slate-400'>
              Company Name <span className='text-rose-400'>*</span>
            </label>
            <input
              name='name'
              defaultValue={companyProfile?.name || ""}
              required
              placeholder='Acme Talent Labs'
              className='block w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 transition-all duration-150'
            />
          </div>

          <div>
            <label className='mb-1.5 block font-mono text-[11px] font-medium uppercase tracking-wider text-slate-400'>
              Tagline
            </label>
            <input
              name='tagline'
              defaultValue={companyProfile?.tagline || ""}
              placeholder='Hiring the next generation of product builders'
              className='block w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 transition-all duration-150'
            />
          </div>

          <div>
            <label className='mb-1.5 block font-mono text-[11px] font-medium uppercase tracking-wider text-slate-400'>
              Description
            </label>
            <textarea
              name='description'
              defaultValue={companyProfile?.description || ""}
              rows={5}
              placeholder='Describe your company, your mission, and the type of talent you want to hire.'
              className='block w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 transition-all duration-150'
            />
          </div>

          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
            <div>
              <label className='mb-1.5 block font-mono text-[11px] font-medium uppercase tracking-wider text-slate-400'>
                Website URL
              </label>
              <input
                type='url'
                name='website_url'
                defaultValue={companyProfile?.website_url || ""}
                placeholder='https://example.com'
                className='block w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 transition-all duration-150'
              />
            </div>

            <div>
              <label className='mb-1.5 block font-mono text-[11px] font-medium uppercase tracking-wider text-slate-400'>
                Logo URL
              </label>
              <input
                type='url'
                name='logo_url'
                defaultValue={companyProfile?.logo_url || ""}
                placeholder='https://example.com/logo.png'
                className='block w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 transition-all duration-150'
              />
            </div>
          </div>

          <div className='flex items-center justify-end gap-3 border-t border-slate-800 pt-5'>
            <Link
              href='/dashboard/employer'
              className='rounded-lg px-4 py-2 text-xs font-medium text-slate-400 transition-colors duration-150 hover:text-slate-200'>
              Cancel
            </Link>
            <button
              type='submit'
              className='rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-medium text-[var(--color-slate)] transition-all duration-150 hover:bg-emerald-400 active:scale-[0.98]'>
              Save Company Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
