import crypto from "crypto";
import * as mysqlRepo from "./mysql/employerService";

const DRIVER_TOKEN = process.env.DATABASE_PROVIDER || "MYSQL";

export const employerEngine = {
  createJobListing: async (employerId, jobData) => {
    const generatedJobId = crypto.randomUUID();
    const unifiedPayload = {
      ...jobData,
      id: generatedJobId,
      posted_by: employerId,
    };

    if (DRIVER_TOKEN === "FIREBASE") {
      throw new Error(
        "Firebase driver not mapped for employer engine recruitment schemas yet.",
      );
    }

    return await mysqlRepo.insertMysqlJob(employerId, unifiedPayload);
  },

  getEmployerJobs: async (userId) => {
    return await mysqlRepo.fetchMysqlEmployerJobs(userId);
  },

  getCompanyProfile: async (userId) => {
    return await mysqlRepo.fetchCompanyProfile(userId);
  },

  updateJobListing: async (postId, userId, updateData) => {
    return await mysqlRepo.modifyMysqlJob(postId, userId, updateData);
  },

  deleteJobListing: async (postId, userId) => {
    return await mysqlRepo.removeMysqlJob(postId, userId);
  },

  reviewApplication: async (
    applicationId,
    employerId,
    status,
    employerFeedback,
  ) => {
    return await mysqlRepo.updateMysqlApplicationReview(
      applicationId,
      employerId,
      status,
      employerFeedback,
    );
  },

  getJobById: async (jobId, employerId) => {
    return await mysqlRepo.fetchMysqlJobById(jobId, employerId);
  },

  getJobApplicants: async (jobId) => {
    return await mysqlRepo.fetchMysqlJobApplicants(jobId);
  },
  hasCompanyProfile: async (userId) => {
    return await mysqlRepo.checkCompanyProfileExists(userId);
  },
};
