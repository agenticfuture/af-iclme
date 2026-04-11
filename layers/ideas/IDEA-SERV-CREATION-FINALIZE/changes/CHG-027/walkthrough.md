# Walkthrough - Service Details Fetch Failure Fix (CHG-027)

## Issue
Clicking **View Details** failed at:
- `app/dashboard/services/[id]/page.tsx`
- Error: `fetch failed` in `getService(...)`.

## Root Cause
The server-rendered page relied on a single API base URL. Depending on runtime (host vs Docker network), that URL could be unreachable from the Next.js server process.

## Changes Implemented
1. Added resilient API base URL fallback list in:
- `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/ui-apps/service-gen-saas/app/dashboard/services/[id]/page.tsx`
- Order:
  - `SERVICE_GEN_BASE_API`
  - `NEXT_PUBLIC_SERVICE_GEN_BASE_API`
  - `http://service-gen-api:8000`
  - `https://api.servicegen.local`

2. Updated `getService(serviceId)` to try each URL until one succeeds.
- Uses `cache: "no-store"` for fresh service details.
- Returns `null` only if all candidates fail.

3. Restored embed snippet API config to use a dedicated `getEmbedApiUrl()` helper.
- Keeps generated copy/paste widget snippet valid after refactor.

## Result
- `View Details` route no longer hard-fails due to a single unreachable base URL.
- Existing service/bot creation sections remain untouched.
- Bot embed host behavior remains aligned with `bot.servicegen.local`.
