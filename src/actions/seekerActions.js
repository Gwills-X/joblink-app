"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import getAuthUser from "@/lib/getAuthUser";
import { seekerEngine } from "@/services/seekerEngine";
import { uploadMedia } from "@/services/storageService";

/* =========================
   APPLY FOR JOB
========================= */

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
      message: "Form data was not provided.",
    };
  }

  const applicantId = String(user.userId || user.id);
  const jobId = String(fd.get("job_id") || "").trim();

  const fullName = String(fd.get("full_name") || "").trim();
  const email = String(fd.get("email") || "").trim();
  const phone = String(fd.get("phone") || "").trim();

  const githubRepo = String(fd.get("github_repo") || "").trim();
  const portfolioLink = String(fd.get("portfolio_link") || "").trim();

  const bio = String(fd.get("bio") || "").trim();
  const coverLetter = String(fd.get("cover_letter") || "").trim();

  const cvFile = fd.get("cv_file");

  let cvUrl = String(fd.get("existing_cv_url") || "").trim();

  if (!jobId || !fullName || !email || !phone || !githubRepo || !coverLetter) {
    return {
      success: false,
      message:
        "Please fill out all required fields marked with an asterisk (*).",
    };
  }

  try {
    /* Prevent duplicate applications before upload. */
    const existing = await seekerEngine.getApplicationForJob(
      jobId,
      applicantId,
    );

    if (existing) {
      return {
        success: false,
        alreadyApplied: true,
        applicationId: existing.id,
        applicationStatus: existing.status,
        message:
          existing.status === "WITHDRAWN"
            ? "You previously applied for this opportunity and withdrew the application. You cannot apply again."
            : `You have already applied for this opportunity. Current status: ${existing.status}.`,
      };
    }

    /* Upload CV only when a new file exists. */
    if (
      cvFile &&
      typeof cvFile === "object" &&
      "size" in cvFile &&
      cvFile.size > 0
    ) {
      const uploadResult = await uploadMedia(cvFile);

      if (uploadResult?.url) {
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

    const result = await seekerEngine.applyToJob({
      job_id: jobId,
      applicant_id: applicantId,
      full_name: fullName,
      email,
      phone,
      github_repo: githubRepo,
      portfolio_link: portfolioLink,
      cv_url: cvUrl,
      bio,
      cover_letter: coverLetter,
    });

    revalidatePath("/jobs");
    revalidatePath(`/jobs/${jobId}`);
    revalidatePath("/dashboard/seeker/applications");

    return {
      success: true,
      applicationId: result?.insertId || null,
      message: "Application submitted successfully!",
    };
  } catch (error) {
    console.error("❌ Application Processing Error:", error);

    const message = error?.message || "";

    if (
      error?.code === "ER_DUP_ENTRY" ||
      message.toLowerCase().includes("unique_application") ||
      message.toLowerCase().includes("already applied")
    ) {
      return {
        success: false,
        alreadyApplied: true,
        message: "You have already applied for this opportunity.",
      };
    }

    return {
      success: false,
      message: message || "Failed to submit application.",
    };
  }
}

/* =========================
   WITHDRAW APPLICATION
========================= */

export async function withdrawApplicationAction(applicationId) {
  const user = await getAuthUser();

  if (!user) return redirect("/login");

  if (!applicationId) {
    return {
      success: false,
      message: "Application ID is required.",
    };
  }

  const userId = String(user.userId || user.id);

  try {
    const application = await seekerEngine.getSeekerApplicationDetails(
      applicationId,
      userId,
    );

    if (!application) {
      return {
        success: false,
        message: "Application not found.",
      };
    }

    if (application.status !== "PENDING") {
      return {
        success: false,
        message: "Only pending applications can be withdrawn.",
      };
    }

    await seekerEngine.withdrawApplication(applicationId, userId);

    revalidatePath("/dashboard/seeker/applications");
    revalidatePath(`/dashboard/seeker/applications/${applicationId}`);

    if (application.job_id) {
      revalidatePath(`/jobs/${application.job_id}`);
    }

    return {
      success: true,
      message: "Application withdrawn successfully.",
    };
  } catch (error) {
    console.error("❌ Withdrawal Error:", error);

    return {
      success: false,
      message: error?.message || "Failed to withdraw application.",
    };
  }
}

/* =========================
   UPDATE PROFILE
========================= */

export async function updateSeekerProfileProfile(formData) {
  const user = await getAuthUser();

  if (!user) return redirect("/login");

  const userId = String(user.userId || user.id);

  const headline = String(formData.get("headline") || "").trim();

  const interestField = String(formData.get("interest_field") || "").trim();

  if (!headline || !interestField) {
    return {
      success: false,
      message: "Professional headline and technical focus are required.",
    };
  }

  try {
    await seekerEngine.updateSeekerPreferences(userId, {
      headline,
      interest_field: interestField,
    });
  } catch (error) {
    console.error("❌ Profile Update Error:", error);

    return {
      success: false,
      message: error?.message || "Failed to update seeker profile.",
    };
  }

  revalidatePath("/dashboard/seeker/profile");
  revalidatePath("/dashboard/seeker/applications");

  redirect("/dashboard/seeker/profile");
}

/* =========================
   CREATE PROFILE
========================= */

export async function createSeekerProfileAction(prevState, formData) {
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
      message: "Form data was not provided.",
    };
  }

  const userId = String(user.userId || user.id);

  const headline = String(fd.get("headline") || "").trim();

  const bio = String(fd.get("bio") || "").trim();

  const location = String(fd.get("location") || "").trim();

  const githubHandle = String(fd.get("github_handle") || "").trim();

  const websiteUrl = String(fd.get("website_url") || "").trim();

  if (!headline || !bio) {
    return {
      success: false,
      message: "Please fill in your headline and professional bio.",
    };
  }

  try {
    await seekerEngine.createSeekerProfile({
      userId,
      headline,
      bio,
      location,
      github_handle: githubHandle,
      website_url: websiteUrl,
    });
  } catch (error) {
    console.error("❌ Profile Creation Error:", error);

    return {
      success: false,
      message: error?.message || "Failed to create seeker profile.",
    };
  }

  revalidatePath("/jobs");
  revalidatePath("/dashboard/seeker/profile");
  revalidatePath("/dashboard/seeker/applications");

  redirect("/jobs");
}
