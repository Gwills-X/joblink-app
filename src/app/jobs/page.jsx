import { seekerEngine } from "@/services/seekerEngine";
import JobsMarketplaceClient from "./JobsMarketplaceClient";
import getAuthUser from "@/lib/getAuthUser";

export default async function PublicJobsMarketplacePage() {
  const user = await getAuthUser();
  let listings = [];

  try {
    // Fetch ONCE.
    // All filtering/searching happens on the client afterward.
    listings = await seekerEngine.getMarketplaceListings(
      "ALL",
      "",
      user ? String(user.userId || user.id) : null,
    );
  } catch (error) {
    console.error("Marketplace Engine Error:", error);
  }

  return (
    <JobsMarketplaceClient
      listings={listings}
      currentUserId={user ? String(user.userId || user.id) : null}
    />
  );
}
