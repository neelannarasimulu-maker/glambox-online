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
  preferences: string | null;
  dislikes: string | null;
  medical_info: string | null;
  hair_preferences: string | null;
  nail_preferences: string | null;
  food_preferences: string | null;
  onboarding_completed: number | null;
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
    fullName: user.full_name,
    phone: user.phone,
    dateOfBirth: user.date_of_birth,
    address: user.address,
    city: user.city,
    country: user.country,
    bio: user.bio,
    preferences: user.preferences,
    dislikes: user.dislikes,
    medicalInfo: user.medical_info,
    hairPreferences: user.hair_preferences,
    nailPreferences: user.nail_preferences,
    foodPreferences: user.food_preferences,
    onboardingCompleted: Boolean(user.onboarding_completed),
    authProvider: user.auth_provider
  };
}
