"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardNav() {
  const pathname = usePathname();
  const tabs = [
    { name: "My Posts", href: "/dashboard" },
    { name: "Candidate Hub", href: "/dashboard/seeker/applications" },
    { name: "Employer Hub", href: "/dashboard/employer" },
    { name: "Analytics", href: "/dashboard/analytics" },
    { name: "Network", href: "/dashboard/network" },
    { name: "Settings", href: "/dashboard/settings" },
  ];

  return (
    <nav className='flex flex-row lg:flex-col gap-1.5 p-2 bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl w-full lg:w-64 shadow-xl overflow-x-auto lg:overflow-visible'>
      <div className='hidden lg:block px-4 py-2 text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold'>
        Workspace Menu
      </div>
      {tabs.map((tab) => {
        const isActive =
          pathname === tab.href ||
          (tab.href !== "/dashboard" && pathname.startsWith(tab.href));
        return (
          <Link
            key={tab.name}
            href={tab.href}
            className={`relative flex items-center px-4 py-3 text-xs font-mono font-bold uppercase tracking-wider rounded-xl transition-all duration-300 whitespace-nowrap ${
              isActive
                ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 shadow-sm"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent"
            }`}>
            {tab.name}
            {isActive && (
              <span className='absolute lg:left-0 lg:top-3 lg:bottom-3 lg:w-1 lg:h-auto lg:rounded-r-full bottom-1 left-4 right-4 h-0.5 rounded-full bg-emerald-500 shadow-md shadow-emerald-500/50' />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
