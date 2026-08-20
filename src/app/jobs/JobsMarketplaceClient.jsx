"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export default function JobsMarketplaceClient({ listings = [] }) {
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [searchKeyword, setSearchKeyword] = useState("");

  // ---------------------------------------------------------
  // PREPARE LISTINGS
  // ---------------------------------------------------------

  const preparedListings = useMemo(() => {
    return listings
      .map((item) => {
        const maxApplicants = Number(item.max_applicants || 0);
        const applicantCount = Number(item.applicant_count || 0);

        return {
          ...item,
          max_applicants: maxApplicants,
          applicant_count: applicantCount,
          remaining_slots: Math.max(maxApplicants - applicantCount, 0),
        };
      })
      .filter((item) => {
        // Public marketplace ONLY shows listings
        // that still have available slots.
        return item.remaining_slots > 0;
      });
  }, [listings]);

  // ---------------------------------------------------------
  // FILTER + SEARCH
  // ---------------------------------------------------------

  const filteredListings = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();

    return preparedListings.filter((item) => {
      // Category filter
      if (typeFilter !== "ALL" && item.listing_type !== typeFilter) {
        return false;
      }

      // Search filter
      if (keyword) {
        const searchableText = [
          item.title,
          item.description,
          item.company_name,
          item.location,
          item.listing_type,
          item.employment_type,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        if (!searchableText.includes(keyword)) {
          return false;
        }
      }

      return true;
    });
  }, [preparedListings, typeFilter, searchKeyword]);

  // ---------------------------------------------------------
  // FILTER BUTTON
  // ---------------------------------------------------------

  const filterButtonClass = (type) => {
    const active = typeFilter === type;

    if (!active) {
      return "rounded-xl px-4 py-2 text-xs font-semibold text-slate-400 transition-all hover:text-white";
    }

    if (type === "COLLABORATION") {
      return "rounded-xl bg-purple-500 px-4 py-2 text-xs font-semibold text-white shadow-md";
    }

    if (type === "PROJECT") {
      return "rounded-xl bg-blue-500 px-4 py-2 text-xs font-semibold text-white shadow-md";
    }

    if (type === "PARTNERSHIP") {
      return "rounded-xl bg-orange-500 px-4 py-2 text-xs font-semibold text-white shadow-md";
    }

    return "rounded-xl bg-emerald-500 px-4 py-2 text-xs font-semibold text-slate-950 shadow-md";
  };

  return (
    <div className='mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8'>
      {/* ------------------------------------------------- */}
      {/* HEADER */}
      {/* ------------------------------------------------- */}

      <div className='mb-8 space-y-3'>
        <p className='font-mono text-xs font-semibold uppercase tracking-widest text-emerald-400'>
          JOBLINK NETWORK
        </p>

        <h1 className='text-3xl font-bold tracking-tight text-white'>
          Jobs & Opportunities
        </h1>

        <p className='max-w-2xl text-sm leading-relaxed text-slate-400'>
          Discover cutting-edge engineering opportunities, full-stack
          development gigs, projects, collaborations, and innovation
          partnerships.
        </p>
      </div>

      {/* ------------------------------------------------- */}
      {/* SEARCH */}
      {/* ------------------------------------------------- */}

      <div className='mb-5'>
        <div className='flex flex-col gap-3 sm:flex-row'>
          <div className='relative flex-1'>
            <input
              type='search'
              value={searchKeyword}
              onChange={(event) => setSearchKeyword(event.target.value)}
              placeholder='Search jobs, projects, collaborations, companies...'
              className='w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-600 outline-none transition-all focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20'
            />
          </div>

          {searchKeyword && (
            <button
              type='button'
              onClick={() => setSearchKeyword("")}
              className='rounded-xl border border-slate-800 px-5 py-3 text-center text-sm font-medium text-slate-400 transition hover:border-slate-700 hover:text-white'>
              Clear
            </button>
          )}
        </div>
      </div>

      {/* ------------------------------------------------- */}
      {/* FILTER BUTTONS */}
      {/* ------------------------------------------------- */}

      <div className='mb-8 overflow-x-auto'>
        <div className='flex w-max items-center gap-2 rounded-2xl border border-slate-800 bg-slate-900 p-1.5'>
          <button
            type='button'
            onClick={() => setTypeFilter("ALL")}
            className={filterButtonClass("ALL")}>
            All Feed
          </button>

          <button
            type='button'
            onClick={() => setTypeFilter("JOB")}
            className={filterButtonClass("JOB")}>
            Jobs Only
          </button>

          <button
            type='button'
            onClick={() => setTypeFilter("COLLABORATION")}
            className={filterButtonClass("COLLABORATION")}>
            Collaborations
          </button>

          <button
            type='button'
            onClick={() => setTypeFilter("PROJECT")}
            className={filterButtonClass("PROJECT")}>
            Projects
          </button>

          <button
            type='button'
            onClick={() => setTypeFilter("PARTNERSHIP")}
            className={filterButtonClass("PARTNERSHIP")}>
            Partnerships
          </button>
        </div>
      </div>

      {/* ------------------------------------------------- */}
      {/* RESULTS COUNT */}
      {/* ------------------------------------------------- */}

      <div className='mb-5 flex items-center justify-between gap-4'>
        <p className='font-mono text-xs text-slate-500'>
          {filteredListings.length}{" "}
          {filteredListings.length === 1 ? "opportunity" : "opportunities"}{" "}
          available
        </p>

        {searchKeyword && (
          <p className='text-xs text-slate-500'>
            Search:
            <span className='ml-1 font-medium text-slate-300'>
              "{searchKeyword}"
            </span>
          </p>
        )}
      </div>

      {/* ------------------------------------------------- */}
      {/* LISTINGS */}
      {/* ------------------------------------------------- */}

      <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
        {filteredListings.length === 0 ? (
          <div className='col-span-full rounded-2xl border border-slate-800 bg-slate-900/60 p-16 text-center'>
            <p className='text-sm text-slate-400'>
              No available opportunities match your current search or filter.
            </p>

            <button
              type='button'
              onClick={() => {
                setTypeFilter("ALL");
                setSearchKeyword("");
              }}
              className='mt-3 text-xs font-medium text-emerald-400 hover:underline'>
              Clear filters →
            </button>
          </div>
        ) : (
          filteredListings.map((item) => (
            <div
              key={item.id}
              className='flex flex-col justify-between gap-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur-md transition-all hover:border-slate-700 hover:shadow-2xl'>
              <div className='space-y-4'>
                {/* META */}

                <div className='flex items-center justify-between'>
                  <div className='flex flex-wrap items-center gap-2'>
                    <span className='rounded-md border border-slate-800 bg-slate-950 px-2.5 py-1 font-mono text-xs uppercase text-slate-300'>
                      {item.employment_type}
                    </span>

                    <span
                      className={`rounded-md border px-2.5 py-1 font-mono text-xs ${
                        item.listing_type === "COLLABORATION"
                          ? "border-purple-500/20 bg-purple-500/10 text-purple-400"
                          : item.listing_type === "PARTNERSHIP"
                            ? "border-orange-500/20 bg-orange-500/10 text-orange-400"
                            : item.listing_type === "PROJECT"
                              ? "border-blue-500/20 bg-blue-500/10 text-blue-400"
                              : "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                      }`}>
                      {item.listing_type}
                    </span>
                  </div>

                  <span className='font-mono text-xs text-slate-500'>
                    {new Date(item.created_at).toLocaleDateString()}
                  </span>
                </div>

                {/* TITLE + COMPANY */}

                <div>
                  <h2 className='text-xl font-bold tracking-tight text-white transition-colors hover:text-emerald-400'>
                    {item.title}
                  </h2>

                  <p className='mt-1 font-mono text-xs text-slate-400'>
                    🏢 {item.company_name || "Independent listing"} • 📍{" "}
                    {item.location || "Remote"}
                  </p>
                </div>

                {/* DESCRIPTION */}

                <p className='line-clamp-3 text-sm leading-relaxed text-slate-400'>
                  {item.description}
                </p>
              </div>

              {/* FOOTER */}

              <div className='space-y-4 border-t border-slate-800/80 pt-4'>
                <div className='flex items-center justify-between gap-4'>
                  <span className='font-mono text-xs font-semibold text-emerald-400'>
                    {item.salary
                      ? `💰 ${item.salary}`
                      : "💼 Competitive / Equity"}
                  </span>

                  <span className='rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 font-mono text-xs font-semibold text-emerald-400'>
                    {item.remaining_slots}{" "}
                    {item.remaining_slots === 1 ? "slot" : "slots"} remaining
                  </span>
                </div>

                <Link
                  href={`/jobs/${item.id}`}
                  className='block rounded-xl bg-emerald-500 px-4 py-2.5 text-center text-xs font-semibold text-slate-950 shadow-md shadow-emerald-500/10 transition-all hover:bg-emerald-400'>
                  View & Apply →
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
