"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import getAuthUser from "@/lib/getAuthUser";
import { seekerEngine } from "@/services/seekerEngine";
import { uploadMedia } from "@/services/storageService";

export async function applyToJobAction(prevState, formData) {
  const user = await getAuthUser();
  if (!user) return redirect("/login");

  const fd =
    formData instanceof FormData
      ? formData
      : prevState instanceof FormData
        ? prevState
        : null;

  if (!fd) {
    return {
      success: false,
      message: "Form data was not provided to the action.",
    };
  }

  const jobId = fd.get("job_id");
  const fullName = fd.get("full_name");
  const email = fd.get("email");
  const phone = fd.get("phone");
  const githubRepo = fd.get("github_repo");
  const portfolioLink = fd.get("portfolio_link");
  const bio = fd.get("bio");
  const coverLetter = fd.get("cover_letter");

  const cvFile = fd.get("cv_file");
  let cvUrl = fd.get("existing_cv_url");

  if (!jobId || !fullName || !email || !phone || !githubRepo || !coverLetter) {
    return {
      success: false,
      message:
        "Please fill out all required fields marked with an asterisk (*).",
    };
  }

  try {
    // Only upload if a valid file was attached (size > 0)
    if (cvFile && cvFile.size > 0) {
      const uploadResult = await uploadMedia(cvFile);
      if (uploadResult && uploadResult.url) {
        cvUrl = uploadResult.url;
      }
    }

    if (!cvUrl) {
      return {
        success: false,
        message:
          "Please upload your CV/Resume or ensure your profile has one attached.",
      };
    }

    await seekerEngine.applyToJob({
      job_id: jobId,
      applicant_id: String(user.userId || user.id),
      full_name: fullName,
      email: email,
      phone: phone,
      github_repo: githubRepo,
      portfolio_link: portfolioLink,
      cv_url: cvUrl,
      bio: bio,
      cover_letter: coverLetter,
    });
  } catch (error) {
    console.error("Application Processing Error:", error);
    return {
      success: false,
      message: error.message || "Failed to submit application.",
    };
  }

  revalidatePath("/jobs");
  revalidatePath("/dashboard/seeker/applications");

  // Return success state so the client-side component can trigger the toast notification
  return {
    success: true,
    message: "Application submitted successfully!",
  };
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
      message: "Failed to withdraw application.",
    };
  }

  revalidatePath("/dashboard/seeker/applications");
  return { success: true, message: "Application withdrawn successfully." };
}

/**
 * Server Action to update candidate professional profile details.
 */
export async function updateSeekerProfileProfile(formData) {
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
      message: error.message || "Failed to update seeker preferences.",
    };
  }

  revalidatePath("/dashboard/seeker/profile");
  redirect("/dashboard/seeker/profile");
}
