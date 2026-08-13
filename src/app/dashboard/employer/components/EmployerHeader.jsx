import Link from "next/link";
import { Building2, ArrowRight } from "lucide-react";

export default function EmployerHeader({ companyProfile }) {
  return (
    <div className='flex flex-col gap-4 border-b border-slate-800 pb-5 sm:flex-row sm:items-center sm:justify-between'>
      <div>
        <span className='block font-mono text-[11px] font-medium uppercase tracking-widest text-slate-500'>
          Employer Hub
        </span>

        <h1 className='mt-1 text-xl font-semibold tracking-tight text-slate-100'>
          Employer <span className='text-emerald-400'>Dashboard</span>
        </h1>

        <p className='mt-1 text-xs text-slate-500'>
          Manage your companies, job listings, and applications from one place.
        </p>
      </div>

      <div className='flex flex-wrap items-center gap-2'>
        <Link
          href='/dashboard/employer/company'
          className='inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-transparent px-4 py-2 text-xs font-medium text-slate-300 transition-all duration-150 hover:border-slate-600 hover:bg-slate-800/50 hover:text-slate-100'>
          <Building2 className='h-3.5 w-3.5' />
          {companyProfile ? "Manage Company" : "Create Company"}
        </Link>

        <Link
          href='/dashboard/employer/job/new'
          className='inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-xs font-medium text-slate-950 transition-all duration-150 hover:bg-emerald-400 active:scale-[0.98]'>
          <ArrowRight className='h-3.5 w-3.5' />
          Post Listing
        </Link>
      </div>
    </div>
  );
}
