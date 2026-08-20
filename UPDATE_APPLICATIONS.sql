-- Update job_applications table to support full application details and rejection feedback
-- Run this in TablePlus after the initial schema is created

-- Add missing columns to job_applications if they don't exist
ALTER TABLE `job_applications` ADD COLUMN `full_name` varchar(255) DEFAULT NULL AFTER `cover_letter`;
ALTER TABLE `job_applications` ADD COLUMN `email` varchar(255) DEFAULT NULL AFTER `full_name`;
ALTER TABLE `job_applications` ADD COLUMN `phone` varchar(20) DEFAULT NULL AFTER `email`;
ALTER TABLE `job_applications` ADD COLUMN `github_repo` varchar(255) DEFAULT NULL AFTER `phone`;
ALTER TABLE `job_applications` ADD COLUMN `portfolio_link` varchar(255) DEFAULT NULL AFTER `github_repo`;
ALTER TABLE `job_applications` ADD COLUMN `cv_url` varchar(255) DEFAULT NULL AFTER `portfolio_link`;
ALTER TABLE `job_applications` ADD COLUMN `bio` text DEFAULT NULL AFTER `cv_url`;

-- Add rejection details columns
ALTER TABLE `job_applications` ADD COLUMN `rejection_feedback` text DEFAULT NULL AFTER `employer_feedback`;
ALTER TABLE `job_applications` ADD COLUMN `rejection_date` timestamp NULL DEFAULT NULL AFTER `rejection_feedback`;
ALTER TABLE `job_applications` ADD COLUMN `accepted_at` timestamp NULL DEFAULT NULL AFTER `rejection_date`;

-- Add an index for status to speed up filtering
ALTER TABLE `job_applications` ADD INDEX `idx_status` (`status`);

-- Verify the final structure has the columns we need:
-- DESCRIBE job_applications;
