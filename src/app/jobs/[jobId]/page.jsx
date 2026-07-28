// app/jobs/[id]/page.jsx

import Link from "next/link";
import { redirect } from "next/navigation";
import getAuthUser from "@/lib/getAuthUser";
import { submitJobApplicationAction } from "@/actions/seekerActions";
import { seekerEngine } from "@/engines/seekerEngine";

export default async function JobDetailViewPage({ params }) {
  const authUser = await getAuthUser();
  const resolvedParams = await params;
  const jobId = resolvedParams?.id;

  let job = null;
  try {
    // Strictly fetching details through the engine layer — zero direct database queries!
    job = await seekerEngine.getJobListingById(jobId);
    if (!job) return redirect("/jobs");
  } catch (error) {
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
              🏢 {job.company_name} • 📍 {job.location || "Remote"} • Posted{" "}
              {new Date(job.created_at).toLocaleDateString()}
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

      {/* Application / Pitch Submission Form Section */}
      <div className='bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-3xl p-8 shadow-xl space-y-6'>
        <div>
          <h2 className='text-xl font-bold text-white tracking-tight'>
            Submit Your{" "}
            <span className='text-emerald-400'>Application / Pitch</span>
          </h2>
          <p className='text-xs text-slate-400 mt-1 font-mono'>
            Provide a clear technical breakdown or cover letter outlining your
            qualification for this role.
          </p>
        </div>

        {!authUser ? (
          <div className='bg-slate-950 border border-slate-800 rounded-2xl p-8 text-center space-y-4'>
            <p className='text-sm text-slate-300'>
              You must be logged into your account to submit an application or
              collaboration pitch.
            </p>
            <Link
              href='/login'
              className='inline-block bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold px-6 py-2.5 rounded-xl text-xs transition-all shadow-md shadow-emerald-500/10'>
              Sign In to Apply &rarr;
            </Link>
          </div>
        ) : (
          <form action={submitJobApplicationAction} className='space-y-6'>
            <input type='hidden' name='job_id' value={job.id} />

            <div className='space-y-2'>
              <label className='text-xs font-mono text-slate-300 block'>
                Cover Letter / Technical Pitch
              </label>
              <textarea
                name='cover_letter'
                rows='6'
                required
                placeholder='Highlight your relevant stack experience, past projects, or why you want to collaborate...'
                className='w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm text-white focus:outline-none focus:border-emerald-500 font-sans leading-relaxed'></textarea>
            </div>

            <div className='flex justify-end'>
              <button
                type='submit'
                className='bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold px-6 py-3 rounded-2xl text-xs transition-all shadow-lg shadow-emerald-500/10'>
                Submit Application &rarr;
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
