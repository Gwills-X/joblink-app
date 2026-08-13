import { query } from "@/lib/db";
import crypto from "crypto";

/**
 * Create a new company.
 */

export async function createMysqlCompany(ownerId, companyData) {
  const {
    id = crypto.randomUUID(),
    name,
    tagline,
    description,
    industry,
    website_url,
    logo_url,
    logo_public_id,
    logo_file_type,
    logo_format,
    location,
  } = companyData;

  const existing = await query(
    "SELECT id FROM companies WHERE id = ? AND owner_id = ? LIMIT 1",
    [id, ownerId],
  );

  if (existing && existing.length > 0) {
    const companyId = existing[0].id;

    await query(
      `
        UPDATE companies
        SET
          name = ?,
          tagline = ?,
          description = ?,
          industry = ?,
          website = ?,
          logo_url = ?,
          logo_public_id = ?,
          logo_file_type = ?,
          logo_format = ?,
          location = ?
        WHERE id = ?
          AND owner_id = ?
      `,
      [
        name,
        tagline || null,
        description || null,
        industry || null,
        website_url || null,
        logo_url || null,
        logo_public_id || null,
        logo_file_type || null,
        logo_format || null,
        location || null,
        companyId,
        ownerId,
      ],
    );

    await query(
      "UPDATE users SET role = 'employer' WHERE id = ? AND role = 'user'",
      [ownerId],
    );

    return {
      success: true,
      companyId,
    };
  }

  await query(
    `
      INSERT INTO companies (
        id,
        owner_id,
        name,
        tagline,
        description,
        industry,
        website,
        logo_url,
        logo_public_id,
        logo_file_type,
        logo_format,
        location
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      id,
      ownerId,
      name,
      tagline || null,
      description || null,
      industry || null,
      website_url || null,
      logo_url || null,
      logo_public_id || null,
      logo_file_type || null,
      logo_format || null,
      location || null,
    ],
  );

  await query(
    "UPDATE users SET role = 'employer' WHERE id = ? AND role = 'user'",
    [ownerId],
  );

  return {
    success: true,
    companyId: id,
  };
}
/**
 * Update a specific company.
 */
export async function updateMysqlCompany(companyId, ownerId, companyData) {
  const {
    name,
    tagline,
    description,
    industry,
    website_url,
    logo_url,
    logo_public_id,
    logo_file_type,
    logo_format,
    location,
  } = companyData;

  const sql = `
    UPDATE companies
    SET
      name = ?,
      tagline = ?,
      description = ?,
      industry = ?,
      website = ?,
      logo_url = ?,
      logo_public_id = ?,
      logo_file_type = ?,
      logo_format = ?,
      location = ?
    WHERE id = ?
      AND owner_id = ?
  `;

  const result = await query(sql, [
    name,
    tagline || null,
    description || null,
    industry || null,
    website_url || null,
    logo_url || null,
    logo_public_id || null,
    logo_file_type || null,
    logo_format || null,
    location || null,
    companyId,
    ownerId,
  ]);

  return {
    success: true,
    companyId,
    affectedRows: result[0]?.affectedRows || 0,
  };
}

/**
 * Fetch every company owned by an employer.
 */
export async function fetchMysqlCompaniesByOwner(ownerId) {
  try {
    const rows = await query(
      `
        SELECT *
        FROM companies
        WHERE owner_id = ?
        ORDER BY created_at DESC
      `,
      [ownerId],
    );

    return rows || [];
  } catch (error) {
    console.error("❌ MySQL Companies Fetch Fault:", error.message);

    throw error;
  }
}

/**
 * Fetch one company belonging to a specific employer.
 */
export async function fetchMysqlCompanyById(companyId, ownerId) {
  try {
    const rows = await query(
      `
        SELECT *
        FROM companies
        WHERE id = ?
          AND owner_id = ?
        LIMIT 1
      `,
      [companyId, ownerId],
    );

    return rows?.[0] || null;
  } catch (error) {
    console.error("❌ MySQL Company By ID Fetch Fault:", error.message);

    throw error;
  }
}

/**
 * Delete a company belonging to the current employer.
 */
export async function deleteMysqlCompany(companyId, ownerId) {
  const result = await query(
    `
      DELETE FROM companies
      WHERE id = ?
        AND owner_id = ?
    `,
    [companyId, ownerId],
  );

  return {
    success: true,
    affectedRows: result[0]?.affectedRows || 0,
  };
}
export async function fetchMysqlCompanyByOwner(ownerId) {
  try {
    const rows = await query(
      "SELECT * FROM companies WHERE owner_id = ? ORDER BY created_at DESC",
      [ownerId],
    );

    return rows || [];
  } catch (error) {
    console.error("❌ MySQL Company Fetch Fault:", error.message);

    throw error;
  }
}
