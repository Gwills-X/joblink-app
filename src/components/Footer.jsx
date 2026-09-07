import React from "react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className='mt-auto w-full border-t border-slate-200 bg-white text-slate-600 dark:border-slate-900/80 dark:bg-slate-950 dark:text-slate-400'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14'>
        <div className='grid grid-cols-1 md:grid-cols-12 gap-10'>
          {/* Branding & Mission Section (5 cols) */}
          <div className='md:col-span-5 space-y-3'>
            <div className='flex items-center space-x-2.5'>
              <div className='w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center font-mono font-bold text-slate-950 text-xs shadow-md shadow-emerald-500/20'>
                J
              </div>
              <span className='text-lg font-extrabold tracking-tight text-slate-900 dark:text-white'>
                JobLink
              </span>
            </div>

            <p className='text-xs md:text-sm text-slate-400 max-w-sm leading-relaxed'>
              Connect top talent with world-class opportunities, track career
              milestones, and collaborate seamlessly across the network.
            </p>

            <div className='pt-2 text-xs font-mono text-slate-400'>
              Built by{" "}
              <span className='text-emerald-400 font-semibold tracking-wide'>
                GW-TECK SOLUTIONS
              </span>
            </div>
          </div>

          {/* Workspace Links (3 cols) */}
          <div className='md:col-span-3 space-y-3'>
            <h6 className='font-mono text-xs font-bold uppercase tracking-widest text-slate-900 dark:text-slate-200'>
              Workspace
            </h6>
            <ul className='space-y-2 text-xs font-mono'>
              <li>
                <Link
                  href='/'
                  className='hover:text-emerald-400 transition-colors inline-block py-0.5'>
                  Live Activity Feed
                </Link>
              </li>
              <li>
                <Link
                  href='/dashboard/seeker/applications'
                  className='hover:text-emerald-400 transition-colors inline-block py-0.5'>
                  Applications Manager
                </Link>
              </li>
              <li>
                <Link
                  href='/dashboard/employer'
                  className='hover:text-emerald-400 transition-colors inline-block py-0.5'>
                  Employer Portal
                </Link>
              </li>
              <li>
                <Link
                  href='/dashboard/settings'
                  className='hover:text-emerald-400 transition-colors inline-block py-0.5'>
                  Profile & Settings
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Compliance (4 cols) */}
          <div className='md:col-span-4 space-y-3'>
            <h6 className='font-mono text-xs font-bold uppercase tracking-widest text-slate-900 dark:text-slate-200'>
              Trust & Compliance
            </h6>
            <ul className='space-y-2 text-xs font-mono'>
              <li>
                <Link
                  href='/privacy'
                  className='hover:text-emerald-400 transition-colors inline-block py-0.5'>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href='/terms'
                  className='hover:text-emerald-400 transition-colors inline-block py-0.5'>
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href='/guidelines'
                  className='hover:text-emerald-400 transition-colors inline-block py-0.5'>
                  Community Guidelines
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className='mt-12 pt-8 border-t border-slate-900/60 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-slate-400 gap-4'>
          <p>
            &copy; {new Date().getFullYear()} JobLink Platform. All rights
            reserved.
          </p>
          <div className='flex items-center space-x-2 text-[11px]'>
            <span className='w-2 h-2 rounded-full bg-emerald-500 animate-pulse'></span>
            <span className='text-slate-400'>All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
