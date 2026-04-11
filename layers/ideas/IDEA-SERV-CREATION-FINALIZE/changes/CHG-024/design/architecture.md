# CHG-024 Architecture Notes

## Root Problems
1. Playground used bot paths that did not exist (`/iframe/:serviceId`, `/embed/:serviceId`) causing 404.
2. Embed snippets pointed to non-working CDN/chat host URLs.
3. Services dashboard/list used mock data instead of DB state.

## Design
1. Backend service API additions:
   - `GET /api/service/v1/services`
   - `GET /api/service/v1/services/{service_id}`
2. Bot app additions:
   - `/embed/[serviceId]`
   - `/iframe/[serviceId]`
   - `/widget.js` dynamic script route
3. Context scoping:
   - tenant/org/service IDs passed through URL params and widget config
   - bot embed chat forwards those IDs to API headers/body for query realm scoping
4. Frontend pages updated:
   - Playground consumes service context and loads bot with scoped IDs
   - Success page "View All Embed Options" snippets updated to scoped bot URLs
   - Dashboard and Services pages fetch real service data from DB API
