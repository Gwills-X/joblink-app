import getAuthUser from "@/lib/getAuthUser";
import EditProfileForm from "./components/EditProfileForm";

export default async function EditProfilePage() {
  const user = await getAuthUser();
  if (!user) return <p>Unauthorized</p>;

  return <EditProfileForm initialUser={user} />;
}
