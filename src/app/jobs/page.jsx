import Link from "next/link";
import { seekerEngine } from "@/engines/seekerEngine";

export default async function PublicJobsMarketplacePage({ searchParams }) {
  const params = await searchParams;
  const typeFilter = params?.type || "ALL";
  const searchKeyword = params?.q || "";

  // Strictly fetching via the engine layer — no direct database queries here!
  let listings = [];
  try {
    listings = await seekerEngine.getMarketplaceListings(
      typeFilter,
      searchKeyword,
    );
  } catch (error) {
    console.error("Marketplace Engine Error:", error);
  }

  return (
    <div className='max-w-6xl mx-auto py-12 px-6 space-y-10'>
      {/* Marketplace Header */}
      <div className='flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-800 pb-8'>
        <div>
          <span className='text-emerald-400 font-mono text-xs font-bold tracking-widest uppercase mb-2 block'>
            GW-TECK SOLUTIONS NETWORK
          </span>
          <h1 className='text-4xl font-extrabold text-white tracking-tight'>
            Jobs & <span className='text-emerald-400'>Collaborations</span>
          </h1>
          <p className='text-sm text-slate-400 mt-2 max-w-xl'>
            Discover cutting-edge engineering opportunities, full-stack
            development gigs, and innovation partnerships.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className='flex items-center gap-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800'>
          <Link
            href='/jobs?type=ALL'
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              typeFilter === "ALL"
                ? "bg-emerald-500 text-slate-950 shadow-md"
                : "text-slate-400 hover:text-white"
            }`}>
            All Feed
          </Link>
          <Link
            href='/jobs?type=JOB'
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              typeFilter === "JOB"
                ? "bg-emerald-500 text-slate-950 shadow-md"
                : "text-slate-400 hover:text-white"
            }`}>
            Jobs Only
          </Link>
          <Link
            href='/jobs?type=COLLABORATION'
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              typeFilter === "COLLABORATION"
                ? "bg-emerald-500 text-slate-950 shadow-md"
                : "text-slate-400 hover:text-white"
            }`}>
            Collaborations
          </Link>
        </div>
      </div>

      {/* Listings Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {listings.length === 0 ? (
          <div className='col-span-full bg-slate-900/60 border border-slate-800 rounded-2xl p-16 text-center space-y-3'>
            <p className='text-slate-400 text-sm'>
              No open positions or collaborations match your current filter.
            </p>
            <Link
              href='/jobs'
              className='inline-block text-emerald-400 font-medium text-xs hover:underline'>
              Clear filters &rarr;
            </Link>
          </div>
        ) : (
          listings.map((item) => (
            <div
              key={item.id}
              className='bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between gap-6 transition-all hover:border-slate-700 hover:shadow-2xl'>
              <div className='space-y-4'>
                {/* Meta Tags */}
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2 flex-wrap'>
                    <span className='text-xs font-mono bg-slate-950 text-slate-300 border border-slate-800 px-2.5 py-1 rounded-md uppercase'>
                      {item.employment_type}
                    </span>
                    <span
                      className={`text-xs font-mono px-2.5 py-1 rounded-md border ${
                        item.listing_type === "COLLABORATION"
                          ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                          : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      }`}>
                      {item.listing_type}
                    </span>
                  </div>
                  <span className='text-xs font-mono text-slate-500'>
                    {new Date(item.created_at).toLocaleDateString()}
                  </span>
                </div>

                {/* Title & Company */}
                <div>
                  <h2 className='text-xl font-bold text-white tracking-tight hover:text-emerald-400 transition-colors'>
                    {item.title}
                  </h2>
                  <p className='text-xs font-mono text-slate-400 mt-1'>
                    🏢 {item.company_name} • 📍 {item.location || "Remote"}
                  </p>
                </div>

                {/* Description Snippet */}
                <p className='text-sm text-slate-400 line-clamp-3 leading-relaxed'>
                  {item.description}
                </p>
              </div>

              {/* Card Footer */}
              <div className='flex items-center justify-between pt-4 border-t border-slate-800/80'>
                <span className='text-xs font-mono text-emerald-400 font-semibold'>
                  {item.salary
                    ? `💰 ${item.salary}`
                    : "💼 Competitive / Equity"}
                </span>

                <Link
                  href={`/jobs/${item.id}`}
                  className='bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold px-4 py-2 rounded-xl text-xs transition-all shadow-md shadow-emerald-500/10'>
                  View & Apply &rarr;
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
