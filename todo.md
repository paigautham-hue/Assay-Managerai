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
- [ ] Save checkpoint and publish
- [ ] Set up GitHub sync for future updates
