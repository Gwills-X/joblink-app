"use client";

import { useState } from "react";
import { updatePasswordAction } from "@/actions/auth";
import { Lock, Loader2 } from "lucide-react";

export default function SecurityPage({ userId }) {
  const [status, setStatus] = useState({ message: "", type: "" });

  async function handleSubmit(formData) {
    const current = formData.get("currentPassword");
    const newPass = formData.get("newPassword");
    const confirm = formData.get("confirmPassword");

    if (newPass !== confirm) {
      setStatus({ message: "Passwords do not match.", type: "error" });
      return;
    }

    const result = await updatePasswordAction(current, newPass);

    if (result.error) {
      setStatus({ message: result.error, type: "error" });
    } else {
      setStatus({ message: result.success, type: "success" });
    }
  }

  return (
    <form action={handleSubmit} className='space-y-5'>
      <div>
        <span className='block font-mono text-[11px] font-medium uppercase tracking-widest text-slate-500'>
          Authentication
        </span>
        <h2 className='mt-1 text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100'>
          Security & Access
        </h2>
      </div>

      {status.message && (
        <div
          className={`rounded-lg border px-4 py-3 text-xs ${
            status.type === "error"
              ? "border-rose-500/20 bg-rose-500/10 text-rose-400"
              : "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
          }`}>
          {status.message}
        </div>
      )}

      <div className='space-y-3'>
        <div>
          <label className='mb-1.5 block font-mono text-[10px] font-medium uppercase tracking-wider text-slate-600 dark:text-slate-500'>
            Current Password
          </label>
          <div className='relative'>
            <Lock className='absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-600' />
            <input
              name='currentPassword'
              type='password'
              required
              placeholder='Enter current password'
              className='block w-full rounded-lg border border-slate-300 bg-slate-50 py-2.5 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 transition-all duration-150 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-600'
            />
          </div>
        </div>

        <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
          <div>
            <label className='mb-1.5 block font-mono text-[10px] font-medium uppercase tracking-wider text-slate-600 dark:text-slate-500'>
              New Password
            </label>
            <input
              name='newPassword'
              type='password'
              required
              placeholder='New password'
              className='block w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-all duration-150 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-600'
            />
          </div>
          <div>
            <label className='mb-1.5 block font-mono text-[10px] font-medium uppercase tracking-wider text-slate-500'>
              Confirm Password
            </label>
            <input
              name='confirmPassword'
              type='password'
              required
              placeholder='Confirm password'
              className='block w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 transition-all duration-150 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-600'
            />
          </div>
        </div>
      </div>

      <button
        type='submit'
        className='inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-medium text-(--color-slate) transition-all duration-150 hover:bg-emerald-400 active:scale-[0.98]'>
        Update Credentials
      </button>
    </form>
  );
}
