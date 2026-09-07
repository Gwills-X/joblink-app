"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import OpportunityCard from "@/components/OpportunityCard";

const arrangementOptions = [
  ["", "All arrangements"],
  ["REMOTE", "Remote"],
  ["ON_SITE", "On-site"],
  ["HYBRID", "Hybrid"],
];

const categoryOptions = [
  ["", "All categories"],
  ["FULL_TIME", "Full-Time"],
  ["CONTRACT", "Contract"],
  ["PROJECT", "Project"],
  ["PART_TIME", "Part-Time"],
  ["PARTNERSHIP", "Partnership"],
  ["COLLABORATION", "Collaboration"],
];

const locationOptions = [
  ["", "All locations"],
  ["BAUCHI", "Bauchi"],
  ["ABUJA", "Abuja"],
  ["INTERNATIONAL", "International / Worldwide"],
];

function matchesArrangement(item, arrangement) {
  if (!arrangement) return true;
  const text =
    `${item.employment_type || ""} ${item.location || ""}`.toUpperCase();
  if (arrangement === "REMOTE") return text.includes("REMOTE");
  if (arrangement === "HYBRID") return text.includes("HYBRID");
  return !text.includes("REMOTE") && !text.includes("HYBRID");
}

function FilterSelect({ label, value, options, onChange }) {
  return (
    <label className='flex min-w-0 flex-1 flex-col gap-1.5'>
      <span className='font-mono text-[10px] font-semibold uppercase tracking-widest text-slate-500'>
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className='w-full appearance-none rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-xs font-medium text-slate-900 outline-none transition-colors hover:border-slate-400 focus:border-emerald-500/60 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:hover:border-slate-600'>
        {options.map(([optionValue, optionLabel]) => (
          <option key={optionValue || "all"} value={optionValue}>
            {optionLabel}
          </option>
        ))}
      </select>
    </label>
  );
}

export default function JobsMarketplaceClient({
  listings = [],
  currentUserId,
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchKeyword = searchParams.get("q") || "";
  const arrangement = searchParams.get("arrangement") || "";
  const category = searchParams.get("category") || "";
  const location = searchParams.get("location") || "";

  const updateFilters = (updates) => {
    const nextParams = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value) nextParams.set(key, value);
      else nextParams.delete(key);
    });
    router.replace(nextParams.toString() ? `/jobs?${nextParams}` : "/jobs");
  };

  const resetFilters = () => router.replace("/jobs");

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
      if (
        category &&
        item.listing_type !== category &&
        item.employment_type !== category
      ) {
        return false;
      }

      if (!matchesArrangement(item, arrangement)) return false;

      if (location) {
        const itemLocation = String(item.location || "").toUpperCase();
        if (location === "INTERNATIONAL") {
          if (itemLocation.includes("BAUCHI") || itemLocation.includes("ABUJA"))
            return false;
        } else if (!itemLocation.includes(location)) {
          return false;
        }
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
  }, [preparedListings, category, arrangement, location, searchKeyword]);

  return (
    <div className='mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8'>
      {/* ------------------------------------------------- */}
      {/* HEADER */}
      {/* ------------------------------------------------- */}

      <div className='mb-8 space-y-3'>
        <p className='font-mono text-xs font-semibold uppercase tracking-widest text-emerald-400'>
          JOBLINK NETWORK
        </p>

        <h1 className='text-3xl font-bold tracking-tight text-slate-900 dark:text-white'>
          Jobs & Opportunities
        </h1>

        <p className='max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-400'>
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
              onChange={(event) => updateFilters({ q: event.target.value })}
              placeholder='Search jobs, projects, collaborations, companies...'
              className='w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-600'
            />
          </div>
        </div>
      </div>

      <div className='mb-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-md shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-black/10'>
        <div className='grid gap-3 md:grid-cols-3'>
          <FilterSelect
            label='Work arrangement'
            value={arrangement}
            options={arrangementOptions}
            onChange={(value) => updateFilters({ arrangement: value })}
          />
          <FilterSelect
            label='Job category / type'
            value={category}
            options={categoryOptions}
            onChange={(value) => updateFilters({ category: value })}
          />
          <FilterSelect
            label='Location'
            value={location}
            options={locationOptions}
            onChange={(value) => updateFilters({ location: value })}
          />
        </div>
        {(searchKeyword || arrangement || category || location) && (
          <div className='mt-4 flex justify-end border-t border-slate-800 pt-3'>
            <button
              type='button'
              onClick={resetFilters}
              className='text-xs font-semibold text-emerald-400 transition-colors hover:text-emerald-300'>
              Reset Filters
            </button>
          </div>
        )}
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
          <div className='col-span-full rounded-2xl border border-slate-200 bg-white p-16 text-center dark:border-slate-800 dark:bg-slate-900/60'>
            <p className='text-sm text-slate-600 dark:text-slate-400'>
              No available opportunities match your current search or filter.
            </p>

            <button
              type='button'
              onClick={resetFilters}
              className='mt-3 text-xs font-medium text-emerald-400 hover:underline'>
              Clear filters →
            </button>
          </div>
        ) : (
          filteredListings.map((item) => (
            <OpportunityCard
              key={item.id}
              opportunity={item}
              currentUserId={currentUserId}
            />
          ))
        )}
      </div>
    </div>
  );
}
