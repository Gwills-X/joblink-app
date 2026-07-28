"use strict";

import getAuthUser from "@/lib/getAuthUser";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { employerEngine } from "@/services/employerEngine";

export async function saveCompanyProfileAction(prevState, formData) {
  const user = await getAuthUser();
  if (!user) return redirect("/login");

  const name = formData.get("name");
  const tagline = formData.get("tagline");
  const description = formData.get("description");
  const website_url = formData.get("website_url");
  const logo_url = formData.get("logo_url");

  if (!name) {
    return {
      success: false,
      errors: { server: ["Company name is required."] },
    };
  }

  try {
    const ownerId = String(user.userId || user.id);
    await employerEngine.saveCompanyProfile(ownerId, {
      name,
      tagline,
      description,
      website_url,
      logo_url,
    });
  } catch (error) {
    console.error("Company Profile Saving Error:", error);
    return {
      success: false,
      errors: { server: [error.message || "Failed to save company profile."] },
    };
  }

  revalidatePath("/dashboard/employer");
  redirect("/dashboard/employer");
}
