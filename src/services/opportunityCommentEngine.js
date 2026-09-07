import crypto from "crypto";
import * as opportunityCommentRepo from "./mysql/opportunityCommentService";

export const opportunityCommentEngine = {
  getComments: async (opportunityId) =>
    opportunityCommentRepo.fetchMysqlOpportunityComments(opportunityId),

  createComment: async ({ opportunityId, userId, parentId, content }) =>
    opportunityCommentRepo.insertMysqlOpportunityComment({
      id: crypto.randomUUID(),
      opportunityId,
      userId,
      parentId,
      content,
    }),

  getCommentById: async (commentId) =>
    opportunityCommentRepo.fetchMysqlOpportunityCommentById(commentId),

  deleteComment: async (commentId) =>
    opportunityCommentRepo.deleteMysqlOpportunityComment(commentId),
};
