import bcrypt from "bcryptjs";

export type UserRow = {
  id: string;
  email: string;
  passwordHash: string | null;
  fullName: string;
  phone: string | null;
  dateOfBirth: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  bio: string | null;
  preferences: string | null;
  dislikes: string | null;
  medicalInfo: string | null;
  hairPreferences: string | null;
  nailPreferences: string | null;
  foodPreferences: string | null;
  onboardingCompleted: boolean;
  authProvider: string;
  createdAt: Date;
  updatedAt: Date;
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
  preferences?: string | null;
  dislikes?: string | null;
  medicalInfo?: string | null;
  hairPreferences?: string | null;
  nailPreferences?: string | null;
  foodPreferences?: string | null;
  onboardingCompleted: boolean;
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
    fullName: user.fullName,
    phone: user.phone,
    dateOfBirth: user.dateOfBirth,
    address: user.address,
    city: user.city,
    country: user.country,
    bio: user.bio,
    preferences: user.preferences,
    dislikes: user.dislikes,
    medicalInfo: user.medicalInfo,
    hairPreferences: user.hairPreferences,
    nailPreferences: user.nailPreferences,
    foodPreferences: user.foodPreferences,
    onboardingCompleted: Boolean(user.onboardingCompleted),
    authProvider: user.authProvider
  };
}
