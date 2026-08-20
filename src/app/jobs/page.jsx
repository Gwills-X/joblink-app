import { seekerEngine } from "@/services/seekerEngine";
import JobsMarketplaceClient from "./JobsMarketplaceClient";

export default async function PublicJobsMarketplacePage() {
  let listings = [];

  try {
    // Fetch ONCE.
    // All filtering/searching happens on the client afterward.
    listings = await seekerEngine.getMarketplaceListings("ALL", "");
  } catch (error) {
    console.error("Marketplace Engine Error:", error);
  }

  return <JobsMarketplaceClient listings={listings} />;
}
