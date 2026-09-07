import getAuthUser from "@/lib/getAuthUser";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Edit,
  Globe,
  MapPin,
  Building2,
  Trash2,
} from "lucide-react";

import { employerEngine } from "@/services/employerEngine";
import { deleteCompanyAction } from "@/actions/companyActions";

export const dynamic = "force-dynamic";

export default async function CompanyDetailsPage({ params }) {
  const authUser = await getAuthUser();

  if (!authUser) {
    redirect("/login");
  }

  const { id } = await params;

  const ownerId = String(authUser.userId || authUser.id);

  const company = await employerEngine.getCompanyById(id, ownerId);

  if (!company) {
    notFound();
  }

  return (
    <div className='mx-auto max-w-5xl px-4 py-8'>
      <div className='mb-6 flex items-center justify-between border-b border-slate-200 pb-5 dark:border-slate-800'>
        <Link
          href='/dashboard/employer/company'
          className='inline-flex items-center gap-2 text-xs text-slate-600 hover:text-slate-900 dark:text-slate-500 dark:hover:text-slate-300'>
          <ArrowLeft className='h-3.5 w-3.5' />
          My Companies
        </Link>

        <div className='flex items-center gap-2'>
          <Link
            href={`/dashboard/employer/company/${company.id}/edit`}
            className='inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800'>
            <Edit className='h-3.5 w-3.5' />
            Edit
          </Link>

          <form action={deleteCompanyAction.bind(null, company.id)}>
            <button
              type='submit'
              className='inline-flex items-center gap-2 rounded-lg border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/20'>
              <Trash2 className='h-3.5 w-3.5' />
              Delete
            </button>
          </form>
        </div>
      </div>

      <div className='overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/40 dark:shadow-none'>
        <div className='p-8'>
          <div className='flex flex-col gap-6 sm:flex-row sm:items-start'>
            <div className='flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950'>
              {company.logo_url ? (
                <img
                  src={company.logo_url}
                  alt={`${company.name} logo`}
                  className='h-full w-full object-cover'
                />
              ) : (
                <Building2 className='h-10 w-10 text-slate-700' />
              )}
            </div>

            <div>
              <h1 className='text-2xl font-semibold text-slate-900 dark:text-slate-100'>
                {company.name}
              </h1>

              {company.tagline && (
                <p className='mt-2 text-sm text-emerald-400'>
                  {company.tagline}
                </p>
              )}

              <div className='mt-4 flex flex-wrap gap-4 text-xs text-slate-500'>
                {company.industry && (
                  <span className='flex items-center gap-1.5'>
                    <Building2 className='h-3.5 w-3.5' />
                    {company.industry}
                  </span>
                )}

                {company.location && (
                  <span className='flex items-center gap-1.5'>
                    <MapPin className='h-3.5 w-3.5' />
                    {company.location}
                  </span>
                )}

                {company.website && (
                  <a
                    href={company.website}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300'>
                    <Globe className='h-3.5 w-3.5' />
                    Website
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className='mt-8 border-t border-slate-200 pt-8 dark:border-slate-800'>
            <h2 className='text-sm font-semibold text-slate-200'>
              About the Company
            </h2>

            <p className='mt-3 whitespace-pre-line text-sm leading-7 text-slate-400'>
              {company.description ||
                "No company description has been added yet."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
