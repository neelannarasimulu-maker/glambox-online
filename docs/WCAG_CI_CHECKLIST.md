# WCAG CI Checklist

Automated checks (`npm run wcag:check`) enforce these baseline requirements:

1. Root document language is declared (`<html lang="en">`).
2. Global keyboard focus treatment exists (`:focus-visible`).
3. Focus style uses visible outline and outline offset.
4. No raw `<img>` tags in `app/` and `components/` (must use `next/image`).

These checks are designed as a minimum gate. Manual QA is still required for:
- Color contrast audits against final rendered backgrounds.
- Keyboard-only end-to-end navigation.
- Screen reader pass on booking, auth, and checkout flows.
