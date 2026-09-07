import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function BackLink() {
  return (
    <Link
      href='/'
      className='mb-8 inline-flex items-center gap-2 text-sm text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'>
      <ArrowLeft size={16} /> Back to Dashboard
    </Link>
  );
}
