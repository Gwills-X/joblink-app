import BackLink from "@/components/BackLink";
import { Target, Users, Globe } from "lucide-react";

export default function AboutPage() {
  return (
    <main className='mx-auto max-w-3xl py-12 px-4'>
      <BackLink />

      <div className='mt-6 space-y-8'>
        <div>
          <span className='block font-mono text-[11px] font-medium uppercase tracking-widest text-slate-500'>
            Our Mission
          </span>
          <h1 className='mt-2 text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100'>
            About <span className='text-emerald-400'>JobLink</span>
          </h1>
        </div>

        <div className='space-y-5 rounded-xl border border-slate-200 bg-white p-6 text-sm leading-relaxed text-slate-700 shadow-sm sm:p-8 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:shadow-none'>
          <p>
            JobLink is a professional community that helps people discover
            meaningful opportunities, share their experience, and build trusted
            relationships with organizations and peers across many fields.
          </p>
          <p>
            Our goal is to provide a secure, structured environment where
            professionals can present their work, find roles or collaborations,
            and grow at their own pace. Whether you are building a business,
            changing careers, seeking a first opportunity, or looking for the
            right person to join your team, your contribution strengthens the
            JobLink community.
          </p>

          <div className='grid gap-3 pt-4 sm:grid-cols-3'>
            {[
              { icon: Target, label: "Purpose-Driven" },
              { icon: Users, label: "People-Centered" },
              { icon: Globe, label: "Global Reach" },
            ].map((item) => (
              <div
                key={item.label}
                className='flex items-center gap-2.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 dark:border-slate-800 dark:bg-slate-950'>
                <item.icon className='h-3.5 w-3.5 text-emerald-400' />
                <span className='font-mono text-[11px] font-medium uppercase tracking-wider text-slate-600 dark:text-slate-400'>
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          <div className='border-t border-slate-200 pt-5 dark:border-slate-800'>
            <span className='block font-mono text-[10px] font-medium uppercase tracking-wider text-slate-600'>
              Platform Architecture
            </span>
            <p className='mt-2 text-sm text-slate-700 dark:text-slate-300'>
              Independently designed, engineered, and managed by{" "}
              <span className='font-semibold text-emerald-400'>
                GW-TECK SOLUTIONS
              </span>
              .
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
