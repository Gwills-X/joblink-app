import Link from "next/link";
import { redirect } from "next/navigation";
import getAuthUser from "@/lib/getAuthUser";
import { seekerEngine } from "@/services/seekerEngine";
import JobApplicationForm from "./JobApplicationForm";

export default async function JobDetailViewPage({ params }) {
  const authUser = await getAuthUser();

  // Await params as required in Next.js App Router
  // const resolvedParams = await params;
  // const jobId = resolvedParams?.jobId;
  const { jobId } = await params;

  let job = null;
  try {
    job = await seekerEngine.getJobListingById(jobId);
    if (!job) {
      redirect("/jobs");
    }
  } catch (error) {
    if (error.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }
    console.error("Job Detail Engine Fetch Error:", error);
    return redirect("/jobs");
  }

  return (
    <div className='max-w-4xl mx-auto py-12 px-6 space-y-10'>
      {/* Back Navigation */}
      <div>
        <Link
          href='/jobs'
          className='text-xs font-mono text-emerald-400 hover:underline inline-flex items-center gap-1.5'>
          &larr; Back to Marketplace Feed
        </Link>
      </div>

      {/* Job Header Card */}
      <div className='bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-3xl p-8 shadow-xl space-y-6'>
        <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
          <div className='space-y-2'>
            <div className='flex items-center gap-2 flex-wrap'>
              <span className='text-xs font-mono bg-slate-950 text-slate-300 border border-slate-800 px-3 py-1 rounded-md uppercase'>
                {job.employment_type}
              </span>
              <span
                className={`text-xs font-mono px-3 py-1 rounded-md border ${
                  job.listing_type === "COLLABORATION"
                    ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                    : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                }`}>
                {job.listing_type}
              </span>
            </div>
            <h1 className='text-3xl font-extrabold text-white tracking-tight'>
              {job.title}
            </h1>
            <p className='text-sm font-mono text-slate-400'>
              🏢 {job.company_name || "Independent listing"} • 📍{" "}
              {job.location || "Remote"} • Posted{" "}
              {job.created_at
                ? new Date(job.created_at).toLocaleDateString()
                : "Recently"}
            </p>
          </div>

          <div className='text-left md:text-right'>
            <span className='text-xs font-mono text-slate-400 block uppercase'>
              Compensation
            </span>
            <span className='text-base font-mono text-emerald-400 font-bold mt-0.5 block'>
              {job.salary ? job.salary : "Competitive / Equity"}
            </span>
          </div>
        </div>

        <div className='border-t border-slate-800 pt-6 space-y-4'>
          <h2 className='text-xs font-mono text-slate-400 uppercase tracking-widest'>
            Listing Description & Scope
          </h2>
          <div className='text-sm text-slate-300 leading-relaxed whitespace-pre-line bg-slate-950/50 p-6 rounded-2xl border border-slate-800/80'>
            {job.description}
          </div>
        </div>
      </div>

      {/* Application Form Client Component */}
      <JobApplicationForm job={job} authUser={authUser} />
    </div>
  );
}
