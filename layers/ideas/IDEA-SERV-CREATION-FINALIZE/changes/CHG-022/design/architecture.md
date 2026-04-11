# CHG-022 Design Notes

## Problem
Next.js App Router passes `params` as a Promise for this server page context. Accessing `params.id` synchronously triggers runtime server error.

## Design
1. Update route component signature to `params: Promise<{ id: string }>`.
2. Resolve `serviceId` via `await params` before usage.
3. Replace all remaining `params.id` references in the page with `serviceId`.
4. Add API base URL resolver fallback to avoid `fetch failed` when public env var is absent in server runtime.

## Security/Privacy
- No new data fields introduced.
- Existing tenant/service flow remains unchanged.
