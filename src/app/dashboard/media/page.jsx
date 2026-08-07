"use client";

import { Image, Upload, FileImage } from "lucide-react";

export default function MediaVaultPage() {
  const assets = [
    { id: 1, name: "hero_background.jpg", size: "2.4MB" },
    { id: 2, name: "network_schema_01.png", size: "840KB" },
    { id: 3, name: "vibe_icon_set.svg", size: "12KB" },
  ];

  return (
    <div className='mx-auto max-w-6xl space-y-6 py-8 px-4'>
      <div>
        <span className='block font-mono text-[11px] font-medium uppercase tracking-widest text-slate-500'>
          Asset Management
        </span>
        <h1 className='mt-2 text-xl font-semibold tracking-tight text-slate-100'>
          Media <span className='text-emerald-400'>Vault</span>
        </h1>
        <p className='mt-1 text-xs text-slate-500'>
          Centralized asset management and binary storage.
        </p>
      </div>

      {/* Upload Zone */}
      <div className='flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-800 bg-[var(--color-surface)] py-10 px-6 transition-all duration-150 hover:border-slate-700'>
        <div className='flex h-10 w-10 items-center justify-center rounded-lg border border-slate-800 bg-slate-950'>
          <Upload className='h-4 w-4 text-slate-600' />
        </div>
        <button className='mt-4 text-sm font-medium text-emerald-400 transition-colors duration-150 hover:text-emerald-300'>
          Upload New Asset
        </button>
        <p className='mt-1 font-mono text-[10px] tracking-wide text-slate-600'>
          Supported: JPG, PNG, SVG, WEBP
        </p>
      </div>

      {/* Assets Grid */}
      <div className='grid grid-cols-2 gap-3 md:grid-cols-4'>
        {assets.map((asset) => (
          <div
            key={asset.id}
            className='group rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4 transition-all duration-150 hover:border-slate-700'>
            <div className='flex aspect-square items-center justify-center rounded-md border border-slate-800 bg-slate-950'>
              <FileImage className='h-6 w-6 text-slate-700 transition-colors duration-150 group-hover:text-emerald-400/40' />
            </div>
            <h3 className='mt-3 truncate text-xs font-medium text-slate-300'>
              {asset.name}
            </h3>
            <p className='mt-1 font-mono text-[10px] tracking-wide text-slate-600'>
              {asset.size}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
