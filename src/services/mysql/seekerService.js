import { query } from "@/lib/db";

/**
 * Inserts a new job or collaboration application into MySQL with extended candidate details
 */
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
  const jobRows = await query(
    `
    SELECT j.max_applicants, 
    (SELECT COUNT(*) FROM job_applications WHERE job_id = ?) as current_count
    FROM jobs j WHERE j.id = ?
  `,
    [job_id, job_id],
  );

  if (!jobRows || jobRows.length === 0) {
    throw new Error("Job listing not found.");
  }

  if (jobRows[0].current_count >= jobRows[0].max_applicants) {
    throw new Error("This position has reached its maximum applicant limit.");
  }

  const sql = `
    INSERT INTO job_applications 
    (id, job_id, applicant_id, full_name, email, phone, github_repo, portfolio_link, cv_url, bio, cover_letter, status) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'PENDING')
  `;
  await query(sql, [
    id,
    job_id,
    applicant_id,
    full_name || null,
    email || null,
    phone || null,
    github_repo || null,
    portfolio_link || null,
    cv_url || null,
    bio || null,
    cover_letter || null,
  ]);
  return { success: true, insertId: id };
}
/**
 * Fetches applications submitted by a user, pulling profile data directly from the users table
 */
export async function fetchMysqlSeekerApplications(userId) {
  try {
    const sql = `
      SELECT ja.*, 
      j.title as job_title, 
      j.employment_type, 
      j.listing_type,
      c.name as company_name, 
      c.logo_url
      FROM job_applications ja
      JOIN jobs j ON ja.job_id = j.id
      LEFT JOIN companies c ON j.company_id = c.id
      WHERE ja.applicant_id = ?
      ORDER BY ja.applied_at DESC
    `;
    const rows = await query(sql, [userId]);
    return rows || [];
  } catch (error) {
    console.error("❌ MySQL Seeker Applications Fetch Fault:", error.message);
    throw error;
  }
}

/**
 * Checks if a user has completed their professional seeker profile details
 */
export async function checkSeekerProfileExists(userId) {
  try {
    // In the unified setup, a seeker profile exists if the user has a headline or bio set up
    const rows = await query(
      "SELECT id FROM users WHERE id = ? AND (headline IS NOT NULL OR bio IS NOT NULL) LIMIT 1",
      [userId],
    );
    return Boolean(rows && rows.length > 0);
  } catch (error) {
    console.error("❌ Seeker Profile Check Fault:", error.message);
    return false;
  }
}

export async function removeMysqlApplication(applicationId, userId) {
  try {
    const sql = `
      DELETE FROM job_applications 
      WHERE id = ? AND applicant_id = ? AND status = 'PENDING'
    `;
    return await query(sql, [applicationId, userId]);
  } catch (error) {
    console.error("❌ MySQL Application Withdrawal Fault:", error.message);
    throw error;
  }
}

export async function fetchMysqlMarketplaceListings(typeFilter, searchKeyword) {
  try {
    let sql = `
      SELECT j.*, c.name as company_name, c.logo_url 
      FROM jobs j
      LEFT JOIN companies c ON j.company_id = c.id
      WHERE j.status = 'OPEN'
    `;
    const queryParams = [];

    if (typeFilter && typeFilter !== "ALL") {
      sql += ` AND j.listing_type = ?`;
      queryParams.push(typeFilter);
    }

    if (searchKeyword) {
      sql += ` AND (j.title LIKE ? OR j.description LIKE ? OR c.name LIKE ?)`;
      const wildcard = `%${searchKeyword}%`;
      queryParams.push(wildcard, wildcard, wildcard);
    }

    sql += ` ORDER BY j.created_at DESC`;

    const rows = await query(sql, queryParams);
    return rows || [];
  } catch (error) {
    console.error("❌ MySQL Marketplace Feed Fetch Fault:", error.message);
    throw error;
  }
}

export async function updateMysqlSeekerPreferences(userId, preferences) {
  try {
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
  } catch (error) {
    console.error("❌ MySQL Seeker Preferences Update Fault:", error.message);
    throw error;
  }
}

/**
 * Fetches a single job listing by ID with company info
 */
export async function fetchMysqlJobListingById(jobId) {
  try {
    const sql = `
      SELECT j.*, c.name as company_name, c.logo_url 
      FROM jobs j
      LEFT JOIN companies c ON j.company_id = c.id
      WHERE j.id = ?
      LIMIT 1
    `;
    const rows = await query(sql, [jobId]);
    return rows && rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error("❌ MySQL Single Job Fetch Fault:", error.message);
    throw error;
  }
}
