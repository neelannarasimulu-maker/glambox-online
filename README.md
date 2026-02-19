# glambox-online

Glambox Online Web & Mobile Portal.

## Authentication and profile persistence

A new authentication flow has been added alongside the existing mock pages:

- `/auth/register` for account creation with personal info fields.
- `/auth/login` for login using email/password or a Google-mode login scaffold.
- `/profile` for editing and saving personal profile information.

All authentication data is persisted in a local SQLite database file (`glambox.db`) through API routes under `app/api/auth/*`.

## Run locally

```bash
npm install
npm run dev
```

Then open:

- `http://localhost:3000/auth/register`
- `http://localhost:3000/auth/login`
- `http://localhost:3000/profile`
