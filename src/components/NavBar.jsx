import React from "react";
import NavLinks from "./NavLinks";
import { logout } from "@/actions/auth";
import MobileMenu from "./MobileMenu";
import getAuthUser from "@/lib/getAuthUser";
import Link from "next/link";

const NavBar = async () => {
  const authUser = await getAuthUser();
  const userRole = authUser?.role || "guest";

  const LinksMarkup = ({ isMobile = false }) => (
    <ul
      className={`${
        isMobile
          ? "flex flex-col gap-4 text-sm w-full"
          : "hidden md:flex items-center gap-6 text-sm"
      } font-medium text-slate-400 [&_li]:transition-colors [&_li]:duration-200`}>
      {/* MOBILE IDENTITY PANEL */}
      {isMobile && authUser && (
        <li className='flex items-center gap-3 border-b border-slate-800/80 pb-4 mb-2'>
          <div className='w-10 h-10 rounded-xl border border-slate-800 overflow-hidden shrink-0 bg-slate-900 flex items-center justify-center'>
            {authUser?.profile_pic_url ? (
              <img
                src={authUser.profile_pic_url}
                alt='Avatar'
                className='w-full h-full object-cover'
              />
            ) : (
              <span className='text-xs font-bold text-emerald-400 font-mono'>
                {authUser.name?.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div className='min-w-0 flex-1'>
            <div className='text-white font-bold text-sm truncate'>
              {authUser?.name || "User"}
            </div>
            <div className='text-[10px] text-emerald-400 font-mono uppercase tracking-wider'>
              {userRole}
            </div>
          </div>
        </li>
      )}

      {authUser ? (
        <>
          {/* Desktop Profile Icon Avatar Dropdown Link */}
          {!isMobile && (
            <li className='flex items-center'>
              <Link
                href='/dashboard/settings'
                className='w-9 h-9 rounded-xl border border-slate-800 bg-slate-900 overflow-hidden hover:border-emerald-500/50 transition-all flex items-center justify-center shadow-inner'>
                {authUser?.profile_pic_url ? (
                  <img
                    src={authUser.profile_pic_url}
                    alt='Avatar'
                    className='w-full h-full object-cover'
                  />
                ) : (
                  <span className='text-xs font-bold text-emerald-400 font-mono'>
                    {authUser.name?.charAt(0).toUpperCase()}
                  </span>
                )}
              </Link>
            </li>
          )}

          <li className='hover:text-white'>
            <NavLinks label='Dashboard' href='/dashboard' />
          </li>
          <li className='hover:text-white'>
            <NavLinks label='Applications' href='/dashboard/applications' />
          </li>
          <li className='hover:text-white'>
            <NavLinks label='Post Opportunity' href='/posts/create' />
          </li>
          <li>
            <form action={logout}>
              <button
                type='submit'
                className='text-rose-400 hover:text-rose-300 text-sm font-medium transition-colors cursor-pointer'>
                Sign Out
              </button>
            </form>
          </li>
        </>
      ) : (
        <>
          <li className='hover:text-white'>
            <NavLinks label='Sign In' href='/login' />
          </li>
          <li>
            <NavLinks
              label='Create Account'
              href='/register'
              className='bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-4 py-2 rounded-xl font-semibold transition-all block text-xs shadow-md cursor-pointer'
            />
          </li>
        </>
      )}
    </ul>
  );

  return (
    <header className='w-full bg-slate-950/80 backdrop-blur-md border-b border-slate-900 sticky top-0 z-50 selection:bg-emerald-500/20 selection:text-emerald-400'>
      <nav className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between'>
        {/* Logo & Main Nav Items */}
        <div className='flex items-center gap-8'>
          <Link href='/' className='flex items-center gap-2.5 group'>
            <div className='h-8 w-8 rounded-lg bg-emerald-600 flex items-center justify-center font-bold text-white shadow-sm group-hover:bg-emerald-500 transition-colors'>
              J
            </div>
            <span className='font-bold text-white text-lg tracking-tight font-mono'>
              JobLink
            </span>
          </Link>

          <div className='hidden sm:flex items-center gap-6 text-sm text-slate-400 font-medium'>
            <NavLinks
              href='/'
              label={
                <span className='hover:text-white transition-colors'>
                  Home Feed
                </span>
              }
            />
            <NavLinks
              href='/docs'
              label={
                <span className='hover:text-white transition-colors'>
                  Resources
                </span>
              }
            />
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <LinksMarkup isMobile={false} />

        {/* Mobile Navigation Drawer */}
        <MobileMenu>
          <LinksMarkup isMobile={true} />
        </MobileMenu>
      </nav>
    </header>
  );
};

export default NavBar;
