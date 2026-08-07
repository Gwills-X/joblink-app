import getAuthUser from "@/lib/getAuthUser";
import { redirect } from "next/navigation";
import Link from "next/link";
import CreateJobForm from "../../components/CreateJobForm";
import { employerEngine } from "@/services/employerEngine";

export const dynamic = "force-dynamic";

export default async function EmployerNewJobPage() {
  const authUser = await getAuthUser();
  if (!authUser) redirect("/login");

  const userId = String(authUser.userId || authUser.id);
  let companies = [];

  try {
    const companyProfile = await employerEngine.getCompanyProfile(userId);
    if (companyProfile) {
      companies = [{ id: companyProfile.id, name: companyProfile.name }];
    }
  } catch (error) {
    console.error("Employer New Job Company Fetch Error:", error);
  }

  return (
    <div className='mx-auto max-w-4xl py-8 px-4'>
      <div className='flex flex-col gap-4 border-b border-slate-800 pb-5 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <span className='block font-mono text-[11px] font-medium uppercase tracking-widest text-slate-500'>
            Employer Job Builder
          </span>
          <h1 className='mt-1 text-xl font-semibold tracking-tight text-slate-100'>
            Post an Independent Job or Collaboration
          </h1>
          <p className='mt-1 text-xs text-slate-500'>
            Publish a role or project listing now, with or without a company
            profile.
          </p>
        </div>

        <Link
          href='/dashboard/employer'
          className='inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-transparent px-4 py-2 text-xs font-medium text-slate-300 transition-all duration-150 hover:border-slate-600 hover:bg-slate-800/50 hover:text-slate-100'>
          Back to Dashboard
        </Link>
      </div>

      <CreateJobForm companies={companies} />
    </div>
  );
}
