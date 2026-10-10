import { query } from "@/lib/db";
import crypto from "crypto";

/**
 * Fetches all applications submitted to jobs owned by an employer.
 *
 * This query is intentionally restricted by j.posted_by so an employer
 * can only see applications belonging to their own job listings.
 */
export async function fetchMysqlEmployerApplications(employerId) {
  try {
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
        ja.applied_at,

        j.title AS job_title,
        j.listing_type,
        j.employment_type,
        j.location,
        j.salary,
        j.status AS job_status,
        j.deadline,

        c.id AS company_id,
        c.name AS company_name,

        u.name AS candidate_name,
        u.email AS candidate_email,
        u.phone AS candidate_phone,
        u.headline AS seeker_title,
        u.bio AS seeker_bio,
        u.website_url AS candidate_website,
        u.github_handle,
        u.interest_field,
        u.profile_pic_url

      FROM job_applications ja

      INNER JOIN jobs j
        ON ja.job_id = j.id

      INNER JOIN users u
        ON ja.applicant_id = u.id

      LEFT JOIN companies c
        ON j.company_id = c.id

      WHERE j.posted_by = ?

      ORDER BY ja.applied_at DESC
    `;

    const rows = await query(sql, [employerId]);

    return rows || [];
  } catch (error) {
    console.error("❌ MySQL Employer Applications Fetch Fault:", error.message);

    throw error;
  }
}

export async function fetchMysqlApplicationDetails(applicationId, employerId) {
  try {
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
        ja.applied_at,

        j.title AS job_title,
        j.description AS job_description,
        j.listing_type,
        j.employment_type,
        j.location,
        j.salary,
        j.deadline,
        j.status AS job_status,

        c.id AS company_id,
        c.name AS company_name,
        c.logo_url AS company_logo,

        u.name AS candidate_name,
        u.email AS candidate_email,
        u.phone AS candidate_phone,
        u.headline AS seeker_title,
        u.bio AS seeker_bio,
        u.website_url AS candidate_website,
        u.github_handle,
        u.interest_field,
        u.profile_pic_url

      FROM job_applications ja

      INNER JOIN jobs j
        ON ja.job_id = j.id

      INNER JOIN users u
        ON ja.applicant_id = u.id

      LEFT JOIN companies c
        ON j.company_id = c.id

      WHERE ja.id = ?
        AND j.posted_by = ?

      LIMIT 1
    `;

    const rows = await query(sql, [applicationId, employerId]);

    return rows?.[0] || null;
  } catch (error) {
    console.error("❌ MySQL Application Details Fetch Fault:", error.message);

    throw error;
  }
}

export async function updateMysqlApplicationRejection(
  applicationId,
  employerId,
  rejectionFeedback,
) {
  try {
    if (!rejectionFeedback?.trim()) {
      throw new Error("Rejection feedback is required.");
    }

    const checkSql = `
      SELECT ja.id
      FROM job_applications ja
      INNER JOIN jobs j
        ON ja.job_id = j.id
      WHERE ja.id = ?
        AND j.posted_by = ?
      LIMIT 1
    `;

    const existing = await query(checkSql, [applicationId, employerId]);

    if (!existing || existing.length === 0) {
      throw new Error("Unauthorized or application not found.");
    }

    const updateSql = `
  UPDATE job_applications
  SET
    status = 'REJECTED',
    rejection_reason = ?,
    employer_feedback = NULL
  WHERE id = ?
    AND EXISTS (
      SELECT 1 FROM jobs j
      WHERE j.id = job_applications.job_id AND j.posted_by = ?
    )
`;

    const result = await query(updateSql, [
      rejectionFeedback || null,
      applicationId,
      employerId,
    ]);

    return {
      success: true,
      result,
    };
  } catch (error) {
    console.error("❌ MySQL Application Rejection Fault:", error.message);

    throw error;
  }
}

export async function updateMysqlApplicationAcceptance(
  applicationId,
  employerId,
  employerFeedback,
) {
  try {
    const checkSql = `
      SELECT
        ja.id,
        ja.status
      FROM job_applications ja
      INNER JOIN jobs j
        ON ja.job_id = j.id
      WHERE ja.id = ?
        AND j.posted_by = ?
      LIMIT 1
    `;

    const existing = await query(checkSql, [applicationId, employerId]);

    if (!existing || existing.length === 0) {
      throw new Error("Unauthorized or application not found.");
    }

    const currentStatus = existing[0].status;

    if (currentStatus === "REJECTED") {
      throw new Error("A rejected application cannot be accepted.");
    }

    const updateSql = `
      UPDATE job_applications
      SET
        status = 'ACCEPTED',
        employer_feedback = ?,
        rejection_reason = NULL
      WHERE id = ?
        AND EXISTS (
          SELECT 1 FROM jobs j
          WHERE j.id = job_applications.job_id AND j.posted_by = ?
        )
    `;

    const result = await query(updateSql, [
      employerFeedback || null,
      applicationId,
      employerId,
    ]);

    return {
      success: true,
      result,
    };
  } catch (error) {
    console.error("❌ MySQL Application Acceptance Fault:", error.message);

    throw error;
  }
}
