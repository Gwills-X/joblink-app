import crypto from "crypto";
import * as seekerRepo from "./mysql/seekerService";
import * as seekerRepo2 from "./mysql/seekerService2";

export const seekerEngine = {
  /* =========================
     APPLICATIONS
  ========================= */

  applyToJob: async (payload) => {
    const id = crypto.randomUUID();

    return seekerRepo.insertMysqlApplication({
      ...payload,
      id,
    });
  },

  getSeekerApplications: async (userId) => {
    return seekerRepo.fetchMysqlSeekerApplications(userId);
  },

  getSeekerApplicationDetails: async (applicationId, userId) => {
    return seekerRepo.fetchMysqlSeekerApplicationDetails(applicationId, userId);
  },

  getApplicationForJob: async (jobId, userId) => {
    return seekerRepo.checkMysqlExistingApplication(jobId, userId);
  },

  checkExistingApplication: async (jobId, userId) => {
    return seekerRepo.checkMysqlExistingApplication(jobId, userId);
  },

  withdrawApplication: async (applicationId, userId) => {
    return seekerRepo.removeMysqlApplication(applicationId, userId);
  },

  /* =========================
     MARKETPLACE
  ========================= */

  getMarketplaceListings: async (typeFilter, searchKeyword, userId = null) => {
    return seekerRepo2.fetchMysqlMarketplaceListings(
      typeFilter,
      searchKeyword,
      userId,
    );
  },

  getJobListingById: async (jobId, userId = null) => {
    return seekerRepo2.fetchMysqlJobListingById(jobId, userId);
  },

  /* =========================
     PROFILE
  ========================= */

  hasSeekerProfile: async (userId) => {
    return seekerRepo.checkSeekerProfileExists(userId);
  },

  updateSeekerPreferences: async (userId, preferences) => {
    return seekerRepo.updateMysqlSeekerPreferences(userId, preferences);
  },

  createSeekerProfile: async (profileData) => {
    return seekerRepo.createMysqlSeekerProfile(profileData);
  },
};
