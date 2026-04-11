# CHG-023 Design Notes

## Objective
Send the tenant directly to the bot playground after deployment from the wizard Finish button.

## Design
- Update only one line in the Finish handler redirect path:
  - from `/dashboard/services/${serviceId}`
  - to `/dashboard/services/${serviceId}/playground`

## Non-goals
- No change to service creation, chatbot creation, or deployment API flow.
