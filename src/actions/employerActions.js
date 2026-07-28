// actions/employerActions.js

"use strict";

import getAuthUser from "@/lib/getAuthUser";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { employerEngine } from "@/services/employerEngine";

/**
 * Server Action to handle creating new job and collaboration postings.
 * Supports optional company association for independent/collaboration posts.
 */
export async function createJobAction(prevState, formData) {
  const user = await getAuthUser();
  if (!user) return redirect("/login");

  const title = formData.get("title");
  const description = formData.get("description");
  const company_id = formData.get("company_id") || null; // Optional company selection
  const employment_type = formData.get("employment_type") || "FULL_TIME";
  const listing_type = formData.get("listing_type") || "JOB";
  const location = formData.get("location") || null;
  const salary = formData.get("salary") || null;
  const deadline = formData.get("deadline") || null;
  const max_applicants = Number(formData.get("max_applicants") || 50);

  // Validation adjusted: company_id is no longer strictly required for personal/collaboration posts
  if (!title || !description) {
    return {
      success: false,
      errors: {
        server: ["Job title and description are required."],
      },
    };
  }

  try {
    const employerId = String(user.userId || user.id);
    const jobPayload = {
      company_id: company_id !== "" ? company_id : null,
      title,
      description,
      employment_type,
      listing_type,
      location,
      salary,
      deadline,
      max_applicants,
    };

    // Aligned to engine signature: createJobListing(employerId, jobData)
    await employerEngine.createJobListing(employerId, jobPayload);
  } catch (error) {
    console.error("Employer Database Processing Error:", error);
    return {
      success: false,
      errors: { server: ["Something went wrong creating the listing."] },
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

  try {
    await employerEngine.deleteJobListing(postId);
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

/**
 * Server Action to handle reviewing and updating applicant status/feedback.
 */
export async function reviewApplicationAction(formData) {
  const user = await getAuthUser();
  if (!user) return redirect("/login");

  const applicationId = formData.get("application_id");
  const jobId = formData.get("job_id");
  const status = formData.get("status");
  const employerFeedback = formData.get("employer_feedback") || null;

  if (!applicationId || !status) {
    return {
      success: false,
      errors: { server: ["Application ID and status are required."] },
    };
  }

  try {
    await employerEngine.reviewApplication(
      applicationId,
      String(user.userId || user.id),
      status,
      employerFeedback,
    );
  } catch (error) {
    console.error("Application Review Error:", error);
    return {
      success: false,
      errors: {
        server: [error.message || "Failed to update application review."],
      },
    };
  }

  revalidatePath(`/dashboard/employer/jobs/${jobId}/applicants`);
  redirect(`/dashboard/employer/jobs/${jobId}/applicants`);
}
