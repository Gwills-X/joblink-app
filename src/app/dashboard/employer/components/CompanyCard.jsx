import Link from "next/link";
import { Building2, MapPin, ArrowRight } from "lucide-react";

export default function CompanyCard({ company }) {
  return (
    <div className='group rounded-xl border border-slate-800 bg-slate-900/40 p-5 transition-all hover:border-slate-700'>
      <div className='flex items-start justify-between gap-4'>
        <div className='flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl border border-slate-800 bg-slate-950'>
          {company.logo_url ? (
            <img
              src={company.logo_url}
              alt={`${company.name} logo`}
              className='h-full w-full object-cover'
            />
          ) : (
            <Building2 className='h-5 w-5 text-slate-600' />
          )}
        </div>
      </div>

      <h3 className='mt-4 text-sm font-semibold text-slate-200'>
        {company.name}
      </h3>

      {company.tagline && (
        <p className='mt-1 line-clamp-2 text-xs text-slate-500'>
          {company.tagline}
        </p>
      )}

      <div className='mt-4 space-y-2'>
        {company.industry && (
          <p className='text-xs text-slate-500'>{company.industry}</p>
        )}

        {company.location && (
          <div className='flex items-center gap-1.5 text-xs text-slate-500'>
            <MapPin className='h-3.5 w-3.5' />
            {company.location}
          </div>
        )}
      </div>

      <Link
        href={`/dashboard/employer/company/${company.id}`}
        className='mt-5 inline-flex items-center gap-2 text-xs font-medium text-emerald-400 hover:text-emerald-300'>
        View Company
        <ArrowRight className='h-3.5 w-3.5' />
      </Link>
    </div>
  );
}
