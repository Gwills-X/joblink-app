import Link from "next/link";
import { Building2, ArrowRight, Plus } from "lucide-react";
import CompanyCard from "./CompanyCard";

export default function EmployerCompanySection({ companies }) {
  return (
    <section className='space-y-4'>
      <div className='flex items-center justify-between border-b border-slate-800 pb-3'>
        <div>
          <span className='font-mono text-[11px] font-medium uppercase tracking-widest text-slate-500'>
            My Companies
          </span>

          <p className='mt-1 text-xs text-slate-600'>
            Manage the companies connected to your employer account.
          </p>
        </div>

        <div className='flex items-center gap-2'>
          <Link
            href='/dashboard/employer/company'
            className='inline-flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800'>
            View All
            <ArrowRight className='h-3.5 w-3.5' />
          </Link>

          <Link
            href='/dashboard/employer/company/new'
            className='inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-3 py-2 text-xs font-medium text-slate-950 hover:bg-emerald-400'>
            <Plus className='h-3.5 w-3.5' />
            Add Company
          </Link>
        </div>
      </div>

      {companies.length === 0 ? (
        <div className='rounded-xl border border-dashed border-slate-800 p-8 text-center'>
          <Building2 className='mx-auto h-8 w-8 text-slate-700' />

          <h3 className='mt-3 text-sm font-medium text-slate-300'>
            No companies yet
          </h3>

          <p className='mt-1 text-xs text-slate-500'>
            Create your first company profile to start building your employer
            presence.
          </p>

          <Link
            href='/dashboard/employer/company/new'
            className='mt-4 inline-flex rounded-lg bg-emerald-500 px-4 py-2 text-xs font-medium text-slate-950'>
            Create Company
          </Link>
        </div>
      ) : (
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
          {companies.slice(0, 3).map((company) => (
            <CompanyCard key={company.id} company={company} />
          ))}
        </div>
      )}
    </section>
  );
}
