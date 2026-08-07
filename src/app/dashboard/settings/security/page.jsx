import getAuthUser from "@/lib/getAuthUser";
import SecurityPage from "./SecurityPage";

export default async function SecurityWrapper() {
  const user = await getAuthUser();
  if (!user) return <p>Unauthorized</p>;
  return (
    <div className='mx-auto max-w-lg'>
      <SecurityPage userId={user.userId} />
    </div>
  );
}
