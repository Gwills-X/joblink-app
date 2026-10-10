import { redirect } from "next/navigation";

export default async function LegacyApplicationDetailPage({ params }) {
  const { applicationId } = await params;
  redirect(`/dashboard/employer/applications/${applicationId}`);
}
