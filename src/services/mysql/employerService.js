import { query } from "@/lib/db";
import crypto from "crypto";

/**
 * Inserts a new job or collaboration listing into MySQL
 */
export async function insertMysqlJob(employerId, jobData) {
  const {
    id = crypto.randomUUID(),
    company_id,
    title,
    description,
    employment_type = "FULL_TIME",
    location,
    salary,
    deadline,
    max_applicants,
    listing_type = "JOB",
  } = jobData;

  const sanitizedCompanyId =
    company_id && company_id !== "" ? company_id : null;

  if (sanitizedCompanyId) {
    const ownedCompanyRows = await query(
      "SELECT id FROM companies WHERE id = ? AND owner_id = ? LIMIT 1",
      [sanitizedCompanyId, employerId],
    );

    if (!ownedCompanyRows || ownedCompanyRows.length === 0) {
      throw new Error("You do not own the selected company profile.");
    }
  }

  const sql = `
    INSERT INTO jobs (id, company_id, posted_by, title, description, employment_type, location, salary, deadline, max_applicants, listing_type, status) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'OPEN')
  `;

  await query(sql, [
    id,
    sanitizedCompanyId,
    employerId,
    title,
    description,
    employment_type,
    location || null,
    salary || null,
    deadline || null,
    max_applicants || 50,
    listing_type,
  ]);

  return { success: true, insertId: id };
}

/**
 * Fetches employer jobs with active live applicant counters
 */
export async function fetchMysqlEmployerJobs(userId) {
  try {
    const sql = `
      SELECT j.*, 
      c.name as company_name,
      (SELECT COUNT(*) FROM job_applications ja WHERE ja.job_id = j.id) as applicant_count
      FROM jobs j
      LEFT JOIN companies c ON j.company_id = c.id
      WHERE j.posted_by = ?
      ORDER BY j.created_at DESC
    `;
    const rows = await query(sql, [userId]);
    return rows || [];
  } catch (error) {
    console.error("❌ MySQL Employer Jobs Fetch Fault:", error.message);
    throw error;
  }
}

/**
 * Fetches a specific job by ID ensuring it belongs to the employer
 */
export async function fetchMysqlJobById(jobId, employerId) {
  try {
    const sql = `
      SELECT j.*, c.name as company_name 
      FROM jobs j
      LEFT JOIN companies c ON j.company_id = c.id
      WHERE j.id = ? AND j.posted_by = ?
    `;
    const rows = await query(sql, [jobId, employerId]);
    return rows?.[0] || null;
  } catch (error) {
    console.error("❌ MySQL Fetch Job By ID Fault:", error.message);
    throw error;
  }
}

/**
 * Fetches all applicants for a specific job posting
 */
export async function fetchMysqlJobApplicants(jobId) {
  try {
    const sql = `
      SELECT ja.*, 
      u.name as candidate_name, 
      u.email as candidate_email,
      u.headline as seeker_title, 
      u.website_url as portfolio_url, 
      u.interest_field as skills,
      u.profile_pic_url
      FROM job_applications ja
      JOIN users u ON ja.applicant_id = u.id
      WHERE ja.job_id = ?
      ORDER BY ja.applied_at DESC
    `;
    const rows = await query(sql, [jobId]);
    return rows || [];
  } catch (error) {
    console.error("❌ MySQL Fetch Job Applicants Fault:", error.message);
    throw error;
  }
}

/**
 * Updates an existing job record with ownership verification
 */
export async function modifyMysqlJob(postId, userId, updateData) {
  try {
    const {
      title,
      description,
      employment_type,
      location,
      salary,
      deadline,
      max_applicants,
      status,
      company_id,
    } = updateData;

    if (company_id && company_id !== "") {
      const ownedCompanyRows = await query(
        "SELECT id FROM companies WHERE id = ? AND owner_id = ? LIMIT 1",
        [company_id, userId],
      );

      if (!ownedCompanyRows || ownedCompanyRows.length === 0) {
        throw new Error("You do not own the selected company profile.");
      }
    }

    const sql = `
      UPDATE jobs 
      SET title = ?, description = ?, employment_type = ?, location = ?, salary = ?, deadline = ?, max_applicants = ?, status = ? 
      WHERE id = ? AND posted_by = ?
    `;

    return await query(sql, [
      title,
      description,
      employment_type,
      location || null,
      salary || null,
      deadline || null,
      max_applicants || 50,
      status || "OPEN",
      postId,
      userId,
    ]);
  } catch (error) {
    console.error("❌ MySQL Job Modification Fault:", error.message);
    throw error;
  }
}

/**
 * Deletes an employer job listing
 */
export async function removeMysqlJob(postId, userId) {
  try {
    return await query("DELETE FROM jobs WHERE id = ? AND posted_by = ?", [
      postId,
      userId,
    ]);
  } catch (error) {
    console.error("❌ MySQL Job Deletion Fault:", error.message);
    throw error;
  }
}

/**
 * Fetches company profile for employer onboarding checks
 */
export async function fetchCompanyProfile(userId) {
  try {
    const rows = await query(
      "SELECT * FROM companies WHERE owner_id = ? LIMIT 1",
      [userId],
    );
    return rows?.[0] || null;
  } catch (error) {
    console.error("❌ Company Profile Fetch Fault:", error.message);
    return null;
  }
}

/**
 * Updates a job applicant's status and feedback notes in MySQL
 */
export async function updateMysqlApplicationReview(
  applicationId,
  employerId,
  status,
  employerFeedback,
) {
  try {
    const checkSql = `
      SELECT ja.id, ja.status
      FROM job_applications ja
      INNER JOIN jobs j
        ON ja.job_id = j.id
      WHERE ja.id = ?
        AND j.posted_by = ?
      LIMIT 1
    `;

    const rows = await query(checkSql, [applicationId, employerId]);

    if (!rows || rows.length === 0) {
      throw new Error("Unauthorized or application not found.");
    }

    const updateSql = `
      UPDATE job_applications
      SET
        status = ?,
        employer_feedback = ?,
        rejection_reason = ?
      WHERE id = ?
        AND EXISTS (
          SELECT 1 FROM jobs j
          WHERE j.id = job_applications.job_id AND j.posted_by = ?
        )
    `;

    const rejectionReason =
      status === "REJECTED" ? employerFeedback || null : null;

    const result = await query(updateSql, [
      status,
      employerFeedback || null,
      rejectionReason,
      applicationId,
      employerId,
    ]);

    return {
      success: true,
      result,
    };
  } catch (error) {
    console.error("❌ MySQL Application Review Update Fault:", error.message);

    throw error;
  }
}

export async function checkCompanyProfileExists(userId) {
  try {
    const rows = await query(
      "SELECT id FROM companies WHERE owner_id = ? LIMIT 1",
      [userId],
    );
    return Boolean(rows && rows.length > 0);
  } catch (error) {
    console.error("❌ Company Profile Check Fault:", error.message);
    return false;
  }
}
