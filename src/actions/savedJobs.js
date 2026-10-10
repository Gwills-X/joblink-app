"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import getAuthUser from "@/lib/getAuthUser";
import { savedJobsEngine } from "@/services/savedJobsEngine";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function setSavedOpportunityAction(jobId, shouldSave) {
  const user = await getAuthUser();
  if (!user) return redirect("/login");

  if (typeof jobId !== "string" || !UUID_PATTERN.test(jobId)) {
    return { success: false, message: "A valid opportunity is required." };
  }

  if (typeof shouldSave !== "boolean") {
    return { success: false, message: "Invalid save action." };
  }

  const userId = String(user.userId || user.id);

  try {
    if (shouldSave) {
      const saved = await savedJobsEngine.save(userId, jobId);
      if (!saved) {
        return { success: false, message: "Opportunity not found." };
      }
    } else {
      await savedJobsEngine.unsave(userId, jobId);
    }

    revalidatePath("/jobs");
    revalidatePath(`/jobs/${jobId}`);
    revalidatePath("/dashboard/seeker/saved");
    return {
      success: true,
      isSaved: shouldSave,
      message: shouldSave ? "Opportunity saved." : "Opportunity removed.",
    };
  } catch (error) {
    console.error("Saved opportunity update failed:", error);
    return { success: false, message: "Could not update saved opportunities." };
  }
}
