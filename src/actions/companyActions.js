"use server";

import getAuthUser from "@/lib/getAuthUser";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { employerEngine } from "@/services/employerEngine";

/**
 * Extract company data from FormData
 */
function getCompanyData(formData) {
  return {
    name: String(formData.get("name") || "").trim(),
    tagline: String(formData.get("tagline") || "").trim(),
    description: String(formData.get("description") || "").trim(),
    industry: String(formData.get("industry") || "").trim(),
    location: String(formData.get("location") || "").trim(),
    website_url: String(formData.get("website_url") || "").trim(),

    // Cloudinary
    logo_url: String(formData.get("logo_url") || "").trim(),
    logo_public_id: String(formData.get("logo_public_id") || "").trim(),
    logo_file_type: String(formData.get("logo_file_type") || "").trim(),
    logo_format: String(formData.get("logo_format") || "").trim(),
  };
}

/**
 * CREATE COMPANY
 *
 * useActionState signature:
 * (prevState, formData)
 */
export async function createCompanyAction(prevState, formData) {
  const user = await getAuthUser();

  if (!user) {
    redirect("/login");
  }

  if (!formData) {
    return {
      success: false,
      message: "No form data was received.",
      errors: {
        server: ["No form data was received."],
      },
    };
  }

  const companyData = getCompanyData(formData);

  if (!companyData.name) {
    return {
      success: false,
      message: "Company name is required.",
      errors: {
        name: ["Company name is required."],
      },
    };
  }

  const ownerId = String(user.userId || user.id);

  let result;

  try {
    result = await employerEngine.createCompany(ownerId, companyData);
  } catch (error) {
    console.error("Create Company Error:", error);

    return {
      success: false,
      message: error?.message || "Failed to create company.",
      errors: {
        server: [error?.message || "Failed to create company."],
      },
    };
  }

  revalidatePath("/dashboard/employer");
  revalidatePath("/dashboard/employer/company");
  revalidatePath("/dashboard/employer/company/all");

  redirect(`/dashboard/employer/company/${result.companyId}`);
}

/**
 * UPDATE COMPANY
 *
 * Actual signature:
 * (companyId, prevState, formData)
 *
 * The client must bind companyId before
 * passing this action to useActionState.
 */
export async function updateCompanyAction(companyId, prevState, formData) {
  const user = await getAuthUser();

  if (!user) {
    redirect("/login");
  }

  if (!companyId) {
    return {
      success: false,
      message: "Company ID is missing.",
      errors: {
        server: ["Company ID is missing."],
      },
    };
  }

  if (!formData) {
    return {
      success: false,
      message: "No form data was received.",
      errors: {
        server: ["No form data was received."],
      },
    };
  }

  const companyData = getCompanyData(formData);

  if (!companyData.name) {
    return {
      success: false,
      message: "Company name is required.",
      errors: {
        name: ["Company name is required."],
      },
    };
  }

  const ownerId = String(user.userId || user.id);

  let result;

  try {
    result = await employerEngine.updateCompany(
      companyId,
      ownerId,
      companyData,
    );
  } catch (error) {
    console.error("Update Company Error:", error);

    return {
      success: false,
      message: error?.message || "Failed to update company.",
      errors: {
        server: [error?.message || "Failed to update company."],
      },
    };
  }

  if (!result?.affectedRows) {
    return {
      success: false,
      message: "Company not found or you do not have permission to edit it.",
      errors: {
        server: ["Company not found or you do not have permission to edit it."],
      },
    };
  }

  revalidatePath("/dashboard/employer");
  revalidatePath("/dashboard/employer/company");
  revalidatePath("/dashboard/employer/company/all");
  revalidatePath(`/dashboard/employer/company/${companyId}`);
  revalidatePath(`/dashboard/employer/company/${companyId}/edit`);

  redirect(`/dashboard/employer/company/${companyId}`);
}

/**
 * DELETE COMPANY
 *
 * The database handles deletion of:
 * - The company
 * - Company-owned listings/jobs
 *
 * through the appropriate foreign-key constraints.
 */
export async function deleteCompanyAction(companyId) {
  const user = await getAuthUser();

  if (!user) {
    redirect("/login");
  }

  if (!companyId) {
    throw new Error("Company ID is required.");
  }

  const ownerId = String(user.userId || user.id);

  try {
    const result = await employerEngine.deleteCompany(companyId, ownerId);

    if (!result?.affectedRows) {
      throw new Error(
        "Company not found or you do not have permission to delete it.",
      );
    }
  } catch (error) {
    console.error("Delete Company Error:", error);

    throw new Error(error?.message || "Failed to delete company.");
  }

  revalidatePath("/dashboard/employer");
  revalidatePath("/dashboard/employer/company");
  revalidatePath("/dashboard/employer/company/all");
  revalidatePath("/jobs");

  redirect("/dashboard/employer/company");
}
