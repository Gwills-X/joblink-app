"use client";

import { register } from "@/actions/auth";
import Link from "next/link";
import { useState } from "react";
import useActionState from "@/lib/hooks/useActionState";

export default function Register() {
  const [state, action, isPending] = useActionState(register, undefined);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className='min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 selection:bg-emerald-500/20 selection:text-emerald-400'>
      {/* Brand Header */}
      <div className='sm:mx-auto sm:w-full sm:max-w-md'>
        <div className='flex justify-center items-center space-x-2'>
          <div className='h-8 w-8 rounded-lg bg-emerald-600 flex items-center justify-center font-bold text-white shadow-sm'>
            J
          </div>
          <span className='text-xl font-bold tracking-tight text-white font-mono'>
            JobLink
          </span>
        </div>
        <h2 className='mt-6 text-center text-2xl font-semibold tracking-tight text-slate-100'>
          Create your account
        </h2>
        <p className='mt-2 text-center text-sm text-slate-400'>
          Already have an account?{" "}
          <Link
            href='/login'
            className='font-medium text-emerald-400 hover:text-emerald-300 transition-colors'>
            Sign in
          </Link>
        </p>
      </div>

      {/* Form Container */}
      <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0'>
        <div className='bg-slate-900/60 backdrop-blur-md py-8 px-6 shadow-2xl rounded-2xl border border-slate-800/80 sm:px-10'>
          <form action={action} className='space-y-4'>
            {/* Global Server Error Alert */}
            {state?.errors?.server && (
              <div className='rounded-xl bg-red-950/40 border border-red-900/50 p-4 text-sm text-red-300'>
                <p className='font-medium'>Registration Error</p>
                <p className='mt-1 text-xs opacity-90'>
                  {Array.isArray(state.errors.server)
                    ? state.errors.server[0]
                    : state.errors.server}
                </p>
              </div>
            )}

            {/* Full Name Field */}
            <div>
              <label
                htmlFor='name'
                className='block text-xs font-medium uppercase tracking-wider text-slate-300 mb-1.5 font-mono'>
                Full Name
              </label>
              <input
                type='text'
                id='name'
                name='name'
                defaultValue={state?.name}
                disabled={isPending}
                required
                className='block w-full rounded-lg bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-slate-100 placeholder-slate-500 shadow-inner focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all'
                placeholder='John Doe'
              />
              {state?.errors?.name && (
                <p className='mt-1.5 text-xs text-red-400 font-medium'>
                  {Array.isArray(state.errors.name)
                    ? state.errors.name[0]
                    : state.errors.name}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor='email'
                className='block text-xs font-medium uppercase tracking-wider text-slate-300 mb-1.5 font-mono'>
                Email Address
              </label>
              <input
                type='email'
                id='email'
                name='email'
                defaultValue={state?.email}
                disabled={isPending}
                required
                className='block w-full rounded-lg bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-slate-100 placeholder-slate-500 shadow-inner focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all'
                placeholder='name@company.com'
              />
              {state?.errors?.email && (
                <p className='mt-1.5 text-xs text-red-400 font-medium'>
                  {Array.isArray(state.errors.email)
                    ? state.errors.email[0]
                    : state.errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor='password'
                className='block text-xs font-medium uppercase tracking-wider text-slate-300 mb-1.5 font-mono'>
                Password
              </label>
              <div className='relative'>
                <input
                  type={showPassword ? "text" : "password"}
                  id='password'
                  name='password'
                  disabled={isPending}
                  required
                  className='block w-full rounded-lg bg-slate-950 border border-slate-800 px-3.5 py-2.5 pr-12 text-slate-100 placeholder-slate-500 shadow-inner focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all'
                  placeholder='••••••••••••'
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-500 hover:text-emerald-400 focus:outline-none'
                  aria-label={showPassword ? "Hide password" : "Show password"}>
                  {showPassword ? (
                    <svg
                      className='h-5 w-5'
                      fill='none'
                      viewBox='0 0 24 24'
                      strokeWidth='1.5'
                      stroke='currentColor'>
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243l4.242 4.242z'
                      />
                    </svg>
                  ) : (
                    <svg
                      className='h-5 w-5'
                      fill='none'
                      viewBox='0 0 24 24'
                      strokeWidth='1.5'
                      stroke='currentColor'>
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z'
                      />
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                      />
                    </svg>
                  )}
                </button>
              </div>
              {state?.errors?.password && (
                <div className='mt-1.5 rounded-lg bg-red-950/20 border border-red-900/30 p-2.5'>
                  <ul className='list-inside list-disc text-xs text-red-400 space-y-1 font-medium'>
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

            {/* Confirm Password Field */}
            <div>
              <label
                htmlFor='confirmPassword'
                className='block text-xs font-medium uppercase tracking-wider text-slate-300 mb-1.5 font-mono'>
                Confirm Password
              </label>
              <div className='relative'>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id='confirmPassword'
                  name='confirmPassword'
                  disabled={isPending}
                  required
                  className='block w-full rounded-lg bg-slate-950 border border-slate-800 px-3.5 py-2.5 pr-12 text-slate-100 placeholder-slate-500 shadow-inner focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all'
                  placeholder='••••••••••••'
                />
                <button
                  type='button'
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className='absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-500 hover:text-emerald-400 focus:outline-none'
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }>
                  {showConfirmPassword ? (
                    <svg
                      className='h-5 w-5'
                      fill='none'
                      viewBox='0 0 24 24'
                      strokeWidth='1.5'
                      stroke='currentColor'>
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243l4.242 4.242z'
                      />
                    </svg>
                  ) : (
                    <svg
                      className='h-5 w-5'
                      fill='none'
                      viewBox='0 0 24 24'
                      strokeWidth='1.5'
                      stroke='currentColor'>
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z'
                      />
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                      />
                    </svg>
                  )}
                </button>
              </div>
              {state?.errors?.confirmPassword && (
                <p className='mt-1.5 text-xs text-red-400 font-medium'>
                  {Array.isArray(state.errors.confirmPassword)
                    ? state.errors.confirmPassword[0]
                    : state.errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Submit Action */}
            <div className='pt-3'>
              <button
                type='submit'
                disabled={isPending}
                className='w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-slate-950 bg-emerald-500 hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer'>
                {isPending ? (
                  <span className='flex items-center space-x-2'>
                    <svg
                      className='animate-spin -ml-1 mr-2 h-4 w-4 text-slate-950'
                      fill='none'
                      viewBox='0 0 24 24'>
                      <circle
                        className='opacity-25'
                        cx='12'
                        cy='12'
                        r='10'
                        stroke='currentColor'
                        strokeWidth='4'></circle>
                      <path
                        className='opacity-75'
                        fill='currentColor'
                        d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                    </svg>
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
