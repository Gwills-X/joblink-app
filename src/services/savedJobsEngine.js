import * as mysqlRepo from "./mysql/savedJobsService";

export const savedJobsEngine = {
  save: (userId, jobId) => mysqlRepo.saveMysqlOpportunity(userId, jobId),
  unsave: (userId, jobId) => mysqlRepo.unsaveMysqlOpportunity(userId, jobId),
  list: (userId) => mysqlRepo.fetchMysqlSavedOpportunities(userId),
};
