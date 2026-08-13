import getAuthUser from "@/lib/getAuthUser";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import CompanyProfileForm from "../CompanyProfileForm";

export const dynamic = "force-dynamic";

export default async function NewCompanyPage() {
  const authUser = await getAuthUser();

  if (!authUser) {
    redirect("/login");
  }

  return (
    <div className='mx-auto max-w-3xl px-4 py-8'>
      <div className='mb-6 flex flex-col gap-4 border-b border-slate-800 pb-5 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <Link
            href='/dashboard/employer/company'
            className='mb-3 inline-flex items-center gap-2 text-xs text-slate-500 hover:text-slate-300'>
            <ArrowLeft className='h-3.5 w-3.5' />
            My Companies
          </Link>

          <span className='block font-mono text-[11px] uppercase tracking-widest text-slate-500'>
            Employer
          </span>

          <h1 className='mt-1 text-xl font-semibold text-slate-100'>
            Create Company Profile
          </h1>

          <p className='mt-1 text-xs text-slate-500'>
            Add your company information to create your employer profile.
          </p>
        </div>
      </div>

      <CompanyProfileForm />
    </div>
  );
}
