"use client";

import { register } from "@/actions/auth";
import Link from "next/link";
import { useState } from "react";
import useActionState from "@/lib/hooks/useActionState";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function Register() {
  const [state, action, isPending] = useActionState(register, undefined);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className='flex min-h-screen flex-col justify-center bg-[var(--color-ink)] py-12 sm:px-6 lg:px-8'>
      <div className='sm:mx-auto sm:w-full sm:max-w-md'>
        <div className='flex items-center justify-center gap-2.5'>
          <div className='flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/10 font-mono text-sm font-bold text-emerald-400'>
            J
          </div>
          <span className='font-mono text-lg font-semibold tracking-tight text-slate-100'>
            JobLink
          </span>
        </div>

        <h2 className='mt-6 text-center text-xl font-semibold tracking-tight text-slate-100'>
          Create your account
        </h2>
        <p className='mt-2 text-center text-sm text-slate-500'>
          Already have an account?{" "}
          <Link
            href='/login'
            className='font-medium text-emerald-400 transition-colors duration-150 hover:text-emerald-300'>
            Sign in
          </Link>
        </p>
      </div>

      <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0'>
        <div className='rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-8 sm:px-10'>
          <form action={action} className='space-y-5'>
            {state?.errors?.server && (
              <div className='rounded-lg border border-rose-500/20 bg-rose-500/10 p-3'>
                <p className='text-xs font-medium text-rose-400'>
                  Registration Error
                </p>
                <p className='mt-1 text-xs text-rose-400/80'>
                  {Array.isArray(state.errors.server)
                    ? state.errors.server[0]
                    : state.errors.server}
                </p>
              </div>
            )}

            <div>
              <label
                htmlFor='name'
                className='mb-1.5 block font-mono text-[11px] font-medium uppercase tracking-wider text-slate-400'>
                Full Name
              </label>
              <input
                type='text'
                id='name'
                name='name'
                defaultValue={state?.name}
                disabled={isPending}
                required
                className='block w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-150'
                placeholder='John Doe'
              />
              {state?.errors?.name && (
                <p className='mt-1.5 text-xs font-medium text-rose-400'>
                  {Array.isArray(state.errors.name)
                    ? state.errors.name[0]
                    : state.errors.name}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor='email'
                className='mb-1.5 block font-mono text-[11px] font-medium uppercase tracking-wider text-slate-400'>
                Email Address
              </label>
              <input
                type='email'
                id='email'
                name='email'
                defaultValue={state?.email}
                disabled={isPending}
                required
                className='block w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-150'
                placeholder='name@company.com'
              />
              {state?.errors?.email && (
                <p className='mt-1.5 text-xs font-medium text-rose-400'>
                  {Array.isArray(state.errors.email)
                    ? state.errors.email[0]
                    : state.errors.email}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor='password'
                className='mb-1.5 block font-mono text-[11px] font-medium uppercase tracking-wider text-slate-400'>
                Password
              </label>
              <div className='relative'>
                <input
                  type={showPassword ? "text" : "password"}
                  id='password'
                  name='password'
                  disabled={isPending}
                  required
                  className='block w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2.5 pr-10 text-sm text-slate-100 placeholder:text-slate-600 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-150'
                  placeholder='••••••••••••'
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute inset-y-0 right-0 flex items-center px-3 text-slate-500 transition-colors duration-150 hover:text-emerald-400 focus:text-emerald-400 focus:outline-none'
                  aria-label={showPassword ? "Hide password" : "Show password"}>
                  {showPassword ? (
                    <EyeOff className='h-4 w-4' />
                  ) : (
                    <Eye className='h-4 w-4' />
                  )}
                </button>
              </div>
              {state?.errors?.password && (
                <div className='mt-1.5 rounded-lg border border-rose-500/20 bg-rose-500/10 p-2.5'>
                  <ul className='list-inside list-disc space-y-1 text-xs font-medium text-rose-400'>
                    {Array.isArray(state.errors.password) ? (
                      state.errors.password.map((err, index) => (
                        <li key={index}>{err}</li>
                      ))
                    ) : (
                      <li>{state.errors.password}</li>
                    )}
                  </ul>
                </div>
              )}
            </div>

            <div>
              <label
                htmlFor='confirmPassword'
                className='mb-1.5 block font-mono text-[11px] font-medium uppercase tracking-wider text-slate-400'>
                Confirm Password
              </label>
              <div className='relative'>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id='confirmPassword'
                  name='confirmPassword'
                  disabled={isPending}
                  required
                  className='block w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2.5 pr-10 text-sm text-slate-100 placeholder:text-slate-600 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-150'
                  placeholder='••••••••••••'
                />
                <button
                  type='button'
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className='absolute inset-y-0 right-0 flex items-center px-3 text-slate-500 transition-colors duration-150 hover:text-emerald-400 focus:text-emerald-400 focus:outline-none'
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }>
                  {showConfirmPassword ? (
                    <EyeOff className='h-4 w-4' />
                  ) : (
                    <Eye className='h-4 w-4' />
                  )}
                </button>
              </div>
              {state?.errors?.confirmPassword && (
                <p className='mt-1.5 text-xs font-medium text-rose-400'>
                  {Array.isArray(state.errors.confirmPassword)
                    ? state.errors.confirmPassword[0]
                    : state.errors.confirmPassword}
                </p>
              )}
            </div>

            <div className='pt-1'>
              <button
                type='submit'
                disabled={isPending}
                className='flex w-full items-center justify-center rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-medium text-[var(--color-slate)] transition-all duration-150 hover:bg-emerald-400 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50'>
                {isPending ? (
                  <span className='flex items-center gap-2'>
                    <Loader2 className='h-4 w-4 animate-spin' />
                    Creating Account...
                  </span>
                ) : (
                  "Create Account"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
