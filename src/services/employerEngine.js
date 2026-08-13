import crypto from "crypto";
import * as mysqlRepo from "./mysql/employerService";
import * as mysqlCompanyRepo from "./mysql/companyService";

const DRIVER_TOKEN = process.env.DATABASE_PROVIDER || "MYSQL";

export const employerEngine = {
  // ==========================================
  // JOBS
  // ==========================================

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

  updateJobListing: async (postId, userId, updateData) => {
    return await mysqlRepo.modifyMysqlJob(postId, userId, updateData);
  },

  deleteJobListing: async (postId, userId) => {
    return await mysqlRepo.removeMysqlJob(postId, userId);
  },

  getJobById: async (jobId, employerId) => {
    return await mysqlRepo.fetchMysqlJobById(jobId, employerId);
  },

  getJobApplicants: async (jobId) => {
    return await mysqlRepo.fetchMysqlJobApplicants(jobId);
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

  // ==========================================
  // COMPANIES
  // ==========================================

  createCompany: async (ownerId, companyData) => {
    return await mysqlCompanyRepo.createMysqlCompany(ownerId, companyData);
  },

  updateCompany: async (companyId, ownerId, companyData) => {
    return await mysqlCompanyRepo.updateMysqlCompany(
      companyId,
      ownerId,
      companyData,
    );
  },

  getCompanyProfile: async (userId) => {
    return await mysqlCompanyRepo.fetchMysqlCompanyByOwner(userId);
  },

  getCompanies: async (ownerId) => {
    return await mysqlCompanyRepo.fetchMysqlCompaniesByOwner(ownerId);
  },

  getCompanyById: async (companyId, ownerId) => {
    return await mysqlCompanyRepo.fetchMysqlCompanyById(companyId, ownerId);
  },

  deleteCompany: async (companyId, ownerId) => {
    return await mysqlCompanyRepo.deleteMysqlCompany(companyId, ownerId);
  },

  hasCompanyProfile: async (userId) => {
    return await mysqlRepo.checkCompanyProfileExists(userId);
  },
};
