import getAuthUser from "@/lib/getAuthUser";
import { redirect } from "next/navigation";
import { employerEngine } from "@/services/employerEngine";
import { seekerEngine } from "@/services/seekerEngine";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const user = await getAuthUser();
  if (!user) return redirect("/login");

  const userId = String(user.userId || user.id);
  const [hasSeekerProfile, hasEmployerProfile] = await Promise.all([
    seekerEngine.hasSeekerProfile(userId),
    employerEngine.hasCompanyProfile(userId),
  ]);

  if (hasEmployerProfile) {
    const jobs = await employerEngine.getEmployerJobs(userId);
    if (jobs.length > 0) return redirect("/dashboard/employer");
  }

  if (hasSeekerProfile || !hasEmployerProfile) {
    return redirect("/dashboard/seeker/applications");
  }

  return redirect("/dashboard/employer");
}
