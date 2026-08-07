import BackLink from "@/components/BackLink";
import { Target, Cpu, Globe } from "lucide-react";

export default function AboutPage() {
  return (
    <main className='mx-auto max-w-3xl py-12 px-4'>
      <BackLink />

      <div className='mt-6 space-y-8'>
        <div>
          <span className='block font-mono text-[11px] font-medium uppercase tracking-widest text-slate-500'>
            Our Mission
          </span>
          <h1 className='mt-2 text-3xl font-semibold tracking-tight text-slate-100'>
            About <span className='text-emerald-400'>JobLink</span>
          </h1>
        </div>

        <div className='space-y-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-8 text-sm leading-relaxed text-slate-400'>
          <p>
            JobLink is a professional career platform engineered to bridge the
            gap between top-tier technical talent and world-class opportunities
            across the global tech industry.
          </p>
          <p>
            Our goal is to provide a secure, structured environment where
            professionals can showcase their skills, discover new roles, and
            accelerate their career growth. Whether you are a full-stack
            developer in Bauchi or a recruiter scaling a global team, your
            presence strengthens our collective talent network.
          </p>

          <div className='grid gap-3 pt-4 sm:grid-cols-3'>
            {[
              { icon: Target, label: "Purpose-Driven" },
              { icon: Cpu, label: "Tech-First" },
              { icon: Globe, label: "Global Reach" },
            ].map((item) => (
              <div
                key={item.label}
                className='flex items-center gap-2.5 rounded-lg border border-slate-800 bg-slate-950 px-3 py-2.5'>
                <item.icon className='h-3.5 w-3.5 text-emerald-400' />
                <span className='font-mono text-[11px] font-medium uppercase tracking-wider text-slate-400'>
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          <div className='border-t border-slate-800 pt-5'>
            <span className='block font-mono text-[10px] font-medium uppercase tracking-wider text-slate-600'>
              Platform Architecture
            </span>
            <p className='mt-2 text-sm text-slate-300'>
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
