import { query } from "@/lib/db";
import crypto from "crypto";

export async function insertOrUpdateMysqlCompany(ownerId, companyData) {
  const {
    id = crypto.randomUUID(),
    name,
    tagline,
    description,
    website_url,
    logo_url,
  } = companyData;

  // 1. Check if company already exists for this owner
  const existing = await query(
    "SELECT id FROM companies WHERE owner_id = ? LIMIT 1",
    [ownerId],
  );

  if (existing && existing.length > 0) {
    // Update existing company record
    const sql = `
      UPDATE companies 
      SET name = ?, tagline = ?, description = ?, website_url = ?, logo_url = ?
      WHERE owner_id = ?
    `;
    await query(sql, [
      name,
      tagline,
      description,
      website_url || null,
      logo_url || null,
      ownerId,
    ]);

    // Ensure user role reflects employer status
    await query(
      "UPDATE users SET role = 'employer' WHERE id = ? AND role = 'user'",
      [ownerId],
    );

    return { success: true, companyId: existing[0].id };
  } else {
    // Insert new company record
    const sql = `
      INSERT INTO companies (id, owner_id, name, tagline, description, website_url, logo_url)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    await query(sql, [
      id,
      ownerId,
      name,
      tagline || null,
      description || null,
      website_url || null,
      logo_url || null,
    ]);

    // Update user role to employer upon creating their first company profile
    await query(
      "UPDATE users SET role = 'employer' WHERE id = ? AND role = 'user'",
      [ownerId],
    );

    return { success: true, companyId: id };
  }
}

export async function fetchMysqlCompanyByOwner(ownerId) {
  try {
    const rows = await query(
      "SELECT * FROM companies WHERE owner_id = ? LIMIT 1",
      [ownerId],
    );
    return rows?.[0] || null;
  } catch (error) {
    console.error("❌ MySQL Company Fetch Fault:", error.message);
    throw error;
  }
}
