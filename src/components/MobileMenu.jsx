"use client";

import React, { useState } from "react";

export default function MobileMenu({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className='md:hidden flex items-center'>
      {/* Hamburger Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        type='button'
        className='inline-flex items-center justify-center rounded-xl border border-transparent p-2 text-slate-600 transition-all hover:border-slate-200 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:border-slate-800 dark:hover:bg-slate-900/60 dark:hover:text-slate-200'
        aria-controls='mobile-menu'
        aria-expanded={isOpen}>
        <span className='sr-only'>Open main menu</span>
        {isOpen ? (
          <svg
            className='h-5 w-5'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth='2'
            stroke='currentColor'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M6 18L18 6M6 6l12 12'
            />
          </svg>
        ) : (
          <svg
            className='h-5 w-5'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth='2'
            stroke='currentColor'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M4 6h16M4 12h16M4 18h16'
            />
          </svg>
        )}
      </button>

      {/* Slide-out Backdrop and Container */}
      {isOpen && (
        <div
          id='mobile-menu'
          className='absolute left-0 top-16 z-50 flex w-full flex-col space-y-4 border-b border-slate-200 bg-white/95 p-5 shadow-2xl backdrop-blur-lg animate-in fade-in slide-in-from-top-2 duration-150 dark:border-slate-900 dark:bg-slate-950/95'>
          <div className='flex flex-col gap-4' onClick={() => setIsOpen(false)}>
            {children}
          </div>
        </div>
      )}
    </div>
  );
}
