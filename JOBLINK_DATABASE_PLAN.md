# JobLink Database Plan

## Overview

This project is not using Prisma. The app uses raw MySQL tables and query code
in `src/services/mysql/*`, `src/services/chatEngine.js`, and the auth/profile
actions.

Your current SQL dump (`vibeCred.sql`) only contains:

- `users`
- `posts`
- `likes`

That means you must add the rest of the tables the app expects before the
project will work correctly.

## Allowed table budget

Your app currently needs 10 tables. That leaves room for at most 2 extra tables
if you want additional features later, without exceeding your 12-table project
limit.

### Required tables (10 total)

1. `users`
2. `posts`
3. `likes`
4. `follows`
5. `companies`
6. `jobs`
7. `job_applications`
8. `chat_rooms`
9. `messages`
10. `chat_requests`

## Why each table is needed

- `users`: authentication, profile data, role-based access, chat sender
  identity.
- `posts`: social feed posts, comments, media attachments, content moderation.
- `likes`: post reactions/saved social engagement.
- `follows`: user follow relationships used by social network features.
- `companies`: employer/company profile data and owner relationship.
- `jobs`: marketplace listings, including company, employer, status, max
  applicants, deadline.
- `job_applications`: application tracking for job listings with recruiter
  feedback.
- `chat_rooms`: chat session containers between two users.
- `messages`: actual chat messages inside rooms.
- `chat_requests`: consent flow for opening chat connections.

## Important change notes

- The app code currently expects `job_applications.employer_feedback` in
  employer review flows.
- The app also uses `jobs.company_id` as optional, so `jobs` must allow
  `company_id = NULL`.
- `follows` and `likes` are required for social network features, even though
  your dump has only `likes`.
- `chat_requests` is required if you want to use the existing chat/request logic
  rather than open messaging.
- `users.role` is used by navigation and access rules, so keep it in `users`.
- Ignore `prisma/schema.prisma` if you are not using Prisma; it is not the
  source of truth for your app.

## Use only one `posts` table

The markdown you sent contained two duplicate `posts` table definitions. Create
only one `posts` table; duplicates will cause an error.

## Recommended SQL table definitions

### `users`

```sql
CREATE TABLE `users` (
  `id` varchar(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `profile_pic_url` varchar(255) DEFAULT NULL,
  `role` enum('user','employer','recruiter','admin') NOT NULL DEFAULT 'user',
  `bio` text,
  `github_handle` varchar(100) DEFAULT NULL,
  `website_url` varchar(255) DEFAULT NULL,
  `location` varchar(100) DEFAULT NULL,
  `interest_field` varchar(100) NOT NULL DEFAULT 'General',
  `headline` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `is_verified` tinyint(1) NOT NULL DEFAULT '0',
  `profile_visibility` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
```

### `posts`

```sql
CREATE TABLE `posts` (
  `id` varchar(36) NOT NULL,
  `authorId` varchar(36) NOT NULL,
  `author` varchar(255) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `content` text NOT NULL,
  `parent_id` varchar(36) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `file_type` varchar(20) NOT NULL DEFAULT 'none',
  `format` varchar(10) DEFAULT NULL,
  `media_url` varchar(255) DEFAULT NULL,
  `public_id` varchar(255) DEFAULT NULL,
  `category` varchar(50) NOT NULL DEFAULT 'General',
  `type` varchar(50) NOT NULL DEFAULT 'POST',
  `company_id` varchar(36) DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_edited` tinyint(1) NOT NULL DEFAULT '0',
  `allow_comments` tinyint(1) NOT NULL DEFAULT '1',
  `status` enum('ACTIVE','HIDDEN','DELETED') NOT NULL DEFAULT 'ACTIVE',
  PRIMARY KEY (`id`),
  KEY `idx_company_id` (`company_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
```

### `likes`

```sql
CREATE TABLE `likes` (
  `user_id` varchar(36) NOT NULL,
  `post_id` varchar(36) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `reaction_type` enum('LIKE','CELEBRATE','SUPPORT','INSIGHTFUL') NOT NULL DEFAULT 'LIKE',
  PRIMARY KEY (`user_id`,`post_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
```

### `follows`

```sql
CREATE TABLE `follows` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `follower_id` varchar(36) NOT NULL,
  `followed_id` varchar(36) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_follow` (`follower_id`,`followed_id`),
  KEY `idx_follower_id` (`follower_id`),
  KEY `idx_followed_id` (`followed_id`),
  CONSTRAINT `fk_follower` FOREIGN KEY (`follower_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_followed` FOREIGN KEY (`followed_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
```

### `companies`

```sql
CREATE TABLE `companies` (
  `id` varchar(36) NOT NULL,
  `owner_id` varchar(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `tagline` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `website_url` varchar(255) DEFAULT NULL,
  `logo_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_owner_id` (`owner_id`),
  CONSTRAINT `fk_company_owner` FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
```

### `jobs`

```sql
CREATE TABLE `jobs` (
  `id` varchar(36) NOT NULL,
  `company_id` varchar(36) DEFAULT NULL,
  `posted_by` varchar(36) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `employment_type` enum('FULL_TIME','PART_TIME','CONTRACT','INTERNSHIP','REMOTE') NOT NULL DEFAULT 'FULL_TIME',
  `location` varchar(150) DEFAULT NULL,
  `salary` varchar(100) DEFAULT NULL,
  `deadline` date DEFAULT NULL,
  `max_applicants` int NOT NULL DEFAULT '50',
  `status` enum('OPEN','CLOSED') NOT NULL DEFAULT 'OPEN',
  `listing_type` enum('JOB','COLLABORATION') NOT NULL DEFAULT 'JOB',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_company_id` (`company_id`),
  KEY `idx_posted_by` (`posted_by`),
  CONSTRAINT `fk_job_company` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_job_owner` FOREIGN KEY (`posted_by`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
```

### `job_applications`

```sql
CREATE TABLE `job_applications` (
  `id` varchar(36) NOT NULL,
  `job_id` varchar(36) NOT NULL,
  `applicant_id` varchar(36) NOT NULL,
  `cover_letter` text DEFAULT NULL,
  `status` enum('PENDING','SHORTLISTED','ACCEPTED','REJECTED','WITHDRAWN') NOT NULL DEFAULT 'PENDING',
  `employer_feedback` text DEFAULT NULL,
  `applied_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_application` (`job_id`,`applicant_id`),
  KEY `idx_job_id` (`job_id`),
  KEY `idx_applicant_id` (`applicant_id`),
  CONSTRAINT `fk_application_job` FOREIGN KEY (`job_id`) REFERENCES `jobs` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_application_user` FOREIGN KEY (`applicant_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
```

> Note: I intentionally used `employer_feedback` instead of `rejection_reason`
> because the current application UI and review action expect that field.

### `chat_rooms`

```sql
CREATE TABLE `chat_rooms` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `participant_one` varchar(36) NOT NULL,
  `participant_two` varchar(36) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_participant_one` (`participant_one`),
  KEY `idx_participant_two` (`participant_two`),
  CONSTRAINT `chat_rooms_ibfk_1` FOREIGN KEY (`participant_one`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `chat_rooms_ibfk_2` FOREIGN KEY (`participant_two`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
```

### `messages`

```sql
CREATE TABLE `messages` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `room_id` bigint NOT NULL,
  `sender_id` varchar(36) NOT NULL,
  `content` text NOT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_room_id` (`room_id`),
  KEY `idx_sender_id` (`sender_id`),
  CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `chat_rooms` (`id`) ON DELETE CASCADE,
  CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
```

### `chat_requests`

```sql
CREATE TABLE `chat_requests` (
  `id` varchar(36) NOT NULL,
  `sender_id` varchar(36) NOT NULL,
  `receiver_id` varchar(36) NOT NULL,
  `message` varchar(255) DEFAULT NULL,
  `status` enum('PENDING','ACCEPTED','REJECTED') NOT NULL DEFAULT 'PENDING',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_chat_request` (`sender_id`,`receiver_id`),
  KEY `idx_sender_id` (`sender_id`),
  KEY `idx_receiver_id` (`receiver_id`),
  CONSTRAINT `fk_request_sender` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_request_receiver` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
```

## Recommended next steps

1. Apply `JOBLINK_SCHEMA.sql` to your database to create the 10 required tables.
2. Keep the `posts` table definition only once in your SQL migration file.
3. Use `job_applications.employer_feedback` to match the employer review UI.
4. Keep the table count at 10 for now; do not add more tables unless you need a
   new feature and still stay under 12.

> Note: `JOBLINK_SCHEMA.sql` is the canonical schema file for this project.

## Optional future tables (not required now)

If you later want notifications or bookmarks, you can add at most 2 more tables:

- `notifications`
- `saved_jobs`

But do not add them unless the main app requirements are complete.

## Summary

Your app should run with this set of tables:

- `users`
- `posts`
- `likes`
- `follows`
- `companies`
- `jobs`
- `job_applications`
- `chat_rooms`
- `messages`
- `chat_requests`

These are the tables needed to support the current project features without
exceeding your 12-table limit.

## Code Change TODO

These are the code changes you should make after creating the missing tables.

### 1. Match `job_applications` to the UI

- In `src/services/mysql/employerService.js`:
  - Select `candidate_name` and `candidate_email` from the user join.
  - Ensure `updateMysqlApplicationReview` updates `employer_feedback`.
- In `src/app/dashboard/employer/job/[jobId]/applicants/page.jsx`:
  - Use `app.candidate_name` and `app.candidate_email` from the applicant query.
  - Keep `name='employer_feedback'` in the review form.

### 2. Allow jobs without a company

- In `src/services/mysql/seekerService.js`:
  - Use `LEFT JOIN companies c ON j.company_id = c.id` in marketplace and seeker
    application queries.
- In `src/services/mysql/employerService.js`:
  - Keep `LEFT JOIN companies c ON j.company_id = c.id` for employer job
    fetches.

### 3. Fix auth/session handling

- In `src/lib/session.js`:
  - Ensure cookie expiration and JWT expiration match your chosen session
    duration.
- In `src/lib/getAuthUser.js`:
  - Keep role included in the returned user object.
  - Remove the password hash from the general-purpose session user object.
- In `src/actions/auth.js`:
  - Derive `userId` from `getAuthUser()` inside `updatePasswordAction`.

### 4. Fix chat engine SQL access

- In `src/services/chatEngine.js`:
  - Use `query(...)` instead of `db.execute(...)`.

### 5. Remove duplicate `posts` schema definitions

- Keep only one `posts` table definition in your SQL migration file.

### 6. Keep the table count at 10 for this project phase

- Do not add additional tables beyond the required 10 unless you are
  implementing one of these features later and still remain within 12 tables:
  - `notifications`
  - `saved_jobs`

## Why these changes

- `job_applications.employer_feedback` is required by the current employer
  review UI and action.
- `jobs.company_id` must be optional to support independent/collaboration
  listings.
- Missing tables like `companies`, `jobs`, `job_applications`, `follows`,
  `chat_rooms`, `messages`, and `chat_requests` are referenced directly by the
  app code, so they must exist.
- Duplicate table definitions will break SQL migrations and/or import scripts.
- The current app is not using Prisma, so the SQL table definitions are the real
  source of truth.
