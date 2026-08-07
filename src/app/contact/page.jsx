import BackLink from "@/components/BackLink";
import { Mail, MapPin, ArrowRight } from "lucide-react";

export default function ContactPage() {
  return (
    <main className='mx-auto max-w-3xl py-12 px-4'>
      <BackLink />

      <div className='mt-6 space-y-8'>
        <div>
          <span className='block font-mono text-[11px] font-medium uppercase tracking-widest text-slate-500'>
            Get in Touch
          </span>
          <h1 className='mt-2 text-3xl font-semibold tracking-tight text-slate-100'>
            Contact <span className='text-emerald-400'>Support</span>
          </h1>
          <p className='mt-2 text-xs text-slate-500'>
            Have questions, feedback, or need technical assistance with your
            account? We are here to help.
          </p>
        </div>

        <div className='space-y-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-8 text-sm leading-relaxed text-slate-400'>
          <p>
            You can reach our engineering and support team directly via email.
            We strive to review and respond to all platform inquiries promptly.
          </p>

          <div className='inline-flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-950 px-4 py-3'>
            <Mail className='h-4 w-4 text-slate-600' />
            <span className='font-mono text-[11px] uppercase tracking-wider text-slate-500'>
              Email:
            </span>
            <a
              href='mailto:support@joblink.vercel.app'
              className='font-mono text-sm font-medium text-emerald-400 transition-colors duration-150 hover:text-emerald-300'>
              support@joblink.vercel.app
            </a>
          </div>

          <div className='border-t border-slate-800 pt-5'>
            <span className='block font-mono text-[10px] font-medium uppercase tracking-wider text-slate-600'>
              Operations Center
            </span>
            <div className='mt-2 flex items-center gap-2 text-xs text-slate-500'>
              <MapPin className='h-3.5 w-3.5 text-slate-600' />
              <span>Bauchi, Nigeria</span>
              <span className='text-slate-700'>·</span>
              <span>
                Maintained by{" "}
                <span className='font-semibold text-emerald-400'>
                  GW-TECK SOLUTIONS
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
