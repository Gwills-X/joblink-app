import { redirect } from "next/navigation";

export default function JobsCreateRedirectPage() {
  redirect("/dashboard/employer/job/new");
}
