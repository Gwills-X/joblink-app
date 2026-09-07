// src/app/not-found.jsx
import Link from "next/link";
export const dynamic = "force-dynamic";
export default function NotFound() {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-white p-6 text-slate-900 dark:bg-slate-950 dark:text-white'>
      <h2 className='text-6xl font-black text-emerald-500 mb-4'>404</h2>
      <p className='mb-8 text-xl font-mono text-slate-600 dark:text-slate-400'>
        Pulse signal lost. The requested data node does not exist.
      </p>
      <Link
        href='/'
        className='px-6 py-3 bg-emerald-500 text-slate-950 font-bold rounded-lg hover:bg-emerald-400 transition'>
        Return to Home
      </Link>
    </div>
  );
}
