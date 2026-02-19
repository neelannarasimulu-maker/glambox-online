import bcrypt from "bcryptjs";

export type UserRow = {
  id: string;
  email: string;
  password_hash: string | null;
  full_name: string;
  phone: string | null;
  date_of_birth: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  bio: string | null;
  auth_provider: string;
};

export type SessionUser = {
  id: string;
  email: string;
  fullName: string;
  phone?: string | null;
  dateOfBirth?: string | null;
  address?: string | null;
  city?: string | null;
  country?: string | null;
  bio?: string | null;
  authProvider: string;
};

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function toSessionUser(user: UserRow): SessionUser {
  return {
    id: user.id,
    email: user.email,
    fullName: user.full_name,
    phone: user.phone,
    dateOfBirth: user.date_of_birth,
    address: user.address,
    city: user.city,
    country: user.country,
    bio: user.bio,
    authProvider: user.auth_provider
  };
}
