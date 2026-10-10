import DashboardNav from "./DashboardNav";
import WorkspaceSwitcher from "@/components/WorkspaceSwitcher";
import getAuthUser from "@/lib/getAuthUser";
import { seekerEngine } from "@/services/seekerEngine";
import { employerEngine } from "@/services/employerEngine";
import { notificationEngine } from "@/services/notificationEngine";
import NotificationBell from "@/components/NotificationBell";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }) {
  const user = await getAuthUser();
  const userId = user ? String(user.userId || user.id) : null;

  let hasSeekerProfile = false;
  let hasEmployerProfile = false;
  let notifications = [];
  let unreadCount = 0;
  let notificationLoadError = false;

  if (userId) {
    try {
      hasSeekerProfile = await seekerEngine.hasSeekerProfile(userId);
      hasEmployerProfile = await employerEngine.hasCompanyProfile(userId);
      notifications = await notificationEngine.recent(userId);
      unreadCount = await notificationEngine.unreadCount(userId);
    } catch (err) {
      console.error("Layout Profile Check Error:", err.message);
      notificationLoadError = true;
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
      <main className='min-w-0 flex-1'>
        {userId && (
          <div className='mb-3 flex justify-end'>
            <NotificationBell
              notifications={notifications}
              unreadCount={unreadCount}
              loadError={notificationLoadError}
            />
          </div>
        )}
        {children}
      </main>
    </div>
  );
}
