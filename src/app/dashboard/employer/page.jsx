import getAuthUser from "@/lib/getAuthUser";
import { redirect } from "next/navigation";
import { employerEngine } from "@/services/employerEngine";

import EmployerHeader from "./components/EmployerHeader";
import EmployerCompanySection from "./components/EmployerCompanySection";
import EmployerJobsSection from "./components/EmployerJobsSection";

export default async function EmployerDashboardPage() {
  const authUser = await getAuthUser();

  if (!authUser) redirect("/login");

  const userId = String(authUser.userId || authUser.id);

  let companies = [];
  let jobs = [];

  try {
    companies = await employerEngine.getCompanies(userId);
  } catch (error) {
    console.error("Employer companies fetch failed:", error);
  }

  try {
    jobs = await employerEngine.getEmployerJobs(userId);
  } catch (error) {
    console.error("Employer jobs fetch failed:", error);
  }

  return (
    <div className='mx-auto max-w-6xl space-y-8 px-4 py-8'>
      <EmployerHeader />

      <EmployerCompanySection companies={companies} />

      <EmployerJobsSection jobs={jobs} />
    </div>
  );
}
