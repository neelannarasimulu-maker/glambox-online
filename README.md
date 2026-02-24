# glambox-online

Glambox Online Web & Mobile Portal.

## Authentication and profile persistence

A new authentication flow has been added alongside the existing mock pages:

- `/auth/register` for account creation with personal info fields.
- `/auth/login` for secure email/password sign-in.
- `/auth/reset-password` for password recovery using reset codes.
- `/profile` for editing and saving personal profile information.

All authentication data is persisted in a local SQLite database file (`glambox.db`) through API routes under `app/api/auth/*`.

Login/session security data is also persisted in database tables:
- `auth_sessions` for hashed, revocable session tokens.
- `auth_login_events` for login audit history (provider, IP, user-agent, timestamp).

## Security hardening included

- Server-side input validation for email, full name, and password complexity.
<<<<<<< HEAD
- In-memory API rate limiting for login, registration, and password reset endpoints.
- Passwords are hashed with bcrypt and validated against strong complexity rules.
=======
- In-memory API rate limiting for login, registration, and Google auth endpoints.
- Google login now requires a valid Google ID token verified server-side.
- Authenticated sessions are issued via HttpOnly cookies (instead of localStorage tokens).
>>>>>>> bee3f64297bbcd7cb4ab6cfc649c1d5729c78c34

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
