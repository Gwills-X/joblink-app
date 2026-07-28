import DashboardNav from "./DashboardNav";
import WorkspaceSwitcher from "@/components/WorkspaceSwitcher";
import getAuthUser from "@/lib/getAuthUser";
import { seekerEngine } from "@/services/seekerEngine";
import { employerEngine } from "@/services/employerEngine";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }) {
  const user = await getAuthUser();
  const userId = user ? String(user.userId || user.id) : null;

  let hasSeekerProfile = false;
  let hasEmployerProfile = false;

  if (userId) {
    try {
      hasSeekerProfile = await seekerEngine.hasSeekerProfile(userId);
      hasEmployerProfile = await employerEngine.hasCompanyProfile(userId);
    } catch (err) {
      console.error("Layout Profile Check Error:", err.message);
    }
  }

  return (
    <div className='flex flex-col lg:flex-row min-h-[calc(100vh-5rem)] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-8'>
      {/* Sidebar container - visible on desktop */}
      <aside className='hidden lg:flex lg:flex-col w-64 flex-shrink-0 sticky top-24 h-fit gap-4'>
        <WorkspaceSwitcher
          hasSeekerProfile={hasSeekerProfile}
          hasEmployerProfile={hasEmployerProfile}
        />
        <DashboardNav />
      </aside>

      {/* Main Content Area */}
      <main className='flex-1 min-w-0 space-y-6'>
        {/* Mobile Nav & Switcher - visible only on small screens */}
        <div className='lg:hidden space-y-4'>
          <WorkspaceSwitcher
            hasSeekerProfile={hasSeekerProfile}
            hasEmployerProfile={hasEmployerProfile}
          />
          <DashboardNav />
        </div>
        {children}
      </main>
    </div>
  );
}
