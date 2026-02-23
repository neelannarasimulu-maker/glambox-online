import { OAuth2Client } from "google-auth-library";

export type GoogleIdentity = {
  email: string;
  fullName: string;
};

let client: OAuth2Client | null = null;

function getClientId() {
  const clientId =
    process.env.GOOGLE_CLIENT_ID ?? process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  if (!clientId) {
    throw new Error(
      "Google sign-in is not configured. Missing GOOGLE_CLIENT_ID (or NEXT_PUBLIC_GOOGLE_CLIENT_ID)."
    );
  }
  return clientId;
}

function getClient() {
  if (!client) {
    client = new OAuth2Client(getClientId());
  }
  return client;
}

export async function verifyGoogleIdToken(idToken: string): Promise<GoogleIdentity> {
  const ticket = await getClient().verifyIdToken({
    idToken,
    audience: getClientId()
  });

  const payload = ticket.getPayload();
  if (!payload?.email || !payload.email_verified) {
    throw new Error("Google account email is missing or not verified.");
  }

  return {
    email: payload.email,
    fullName: payload.name?.trim() || payload.email.split("@")[0]
  };
}
