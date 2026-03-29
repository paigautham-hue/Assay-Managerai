# ASSAY Platform — Deployment TODO

## Migration from Assay-Managerai repo

- [x] Migrate ASSAY frontend (React 19 + Vite) into client/src
- [x] Migrate ASSAY backend routes (Express) into server/routes
- [x] Convert Prisma schema from PostgreSQL to MySQL-compatible
- [x] Run database migrations (all 14 ASSAY tables created)
- [x] Fix int ID mapping (Manus template uses int, ASSAY used UUID)
- [x] Fix role column enum (added owner/admin/interviewer/viewer/user)
- [x] Fix openId nullable (ASSAY users don't have Manus openId)
- [x] Configure AI secrets (ANTHROPIC_API_KEY, GEMINI_API_KEY, OPENAI_API_KEY)
- [x] Configure Hume AI keys (voice/emotion analysis)
- [x] Verify registration and login flow end-to-end
- [x] Verify dashboard renders after login
- [x] Save checkpoint and publish
- [x] Set up GitHub sync for future updates (branch: manus-deploy on paigautham-hue/Assay-Managerai)

## Bug Fixes & Audit

- [x] Fix publish timeout issue (16MB Prisma engine binary removed, project now 2MB)
- [x] Remove large Prisma engine binary and generated files from deployment
- [x] Comprehensive code audit — all 13 pages, 10 server routes, types, store verified
- [x] Fix all bugs: owner role bypass in requireRole, env variable mapping (GEMINI→GOOGLE_API_KEY), postinstall for Prisma generate
- [x] End-to-end test all critical flows (login, dashboard, setup, analytics, admin — all pass)
- [x] Save checkpoint and re-publish

## Deployment Fix #2

- [x] Fix: Changed Prisma import from relative '../generated/prisma' to '@prisma/client' so esbuild externalizes it
- [x] Externalize Prisma from esbuild bundle — verified import stays as ESM external in dist/index.js
- [x] Verify production build starts correctly — health check + login both pass on port 4000
- [x] Save checkpoint and re-publish

## GitHub Pull & Republish

- [x] Pull latest Claude Code fixes from GitHub
- [x] Fix TypeScript errors from schema mismatches (Int vs String IDs, missing organizationId)
- [x] Fix invites.ts - remove organizationId references
- [x] Fix feedback.ts - remove nested report relation filter, fix userId int conversion
- [x] Fix calibration.ts - remove organizationId, fix userId parseInt
- [x] Fix analytics.ts, assess.ts, reports.ts - add explicit type annotations
- [x] Sync Prisma schema to database (prisma db push with SSL)
- [x] Verify production build compiles with zero errors
- [x] Verify all API endpoints work (healthz, auth, sessions, reports, candidates, invites)
- [x] Write and pass vitest tests (13 tests, 2 files)
- [x] Save checkpoint and republish
- [x] Push changes to GitHub manus-deploy branch

## Bug Fix: Registration Error

- [x] Fix "Internal server error" on user registration in production (was already fixed in code, needed republish)
- [x] Verify registration works end-to-end after fix
- [ ] Save checkpoint and republish (pending)
