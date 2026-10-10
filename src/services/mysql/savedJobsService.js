import crypto from "crypto";
import { query } from "@/lib/db";

export async function saveMysqlOpportunity(userId, jobId) {
  const jobs = await query("SELECT id FROM jobs WHERE id = ? LIMIT 1", [jobId]);
  if (!jobs?.length) return false;

  await query(
    `INSERT INTO saved_jobs (id, user_id, job_id)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE user_id = VALUES(user_id)`,
    [crypto.randomUUID(), userId, jobId],
  );

  return true;
}

export async function unsaveMysqlOpportunity(userId, jobId) {
  await query("DELETE FROM saved_jobs WHERE user_id = ? AND job_id = ?", [
    userId,
    jobId,
  ]);
  return true;
}

export async function fetchMysqlSavedOpportunities(userId) {
  const rows = await query(
    `SELECT
       j.id,
       j.title,
       j.description,
       j.listing_type,
       j.employment_type,
       j.location,
       j.salary,
       j.deadline,
       j.max_applicants,
       j.status,
       j.created_at,
       sj.created_at AS saved_at,
       c.name AS company_name,
       (SELECT COUNT(*) FROM job_applications ja WHERE ja.job_id = j.id) AS applicant_count,
       GREATEST(
         COALESCE(j.max_applicants, 0) -
         (SELECT COUNT(*) FROM job_applications ja WHERE ja.job_id = j.id),
         0
       ) AS remaining_slots,
       CASE
         WHEN j.status = 'OPEN'
          AND (j.deadline IS NULL OR j.deadline >= CURDATE())
          AND (SELECT COUNT(*) FROM job_applications ja WHERE ja.job_id = j.id) < j.max_applicants
         THEN 1 ELSE 0
       END AS is_available,
       CASE WHEN j.deadline IS NOT NULL AND j.deadline < CURDATE() THEN 1 ELSE 0 END AS is_expired,
       myapp.id AS application_id,
       myapp.status AS application_status
     FROM saved_jobs sj
     INNER JOIN jobs j ON j.id = sj.job_id
     LEFT JOIN companies c ON c.id = j.company_id
     LEFT JOIN job_applications myapp
       ON myapp.job_id = j.id AND myapp.applicant_id = ?
     WHERE sj.user_id = ?
     ORDER BY sj.created_at DESC`,
    [userId, userId],
  );

  return rows || [];
}
