# glambox-online

Glambox Online Web & Mobile Portal.

## Authentication and profile persistence

A new authentication flow has been added alongside the existing mock pages:

- `/auth/register` for account creation with personal info fields.
- `/auth/login` for secure email/password sign-in.
- `/auth/reset-password` for password recovery using reset codes.
- `/profile` for editing and saving personal profile information.

All authentication data is persisted in a local SQLite database file (`glambox.db`) through API routes under `app/api/auth/*`.

## Security hardening included

- Server-side input validation for email, full name, and password complexity.
- In-memory API rate limiting for login, registration, and password reset endpoints.
- Passwords are hashed with bcrypt and validated against strong complexity rules.

## Run locally

```bash
npm install
npm run dev
```

Then open:

- `http://localhost:3000/auth/register`
- `http://localhost:3000/auth/login`
- `http://localhost:3000/auth/reset-password`
- `http://localhost:3000/profile`
