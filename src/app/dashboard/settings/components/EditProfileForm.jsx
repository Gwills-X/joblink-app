"use client";

import { useState, useRef, useEffect } from "react";
import useActionState from "@/lib/hooks/useActionState";
import { updateProfileAction } from "@/actions/userActions";
import { uploadMedia } from "@/services/storageService";
import { Camera, Globe, MapPin, User, Loader2 } from "lucide-react";
import { GitBranchIcon } from "lucide-react";

export default function EditProfileForm({ initialUser }) {
  const [state, formAction, isPending] = useActionState(
    updateProfileAction,
    {},
  );
  const [avatarUrl, setAvatarUrl] = useState(initialUser.profile_pic_url || "");
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (initialUser.profile_pic_url) {
      setAvatarUrl(initialUser.profile_pic_url);
    }
  }, [initialUser.profile_pic_url]);

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const result = await uploadMedia(file);
    if (result?.url) setAvatarUrl(result.url);
  };

  return (
    <form action={formAction} className='mx-auto w-full max-w-lg space-y-5'>
      {/* Avatar */}
      <div className='flex items-center gap-4 rounded-lg border border-slate-800 bg-slate-950 p-4'>
        <div className='flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-700 bg-[var(--color-slate)]'>
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt='Avatar'
              className='h-full w-full object-cover'
            />
          ) : (
            <User className='h-6 w-6 text-slate-600' />
          )}
        </div>
        <div className='flex flex-col gap-2'>
          <button
            type='button'
            onClick={() => fileInputRef.current.click()}
            className='inline-flex items-center gap-2 rounded-md border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 font-mono text-[11px] font-medium uppercase tracking-wider text-emerald-400 transition-all duration-150 hover:bg-emerald-500/20'>
            <Camera className='h-3 w-3' />
            {avatarUrl ? "Change" : "Upload"}
          </button>
          <p className='font-mono text-[10px] tracking-wide text-slate-600'>
            JPG/PNG, max 2MB
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
        <div>
          <label className='mb-1.5 block font-mono text-[10px] font-medium uppercase tracking-wider text-slate-500'>
            Display Name
          </label>
          <input
            name='name'
            defaultValue={initialUser.name}
            placeholder='Your name'
            className='block w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 transition-all duration-150'
          />
        </div>
        <div>
          <label className='mb-1.5 block font-mono text-[10px] font-medium uppercase tracking-wider text-slate-500'>
            Location
          </label>
          <div className='relative'>
            <MapPin className='absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-600' />
            <input
              name='location'
              defaultValue={initialUser.location}
              placeholder='City, Country'
              className='block w-full rounded-lg border border-slate-800 bg-slate-950 py-2.5 pl-9 pr-3 text-sm text-slate-100 placeholder:text-slate-600 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 transition-all duration-150'
            />
          </div>
        </div>
        <div>
          <label className='mb-1.5 block font-mono text-[10px] font-medium uppercase tracking-wider text-slate-500'>
            GitHub
          </label>
          <div className='relative'>
            <GitBranchIcon className='absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-600' />
            <input
              name='github'
              defaultValue={initialUser.github_handle}
              placeholder='username'
              className='block w-full rounded-lg border border-slate-800 bg-slate-950 py-2.5 pl-9 pr-3 text-sm text-slate-100 placeholder:text-slate-600 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 transition-all duration-150'
            />
          </div>
        </div>
        <div>
          <label className='mb-1.5 block font-mono text-[10px] font-medium uppercase tracking-wider text-slate-500'>
            Website
          </label>
          <div className='relative'>
            <Globe className='absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-600' />
            <input
              name='website'
              defaultValue={initialUser.website_url}
              placeholder='https://'
              className='block w-full rounded-lg border border-slate-800 bg-slate-950 py-2.5 pl-9 pr-3 text-sm text-slate-100 placeholder:text-slate-600 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 transition-all duration-150'
            />
          </div>
        </div>
      </div>

      <div>
        <label className='mb-1.5 block font-mono text-[10px] font-medium uppercase tracking-wider text-slate-500'>
          Bio
        </label>
        <textarea
          name='bio'
          defaultValue={initialUser.bio}
          placeholder='Write a short professional bio...'
          rows={4}
          className='block w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 transition-all duration-150'
        />
      </div>

      <div>
        <label className='mb-1.5 block font-mono text-[10px] font-medium uppercase tracking-wider text-slate-500'>
          Confirm Password
        </label>
        <input
          type='password'
          name='currentPassword'
          required
          placeholder='Enter current password to save changes'
          className='block w-full rounded-lg border border-rose-500/20 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:border-rose-500/50 focus:outline-none focus:ring-1 focus:ring-rose-500/20 transition-all duration-150'
        />
      </div>

      <button
        disabled={isPending}
        className='flex w-full items-center justify-center rounded-lg bg-emerald-500 py-2.5 text-sm font-medium text-[var(--color-slate)] transition-all duration-150 hover:bg-emerald-400 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50'>
        {isPending ? (
          <span className='flex items-center gap-2'>
            <Loader2 className='h-4 w-4 animate-spin' />
            Saving...
          </span>
        ) : (
          "Save Updates"
        )}
      </button>

      <input type='hidden' name='profile_pic_url' value={avatarUrl} />
      <input
        type='file'
        ref={fileInputRef}
        className='hidden'
        onChange={handleAvatarChange}
        accept='image/*'
      />
    </form>
  );
}
