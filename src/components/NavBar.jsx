import Link from "next/link";
import { BriefcaseBusiness, Compass, FileText, Plus } from "lucide-react";
import { logout } from "@/actions/auth";
import getAuthUser from "@/lib/getAuthUser";
import MobileMenu from "./MobileMenu";
import NavLinks from "./NavLinks";
import UserMenu from "./UserMenu";
import ThemeToggle from "./ThemeToggle";

const discoveryLinks = [
  { href: "/", label: "Explore", icon: Compass },
  { href: "/jobs", label: "Jobs", icon: BriefcaseBusiness },
  { href: "/docs", label: "Resources", icon: FileText },
];

function DiscoveryLinks({ mobile = false }) {
  return (
    <div
      className={
        mobile ? "flex flex-col gap-1" : "hidden items-center gap-1 md:flex"
      }>
      {discoveryLinks.map(({ href, label, icon: Icon }) => (
        <NavLinks
          key={href}
          href={href}
          label={
            <span className='flex items-center gap-2'>
              <Icon className='h-4 w-4' />
              {label}
            </span>
          }
          className='px-3 py-2'
        />
      ))}
    </div>
  );
}

function MobileAccountLinks({ user }) {
  return (
    <div className='space-y-3 border-t border-slate-200 pt-4 dark:border-slate-800'>
      {user ? (
        <>
          <div className='flex items-center gap-3 px-2'>
            <div className='flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-950'>
              {user.profile_pic_url ? (
                <img
                  src={user.profile_pic_url}
                  alt=''
                  className='h-full w-full object-cover'
                />
              ) : (
                <span className='font-mono text-xs font-bold text-emerald-400'>
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </span>
              )}
            </div>
            <div className='min-w-0'>
              <p className='truncate text-sm font-semibold text-slate-900 dark:text-white'>
                {user.name}
              </p>
              <p className='font-mono text-[10px] uppercase tracking-wider text-emerald-400'>
                {user.role || "member"}
              </p>
            </div>
          </div>
          <Link
            href='/dashboard'
            className='block rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'>
            Dashboard
          </Link>
          <Link
            href='/dashboard/seeker/applications'
            className='block rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'>
            Applications
          </Link>
          <form action={logout}>
            <button
              type='submit'
              className='w-full rounded-lg px-3 py-2 text-left text-sm text-rose-300 hover:bg-rose-500/10'>
              Sign Out
            </button>
          </form>
        </>
      ) : (
        <div className='flex flex-col gap-2'>
          <NavLinks label='Sign In' href='/login' />
          <NavLinks
            label='Create Account'
            href='/register'
            className='rounded-lg bg-emerald-500 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-emerald-400'
          />
        </div>
      )}
    </div>
  );
}

const NavBar = async () => {
  const authUser = await getAuthUser();

  return (
    <header className='sticky top-0 z-50 w-full border-b border-slate-200 bg-white/90 text-slate-900 shadow-sm backdrop-blur-md selection:bg-emerald-500/20 selection:text-emerald-400 dark:border-slate-800 dark:bg-slate-900/90 dark:text-white dark:shadow-none'>
      <nav className='mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8'>
        <div className='flex min-w-0 items-center gap-5'>
          <Link href='/' className='group flex shrink-0 items-center gap-2.5'>
            <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 font-bold text-white shadow-sm transition-colors group-hover:bg-emerald-500'>
              J
            </div>
            <span className='font-mono text-lg font-bold tracking-tight text-slate-900 dark:text-white'>
              JobLink
            </span>
          </Link>
          <DiscoveryLinks />
        </div>

        <div className='hidden items-center gap-3 md:flex'>
          <ThemeToggle />
          {authUser && (
            <Link
              href='/posts/create'
              className='inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-3.5 py-2 text-xs font-semibold text-slate-950 shadow-sm transition-all hover:bg-emerald-400 hover:shadow-emerald-500/20 active:scale-[0.98]'>
              <Plus className='h-4 w-4' />
              Post Opportunity
            </Link>
          )}
          {authUser ? (
            <UserMenu user={authUser} logoutAction={logout} />
          ) : (
            <div className='flex items-center gap-2'>
              <NavLinks label='Sign In' href='/login' />
              <NavLinks
                label='Create Account'
                href='/register'
                className='rounded-lg bg-emerald-500 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-emerald-400'
              />
            </div>
          )}
        </div>

        <MobileMenu>
          <DiscoveryLinks mobile />
          <div className='flex items-center justify-between border-t border-slate-200 pt-4 dark:border-slate-800'>
            <span className='text-sm text-slate-600 dark:text-slate-400'>
              Appearance
            </span>
            <ThemeToggle />
          </div>
          {authUser && (
            <Link
              href='/posts/create'
              className='flex items-center gap-2 rounded-lg bg-emerald-500 px-3 py-2.5 text-sm font-semibold text-slate-950'>
              <Plus className='h-4 w-4' />
              Post Opportunity
            </Link>
          )}
          <MobileAccountLinks user={authUser} />
        </MobileMenu>
      </nav>
    </header>
  );
};

export default NavBar;
