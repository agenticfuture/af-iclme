# Design Doc: Wizard State Persistence

## Objective
Prevent "Service ID missing" errors caused by page refreshes or state loss during the service creation flow.

## Implementation Details
1. **Rehydration**: Use a `useEffect` on mount to check for `sg_service_id` and `sg_chatbot_id` in `sessionStorage`.
2. **Persistence**: 
    - At Step 1 completion: Set `sg_service_id`.
    - At Step 2 completion: Set `sg_chatbot_id`.
3. **Logic Refinement**:
    - Step 1: If `serviceId` already exists, perform a `PUT` (update) instead of `POST` (create), or skip creation if no changes. For now, we will focus on persistence.
4. **Cleanup**: Clear `sessionStorage` on successful "Finish" (deployment).

## Expected Outcome
Users can refresh the page at any step (2-5) and still proceed without "Service ID missing" errors.
