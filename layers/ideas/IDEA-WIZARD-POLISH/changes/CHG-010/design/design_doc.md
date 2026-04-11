# Design - Wizard UI Polishing

## Objective
Prevent user interaction with unimplemented features (Channels, Agents) using visual cues.

## Implementation Details

### 1. Step 4 (Channels)
- **"Add Channel" Button**: Set `disabled={true}`.
- **Badge**: Add `<ComingSoonBadge />` next to the button or title.

### 2. Step 5 (Agent Assignment)
- **Title**: Update to `Agent Assignment (Coming Soon)`.
- **"Add Agent" Button**: Set `disabled={true}`.
- **Input Fields**: Apply class `blur-sm pointer-events-none opacity-50` to the form container.
- **CSV Import**: Disable the button.

## CSS Strategy
Use Tailwind classes `blur-sm`, `opacity-50`, and `pointer-events-none` for blurring.
