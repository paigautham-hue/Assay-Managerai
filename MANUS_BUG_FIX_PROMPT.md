# Assay Bug Fix Instructions

Fix the following 7 verified bugs in the Assay-Managerai codebase. Do not add new features — only fix the bugs listed below. Run the build after all fixes to confirm no regressions.

---

## BUG 1 (CRITICAL): CandidatesPage.tsx — API response deserialization breaks Kanban board

**File:** `artifacts/assay-app/src/pages/CandidatesPage.tsx`

**Problem:** The API endpoint `GET /api/candidates` returns `{ candidates: [...], total: number }` but the page does `setCandidates(await res.json())` treating the response as a flat array. Since the response is an object (not an array), the Kanban board and list view will break — `.filter()` and `.map()` on an object will fail or produce nothing.

**Fix:** Change the response handling to extract the `candidates` array from the response object:
```
const data = await res.json();
setCandidates(data.candidates || []);
```
Apply this pattern everywhere in that file where candidates are fetched from the API.

---

## BUG 2 (HIGH): Reference "Send" does not actually send an email

**File:** `artifacts/api-server/src/routes/references.ts`

**Problem:** The `POST /candidates/:id/references/:refId/send` endpoint generates a token URL for the reference questionnaire but has a comment saying "In production, you'd send an email here." The referee never receives anything — the user clicks "Send" and gets a success response, but no email is delivered.

**Fix:** Integrate an email service (Resend, SendGrid, or nodemailer with SMTP) to actually send the reference questionnaire link to the referee's email address. The email should include:
- Subject: "Reference Request for [Candidate Name]"
- Body: Brief explanation that they've been listed as a reference, the candidate's name and role, and a link to the questionnaire form
- The token URL that was already being generated

Add the email service API key to the environment variables. If no email API key is configured, fall back to returning the token URL in the response so the user can manually share it (current behavior), but log a warning.

---

## BUG 3 (HIGH): HUME_API_KEY hardcoded as null — emotion engine disabled

**File:** `artifacts/assay-app/src/pages/InterviewPage.tsx`

**Problem:** The Hume API key is hardcoded as `null`, which means the EmotionEngine never connects to Hume's Expression Measurement API. Real-time prosody/emotion analysis during interviews is effectively disabled.

**Fix:** Read the Hume API key from environment configuration instead of hardcoding null. The key should come from the server (similar to how the Gemini token is fetched via `POST /api/gemini-token`):
1. Add a `HUME_API_KEY` environment variable to the backend
2. Create a server endpoint (e.g., `GET /api/hume-config`) that returns the Hume API key (or indicates it's not configured)
3. In InterviewPage.tsx, fetch the key from the server before initializing the EmotionEngine
4. If no key is configured, gracefully degrade — show a subtle indicator that emotion analysis is unavailable, but don't break the interview flow

---

## BUG 4 (HIGH): InterviewSession has no userId — sessions not attributable to interviewers

**File:** `artifacts/api-server/src/routes/sessions.ts` (and the Prisma schema)

**Problem:** The InterviewSession model has no `userId` or `createdById` field. Sessions are only scoped by organizationId. When multiple interviewers exist in an organization, everyone sees everyone's sessions with no way to filter by "my interviews."

**Fix:**
1. Add a `createdById` field (String, references User.id) to the InterviewSession model in the Prisma schema
2. Run a migration
3. In `POST /sessions`, set `createdById` from the authenticated user's ID (`req.user.id`)
4. In `GET /sessions`, add an optional `?mine=true` query parameter that filters by `createdById === req.user.id`
5. Existing sessions without a createdById should still be visible (treat null as "unattributed")

---

## BUG 5 (MEDIUM): CandidateComparePage missing dimension score comparison

**File:** `artifacts/assay-app/src/pages/CandidateComparePage.tsx`

**Problem:** The `dimensions` array is defined in the code (listing scoring dimensions for comparison) but no table rows are rendered for dimension-level score comparison. The comparison table only shows basic metadata (stage, experience, fit score, interview count, reference count, source) — the actual assessment scores are not compared even though the data structure supports it.

**Fix:** After the basic metadata rows in the comparison table, render additional rows for each dimension in the `dimensions` array. For each candidate, look up their latest assessment report's pyramid scores and display them in the comparison. If a candidate has no assessment yet, show "—" or "Not assessed." Color-code scores (green >= 4.0, amber >= 3.0, red < 3.0) for quick visual comparison.

---

## BUG 6 (MEDIUM): Audio recordings stored as blobs in PostgreSQL — will not scale

**File:** `artifacts/api-server/src/routes/audio.ts`

**Problem:** Interview audio recordings (up to 100MB each) are stored as base64-encoded text directly in PostgreSQL. As the number of interviews grows, this will cause:
- Database size to balloon (each interview adds 50-100MB to the DB)
- Slow queries when the audio table is touched
- Expensive database backups
- Memory pressure on the DB server

**Fix:** Move audio storage to S3-compatible object storage:
1. Add S3 client configuration (AWS SDK or compatible) with bucket name, region, and credentials as environment variables
2. In `POST /sessions/:id/audio`, upload the audio buffer to S3 with key `audio/{sessionId}.webm`, then store only the S3 key/URL in the database (not the blob)
3. In `GET /sessions/:id/audio`, generate a presigned S3 URL (valid for 1 hour) and redirect or return the URL
4. In `HEAD /sessions/:id/audio`, check if the S3 key exists in the database record (no need to hit S3)
5. If S3 is not configured (no env vars), fall back to the current PostgreSQL storage with a console warning — this keeps local development simple

---

## BUG 7 (LOW): Development JWT secret hardcoded as fallback

**File:** `artifacts/api-server/src/middleware/auth.ts`

**Problem:** When `JWT_SECRET` environment variable is not set, the code falls back to a hardcoded development secret with only a `console.warn`. In production, this is a security risk — if someone deploys without setting the env var, all JWTs are signed with a known secret.

**Fix:** In production mode (`NODE_ENV === 'production'`), throw an error at startup if `JWT_SECRET` is not set, preventing the server from starting. In development mode, keep the fallback but make the warning more prominent (e.g., log it on every request, not just once).

---

## Summary

| Bug | File(s) | Severity |
|-----|---------|----------|
| 1. Candidates page deserialization | CandidatesPage.tsx | Critical |
| 2. Reference email not sent | references.ts | High |
| 3. Hume API key hardcoded null | InterviewPage.tsx + new endpoint | High |
| 4. Session missing userId | sessions.ts + Prisma schema | High |
| 5. Compare page missing dimensions | CandidateComparePage.tsx | Medium |
| 6. Audio blobs in PostgreSQL | audio.ts | Medium |
| 7. JWT secret fallback in prod | auth.ts | Low |

After fixing all bugs, run `pnpm build` to verify no TypeScript or build errors were introduced.
