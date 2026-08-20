import crypto from "crypto";
import * as mysqlRepo from "./mysql/employerService";
import * as mysqlRepo2 from "./mysql/employerService2";
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

  // applications

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

  getApplicationDetailsForReview: async (applicationId, employerId) => {
    return await mysqlRepo2.fetchMysqlApplicationDetails(
      applicationId,
      employerId,
    );
  },

  rejectApplication: async ({
    applicationId,
    employerId,
    rejectionFeedback,
  }) => {
    return await mysqlRepo2.updateMysqlApplicationRejection(
      applicationId,
      employerId,
      rejectionFeedback,
    );
  },

  acceptApplication: async (applicationId, employerId, employerFeedback) => {
    return await mysqlRepo2.updateMysqlApplicationAcceptance(
      applicationId,
      employerId,
      employerFeedback,
    );
  },

  getEmployerApplications: async (employerId) => {
    return await mysqlRepo2.fetchMysqlEmployerApplications(employerId);
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
