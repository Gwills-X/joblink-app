import getAuthUser from "@/lib/getAuthUser";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { employerEngine } from "@/services/employerEngine";
import CompanyProfileForm from "../../CompanyProfileForm";

export const dynamic = "force-dynamic";

export default async function EditCompanyPage({ params }) {
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
    <div className='mx-auto max-w-3xl px-4 py-8'>
      <div className='mb-6 border-b border-slate-800 pb-5'>
        <Link
          href={`/dashboard/employer/company/${id}`}
          className='mb-3 inline-flex items-center gap-2 text-xs text-slate-500 hover:text-slate-300'>
          <ArrowLeft className='h-3.5 w-3.5' />
          Back to Company
        </Link>

        <span className='block font-mono text-[11px] uppercase tracking-widest text-slate-500'>
          Employer
        </span>

        <h1 className='mt-1 text-xl font-semibold text-slate-100'>
          Edit Company Profile
        </h1>

        <p className='mt-1 text-xs text-slate-500'>
          Update the information for {company.name}.
        </p>
      </div>

      <CompanyProfileForm companyProfile={company} />
    </div>
  );
}
