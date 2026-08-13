import getAuthUser from "@/lib/getAuthUser";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus, ArrowLeft } from "lucide-react";

import { employerEngine } from "@/services/employerEngine";
import CompanyCard from "../components/CompanyCard";

export const dynamic = "force-dynamic";

export default async function EmployerCompaniesPage() {
  const authUser = await getAuthUser();

  if (!authUser) {
    redirect("/login");
  }

  const ownerId = String(authUser.userId || authUser.id);

  let companies = [];

  try {
    companies = await employerEngine.getCompanies(ownerId);
  } catch (error) {
    console.error("Companies Fetch Error:", error);
  }

  return (
    <div className='mx-auto max-w-6xl px-4 py-8'>
      <div className='mb-6 flex flex-col gap-4 border-b border-slate-800 pb-5 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <Link
            href='/dashboard/employer'
            className='mb-3 inline-flex items-center gap-2 text-xs text-slate-500 hover:text-slate-300'>
            <ArrowLeft className='h-3.5 w-3.5' />
            Employer Dashboard
          </Link>

          <h1 className='text-xl font-semibold text-slate-100'>
            My <span className='text-emerald-400'>Companies</span>
          </h1>

          <p className='mt-1 text-xs text-slate-500'>
            Manage all companies connected to your employer account.
          </p>
        </div>

        <Link
          href='/dashboard/employer/company/new'
          className='inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-2.5 text-xs font-medium text-slate-950 hover:bg-emerald-400'>
          <Plus className='h-3.5 w-3.5' />
          Add Company
        </Link>
      </div>

      {companies.length === 0 ? (
        <div className='rounded-xl border border-dashed border-slate-800 px-6 py-16 text-center'>
          <h2 className='text-sm font-medium text-slate-300'>
            No companies yet
          </h2>

          <p className='mt-1 text-xs text-slate-500'>
            Create your first company profile.
          </p>

          <Link
            href='/dashboard/employer/company/new'
            className='mt-5 inline-flex rounded-lg bg-emerald-500 px-4 py-2 text-xs font-medium text-slate-950 hover:bg-emerald-400'>
            Create Company
          </Link>
        </div>
      ) : (
        <div className='grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3'>
          {companies.map((company) => (
            <CompanyCard key={company.id} company={company} />
          ))}
        </div>
      )}
    </div>
  );
}
