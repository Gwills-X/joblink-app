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
    <div className='flex flex-col gap-6 lg:flex-row lg:gap-8'>
      {/* Sidebar — desktop sticky, mobile stacked */}
      <aside className='shrink-0 lg:w-64 lg:sticky lg:top-24 lg:self-start'>
        <div className='space-y-3'>
          <WorkspaceSwitcher
            hasSeekerProfile={hasSeekerProfile}
            hasEmployerProfile={hasEmployerProfile}
          />
          <DashboardNav />
        </div>
      </aside>

      {/* Main Content */}
      <main className='min-w-0 flex-1'>{children}</main>
    </div>
  );
}
