import { query } from "@/lib/db";

/* =========================
   APPLICATIONS
========================= */

export async function insertMysqlApplication({
  id,
  job_id,
  applicant_id,
  full_name,
  email,
  phone,
  github_repo,
  portfolio_link,
  cv_url,
  bio,
  cover_letter,
}) {
  const existing = await checkMysqlExistingApplication(job_id, applicant_id);

  if (existing) {
    throw new Error(
      existing.status === "WITHDRAWN"
        ? "You previously applied for this opportunity and withdrew the application. You cannot apply again."
        : `You have already applied for this opportunity. Current status: ${existing.status}.`,
    );
  }

  const sql = `
    INSERT INTO job_applications (
      id, job_id, applicant_id, full_name, email, phone,
      github_repo, portfolio_link, cv_url, bio, cover_letter, status
    )
    SELECT ?, j.id, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'PENDING'
    FROM jobs j
    WHERE j.id = ?
      AND j.status = 'OPEN'
      AND (j.deadline IS NULL OR j.deadline >= CURDATE())
      AND (
        SELECT COUNT(*)
        FROM job_applications
        WHERE job_id = j.id
      ) < j.max_applicants
    LIMIT 1
  `;

  try {
    const result = await query(sql, [
      id,
      applicant_id,
      full_name || null,
      email || null,
      phone || null,
      github_repo || null,
      portfolio_link || null,
      cv_url || null,
      bio || null,
      cover_letter || null,
      job_id,
    ]);

    if (!result?.affectedRows) {
      throw new Error("This opportunity is no longer accepting applications.");
    }

    return { success: true, insertId: id };
  } catch (error) {
    if (
      error?.code === "ER_DUP_ENTRY" ||
      error?.message?.toLowerCase().includes("unique_application")
    ) {
      throw new Error("You have already applied for this opportunity.");
    }

    throw error;
  }
}

export async function checkMysqlExistingApplication(jobId, userId) {
  const sql = `
    SELECT id, job_id, status, applied_at
    FROM job_applications
    WHERE job_id = ?
      AND applicant_id = ?
    LIMIT 1
  `;

  const rows = await query(sql, [jobId, userId]);
  return rows?.[0] || null;
}

export async function fetchMysqlSeekerApplications(userId) {
  const sql = `
    SELECT
      ja.*,
      j.title AS job_title,
      j.employment_type,
      j.listing_type,
      j.location AS job_location,
      j.salary AS job_salary,
      j.deadline AS job_deadline,
      j.status AS job_status,
      c.name AS company_name,
      c.logo_url
    FROM job_applications ja
    JOIN jobs j ON ja.job_id = j.id
    LEFT JOIN companies c ON j.company_id = c.id
    WHERE ja.applicant_id = ?
    ORDER BY ja.applied_at DESC
  `;

  const rows = await query(sql, [userId]);
  return rows || [];
}

export async function fetchMysqlSeekerApplicationDetails(
  applicationId,
  userId,
) {
  const sql = `
    SELECT
      ja.id AS application_id,
      ja.job_id,
      ja.applicant_id,
      ja.full_name,
      ja.email,
      ja.phone,
      ja.github_repo,
      ja.portfolio_link,
      ja.cv_url,
      ja.bio,
      ja.cover_letter,
      ja.status,
      ja.rejection_reason,
      ja.employer_feedback,
      ja.applied_at,
      

      j.title AS job_title,
      j.description AS job_description,
      j.employment_type,
      j.listing_type,
      j.location,
      j.salary,
      j.deadline,
      j.status AS job_status,
      j.max_applicants,

      c.id AS company_id,
      c.name AS company_name,
      c.logo_url AS company_logo

    FROM job_applications ja
    JOIN jobs j ON ja.job_id = j.id
    LEFT JOIN companies c ON j.company_id = c.id
    WHERE ja.id = ?
      AND ja.applicant_id = ?
    LIMIT 1
  `;

  const rows = await query(sql, [applicationId, userId]);
  return rows?.[0] || null;
}

export async function removeMysqlApplication(applicationId, userId) {
  const sql = `
    DELETE FROM job_applications
    WHERE id = ?
      AND applicant_id = ?
      AND status = 'PENDING'
  `;

  const result = await query(sql, [applicationId, userId]);

  if (!result?.affectedRows) {
    throw new Error(
      "This application cannot be withdrawn because it is no longer pending.",
    );
  }

  return result;
}

/* =========================
   SEEKER PROFILE
========================= */

export async function checkSeekerProfileExists(userId) {
  const sql = `
    SELECT id
    FROM users
    WHERE id = ?
      AND headline IS NOT NULL
      AND headline != ''
      AND bio IS NOT NULL
      AND bio != ''
    LIMIT 1
  `;

  const rows = await query(sql, [userId]);
  return Boolean(rows?.length);
}

export async function updateMysqlSeekerPreferences(userId, preferences) {
  const { headline, interest_field } = preferences;

  const sql = `
    UPDATE users
    SET headline = ?, interest_field = ?
    WHERE id = ?
  `;

  const [result] = await query(sql, [
    headline || null,
    interest_field || "General",
    userId,
  ]);

  return result;
}

export async function createMysqlSeekerProfile({
  userId,
  headline,
  bio,
  location,
  github_handle,
  website_url,
}) {
  const sql = `
    UPDATE users
    SET
      headline = ?,
      bio = ?,
      location = ?,
      github_handle = ?,
      website_url = ?
    WHERE id = ?
  `;

  const [result] = await query(sql, [
    headline || null,
    bio || null,
    location || null,
    github_handle || null,
    website_url || null,
    userId,
  ]);

  return result;
}
