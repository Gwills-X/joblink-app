"use server";

import getAuthUser from "@/lib/getAuthUser";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { seekerEngine } from "@/services/seekerEngine";

/**
 * Server Action to handle candidate job and collaboration applications.
 */
export async function applyToJobAction(prevState, formData) {
  const user = await getAuthUser();
  if (!user) return redirect("/login");

  const jobId = formData.get("job_id");
  const coverLetter = formData.get("cover_letter");

  if (!jobId || !coverLetter) {
    return {
      success: false,
      errors: {
        server: ["Job reference and cover letter/pitch details are required."],
      },
    };
  }

  try {
    await seekerEngine.applyToJob({
      job_id: jobId,
      applicant_id: String(user.userId || user.id),
      cover_letter: coverLetter,
    });
  } catch (error) {
    console.error("Application Processing Error:", error);
    return {
      success: false,
      errors: { server: [error.message || "Failed to submit application."] },
    };
  }

  revalidatePath("/jobs");
  revalidatePath("/dashboard/applications");
  redirect("/dashboard/applications");
}

/**
 * Server Action to handle withdrawing an active application.
 */
export async function withdrawApplicationAction(applicationId) {
  const user = await getAuthUser();
  if (!user) return redirect("/login");

  try {
    await seekerEngine.withdrawApplication(
      applicationId,
      String(user.userId || user.id),
    );
  } catch (error) {
    console.error("Application Withdrawal Error:", error);
    return {
      success: false,
      errors: { server: ["Failed to withdraw application."] },
    };
  }

  revalidatePath("/dashboard/applications");
  return { success: true };
}

/**
 * Server Action to update candidate professional profile details.
 */
export async function updateSeekerProfileProfile(prevState, formData) {
  const user = await getAuthUser();
  if (!user) return redirect("/login");

  const userId = String(user.userId || user.id);

  const preferences = {
    headline: formData.get("headline"),
    interest_field: formData.get("interest_field"),
  };

  try {
    await seekerEngine.updateSeekerPreferences(userId, preferences);
  } catch (error) {
    console.error("Seeker Preferences Update Error:", error);
    return {
      success: false,
      errors: {
        server: [error.message || "Failed to update seeker preferences."],
      },
    };
  }

  revalidatePath("/dashboard/seeker/profile");
  redirect("/dashboard/seeker/profile");
}
