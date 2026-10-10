// actions/employerActions.js

"use server";

import getAuthUser from "@/lib/getAuthUser";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { employerEngine } from "@/services/employerEngine";
import { notificationEngine } from "@/services/notificationEngine";

/**
 * Server Action to handle creating new job and collaboration postings.
 * Supports optional company association for independent/collaboration posts.
 */
export async function createJobAction(prevState, formData) {
  const user = await getAuthUser();

  if (!user) {
    return redirect("/login");
  }

  if (!formData) {
    return {
      success: false,
      errors: {
        server: ["No form data was received."],
      },
    };
  }

  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "").trim();

  const company_id = String(formData.get("company_id") || "").trim() || null;

  const employment_type = String(
    formData.get("employment_type") || "FULL_TIME",
  ).trim();

  const listing_type = String(formData.get("listing_type") || "JOB").trim();

  const location = String(formData.get("location") || "").trim() || null;
  const salary = String(formData.get("salary") || "").trim() || null;

  const deadline = String(formData.get("deadline") || "").trim() || null;

  const max_applicants = Number(formData.get("max_applicants") || 50);

  // -----------------------------------------
  // BASIC VALIDATION
  // -----------------------------------------

  if (!title || !description) {
    return {
      success: false,
      errors: {
        server: ["Title and description are required."],
      },
    };
  }

  // -----------------------------------------
  // LISTING TYPE VALIDATION
  // -----------------------------------------

  const allowedTypes = ["JOB", "COLLABORATION", "PROJECT", "PARTNERSHIP"];

  if (!allowedTypes.includes(listing_type)) {
    return {
      success: false,
      errors: {
        server: ["Invalid listing category selected."],
      },
    };
  }

  // -----------------------------------------
  // COMPANY / INDEPENDENT RULES
  // -----------------------------------------

  // Independent users can create:
  // JOB
  // COLLABORATION
  // PROJECT
  //
  // Company users can create:
  // JOB
  // PROJECT
  // PARTNERSHIP

  if (!company_id && listing_type === "PARTNERSHIP") {
    return {
      success: false,
      errors: {
        server: [
          "Partnership listings must be created on behalf of a company.",
        ],
      },
    };
  }

  if (company_id && listing_type === "COLLABORATION") {
    return {
      success: false,
      errors: {
        server: [
          "Collaboration listings are for independent/community posts. Use Partnership for company opportunities.",
        ],
      },
    };
  }

  // -----------------------------------------
  // COMPANY OWNERSHIP VALIDATION
  // -----------------------------------------

  const employerId = String(user.userId || user.id);

  try {
    const jobPayload = {
      company_id,
      title,
      description,
      employment_type,
      listing_type,
      location,
      salary,
      deadline,
      max_applicants,
    };

    await employerEngine.createJobListing(employerId, jobPayload);
  } catch (error) {
    console.error("Employer Database Processing Error:", error);

    return {
      success: false,
      errors: {
        server: [error.message || "Something went wrong creating the listing."],
      },
    };
  }

  revalidatePath("/dashboard/employer");
  revalidatePath("/jobs");

  redirect("/dashboard/employer");
}
/**
 * Server Action to handle modifying job listings.
 */
export async function updateJobAction(postId, formData) {
  const user = await getAuthUser();
  if (!user) return redirect("/login");

  const updateData = {
    title: formData.get("title"),
    description: formData.get("description"),
    employment_type: formData.get("employment_type"),
    location: formData.get("location"),
    salary: formData.get("salary"),
    deadline: formData.get("deadline") || null,
    max_applicants: Number(formData.get("max_applicants") || 50),
    status: formData.get("status") || "OPEN",
  };

  try {
    await employerEngine.updateJobListing(
      postId,
      String(user.userId || user.id),
      updateData,
    );
  } catch (error) {
    console.error("Job Modification Error:", error);
    return {
      success: false,
      errors: { server: ["Overwriting listing record failed."] },
    };
  }

  revalidatePath("/dashboard/employer");
  revalidatePath(`/jobs/${postId}`);
  redirect("/dashboard/employer");
}

/**
 * Server Action to securely delete an employer job.
 */
export async function deleteJobAction(postId) {
  const user = await getAuthUser();
  if (!user) return redirect("/login");

  const employerId = String(user.userId || user.id);

  try {
    await employerEngine.deleteJobListing(postId, employerId);
  } catch (error) {
    console.error("Job Deletion Error:", error);
    return {
      success: false,
      errors: { server: ["Removing listing record failed."] },
    };
  }

  revalidatePath("/dashboard/employer");
  revalidatePath("/jobs");
  redirect("/dashboard/employer");
}

export async function reviewApplicationAction(formData) {
  const user = await getAuthUser();

  if (!user) return redirect("/login");

  const employerId = String(user.userId || user.id);

  const applicationId = formData.application_id;
  const jobId = formData.job_id;
  const status = formData.status;
  const employerFeedback = formData.employer_feedback?.trim() || null;

  if (!applicationId || !status) {
    return {
      success: false,
      errors: {
        server: ["Application ID and status are required."],
      },
    };
  }

  if (status === "REJECTED" && !employerFeedback) {
    return {
      success: false,
      errors: { server: ["Rejection feedback is required."] },
    };
  }

  try {
    const application = await employerEngine.getApplicationDetailsForReview(
      applicationId,
      employerId,
    );

    if (!application) {
      return {
        success: false,
        errors: { server: ["Unauthorized or application not found."] },
      };
    }

    if (status === "REJECTED") {
      await employerEngine.rejectApplication({
        applicationId,
        employerId,
        rejectionFeedback: employerFeedback,
      });
    } else if (status === "ACCEPTED") {
      await employerEngine.acceptApplication(
        applicationId,
        employerId,
        employerFeedback,
      );
    } else if (status === "PENDING" || status === "SHORTLISTED") {
      await employerEngine.reviewApplication(
        applicationId,
        employerId,
        status,
        employerFeedback,
      );
    } else {
      return {
        success: false,
        errors: {
          server: ["Invalid application status."],
        },
      };
    }

    const notificationDetails = {
      SHORTLISTED: {
        type: "APPLICATION_SHORTLISTED",
        title: "Your application was shortlisted",
        message: `Your application for ${application.job_title} was shortlisted. Application reference: ${applicationId}`,
      },
      ACCEPTED: {
        type: "APPLICATION_ACCEPTED",
        title: "Your application was accepted",
        message: `Your application for ${application.job_title} was accepted. Application reference: ${applicationId}`,
      },
      REJECTED: {
        type: "APPLICATION_REJECTED",
        title: "Application decision update",
        message: `A decision was made on your application for ${application.job_title}. Application reference: ${applicationId}`,
      },
    }[status];

    if (notificationDetails) {
      try {
        await notificationEngine.create({
          userId: application.applicant_id,
          eventKey: `application:${applicationId}:${status}`,
          ...notificationDetails,
        });
      } catch (notificationError) {
        console.error(
          "Application notification could not be created:",
          notificationError,
        );
      }
    }
  } catch (error) {
    console.error("Application Review Error:", error);

    return {
      success: false,
      errors: {
        server: [error.message || "Failed to update application."],
      },
    };
  }

  revalidatePath("/dashboard/employer/applications");
  revalidatePath("/dashboard/notifications");

  revalidatePath(`/dashboard/employer/applications/${applicationId}`);

  if (jobId) {
    revalidatePath(`/dashboard/employer/jobs/${jobId}/applicants`);
  }

  return {
    success: true,
    message:
      status === "REJECTED"
        ? "Application rejected successfully."
        : status === "ACCEPTED"
          ? "Application accepted successfully."
          : "Application status updated successfully.",
  };
}
