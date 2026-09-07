import { query } from "@/lib/db";

export async function fetchMysqlOpportunityComments(opportunityId) {
  const rows = await query(
    `
      SELECT
        oc.id,
        oc.opportunity_id,
        oc.user_id,
        oc.parent_id,
        oc.content,
        oc.created_at,
        oc.updated_at,
        u.name AS author_name,
        u.profile_pic_url AS author_profile_pic
      FROM opportunity_comments oc
      INNER JOIN users u ON u.id = oc.user_id
      WHERE oc.opportunity_id = ?
      ORDER BY oc.created_at ASC
    `,
    [opportunityId],
  );

  return rows || [];
}

export async function insertMysqlOpportunityComment({
  id,
  opportunityId,
  userId,
  parentId,
  content,
}) {
  await query(
    `
      INSERT INTO opportunity_comments
        (id, opportunity_id, user_id, parent_id, content)
      VALUES (?, ?, ?, ?, ?)
    `,
    [id, opportunityId, userId, parentId, content],
  );

  return { success: true, insertId: id };
}

export async function fetchMysqlOpportunityCommentById(commentId) {
  const rows = await query(
    `
      SELECT id, opportunity_id, user_id, parent_id, content
      FROM opportunity_comments
      WHERE id = ?
      LIMIT 1
    `,
    [commentId],
  );

  return rows?.[0] || null;
}

export async function deleteMysqlOpportunityComment(commentId) {
  await query("DELETE FROM opportunity_comments WHERE id = ?", [commentId]);
  return { success: true };
}
