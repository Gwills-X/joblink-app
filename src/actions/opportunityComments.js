"use server";

import { revalidatePath } from "next/cache";
import getAuthUser from "@/lib/getAuthUser";
import { opportunityCommentEngine } from "@/services/opportunityCommentEngine";

function getUserId(user) {
  return String(user.userId || user.id);
}

export async function createOpportunityComment(formData) {
  const user = await getAuthUser();
  if (!user) return { success: false, error: "Please sign in to comment." };

  const opportunityId = String(formData.get("opportunity_id") || "").trim();
  const parentValue = String(formData.get("parent_id") || "").trim();
  const content = String(formData.get("content") || "").trim();

  if (!opportunityId || !content) {
    return { success: false, error: "A comment cannot be empty." };
  }

  if (content.length > 5000) {
    return {
      success: false,
      error: "Comments must be 5,000 characters or fewer.",
    };
  }

  const parentId = parentValue || null;

  try {
    if (parentId) {
      const parentComment =
        await opportunityCommentEngine.getCommentById(parentId);
      if (
        !parentComment ||
        String(parentComment.opportunity_id) !== String(opportunityId)
      ) {
        return { success: false, error: "The reply target is invalid." };
      }
    }

    await opportunityCommentEngine.createComment({
      opportunityId,
      userId: getUserId(user),
      parentId,
      content,
    });
    revalidatePath(`/jobs/${opportunityId}`);
    return { success: true };
  } catch (error) {
    console.error("Opportunity comment creation failed:", error);
    return { success: false, error: "Unable to publish this comment." };
  }
}

export async function deleteOpportunityComment(commentId, opportunityId) {
  const user = await getAuthUser();
  if (!user) return { success: false, error: "Authentication required." };

  try {
    const comment = await opportunityCommentEngine.getCommentById(commentId);
    if (!comment || String(comment.opportunity_id) !== String(opportunityId)) {
      return { success: false, error: "Comment not found." };
    }

    if (String(comment.user_id) !== getUserId(user)) {
      return {
        success: false,
        error: "You can only delete your own comments.",
      };
    }

    await opportunityCommentEngine.deleteComment(commentId);
    revalidatePath(`/jobs/${opportunityId}`);
    return { success: true };
  } catch (error) {
    console.error("Opportunity comment deletion failed:", error);
    return { success: false, error: "Unable to delete this comment." };
  }
}
