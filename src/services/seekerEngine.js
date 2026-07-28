import crypto from "crypto";
import * as seekerRepo from "./mysql/seekerService";

export const seekerEngine = {
  /**
   * 📨 SUBMIT JOB OR COLLABORATION APPLICATION
   */
  applyToJob: async (payload) => {
    const generatedApplicationId = crypto.randomUUID();

    const unifiedPayload = {
      ...payload,
      id: generatedApplicationId,
    };

    return await seekerRepo.insertMysqlApplication(unifiedPayload);
  },

  /**
   * 📊 FETCH CANDIDATE APPLICATION TRACKER
   */
  getSeekerApplications: async (userId) => {
    return await seekerRepo.fetchMysqlSeekerApplications(userId);
  },

  /**
   * ❌ WITHDRAW APPLICATION
   */
  withdrawApplication: async (applicationId, userId) => {
    return await seekerRepo.removeMysqlApplication(applicationId, userId);
  },

  getMarketplaceListings: async (typeFilter, searchKeyword) => {
    return await seekerRepo.fetchMysqlMarketplaceListings(
      typeFilter,
      searchKeyword,
    );
  },
  hasSeekerProfile: async (userId) => {
    return await seekerRepo.checkSeekerProfileExists(userId);
  },

  // Focus seeker-specific updates on professional attributes stored in users table
  updateSeekerPreferences: async (userId, preferences) => {
    return await seekerRepo.updateMysqlSeekerPreferences(userId, preferences);
  },
};
