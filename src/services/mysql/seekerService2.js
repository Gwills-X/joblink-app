import { query } from "@/lib/db";

/* =========================
   MARKETPLACE
========================= */

export async function fetchMysqlMarketplaceListings(
  typeFilter,
  searchKeyword,
  userId = null,
) {
  let sql = `
    SELECT
      j.*,
      c.name AS company_name,
      c.logo_url,
      COUNT(DISTINCT ja.id) AS applicant_count,
      GREATEST(
        j.max_applicants - COUNT(DISTINCT ja.id),
        0
      ) AS remaining_slots
  `;

  if (userId) {
    sql += `,
      MAX(
        EXISTS(
          SELECT 1 FROM follows f
          WHERE f.follower_id = ? AND f.followed_id = j.posted_by
        )
      ) AS isFollowing,
      MAX(
        CASE
          WHEN myapp.id IS NOT NULL THEN 1
          ELSE 0
        END
      ) AS already_applied,
      MAX(myapp.id) AS my_application_id,
      MAX(myapp.status) AS my_application_status,
      MAX(EXISTS(
        SELECT 1 FROM saved_jobs sj
        WHERE sj.user_id = ? AND sj.job_id = j.id
      )) AS is_saved
    `;
  }

  sql += `
    FROM jobs j
    LEFT JOIN companies c
      ON j.company_id = c.id
    LEFT JOIN job_applications ja
      ON ja.job_id = j.id
  `;

  if (userId) {
    sql += `
      LEFT JOIN job_applications myapp
        ON myapp.job_id = j.id
       AND myapp.applicant_id = ?
    `;
  }

  sql += `
    WHERE j.status = 'OPEN'
      AND (j.deadline IS NULL OR j.deadline >= CURDATE())
  `;

  const params = [];

  if (userId) {
    params.push(userId, userId, userId);
  }

  if (typeFilter && typeFilter !== "ALL") {
    sql += ` AND j.listing_type = ?`;
    params.push(typeFilter);
  }

  if (searchKeyword) {
    const wildcard = `%${searchKeyword}%`;

    sql += `
      AND (
        j.title LIKE ?
        OR j.description LIKE ?
        OR c.name LIKE ?
        OR j.location LIKE ?
        OR j.listing_type LIKE ?
        OR j.employment_type LIKE ?
      )
    `;

    params.push(wildcard, wildcard, wildcard, wildcard, wildcard, wildcard);
  }

  sql += `
    GROUP BY j.id
    HAVING (
      j.max_applicants - COUNT(DISTINCT ja.id)
    ) > 0
    ORDER BY j.created_at DESC
  `;

  const rows = await query(sql, params);
  return rows || [];
}

/* =========================
   SINGLE JOB
========================= */

export async function fetchMysqlJobListingById(jobId, userId = null) {
  let sql = `
    SELECT
      j.*,
      c.id AS company_id,
      c.name AS company_name,
      c.logo_url AS company_logo,
      (SELECT COUNT(*) FROM job_applications ja_count WHERE ja_count.job_id = j.id) AS applicant_count,
      CASE
        WHEN j.status = 'OPEN'
         AND (j.deadline IS NULL OR j.deadline >= CURDATE())
         AND (SELECT COUNT(*) FROM job_applications ja_count WHERE ja_count.job_id = j.id) < j.max_applicants
        THEN 1 ELSE 0
      END AS is_available,
      CASE WHEN j.deadline IS NOT NULL AND j.deadline < CURDATE() THEN 1 ELSE 0 END AS is_expired
  `;

  if (userId) {
    sql += `,
      ja.id AS my_application_id,
      ja.status AS my_application_status,
      ja.applied_at AS my_application_date,
      EXISTS(
        SELECT 1 FROM saved_jobs sj
        WHERE sj.user_id = ? AND sj.job_id = j.id
      ) AS is_saved
    `;
  }

  sql += `
    FROM jobs j
    LEFT JOIN companies c
      ON j.company_id = c.id
  `;

  if (userId) {
    sql += `
      LEFT JOIN job_applications ja
        ON ja.job_id = j.id
       AND ja.applicant_id = ?
    `;
  }

  sql += `
    WHERE j.id = ?
    LIMIT 1
  `;

  const params = userId ? [userId, userId, jobId] : [jobId];
  const rows = await query(sql, params);

  return rows?.[0] || null;
}
