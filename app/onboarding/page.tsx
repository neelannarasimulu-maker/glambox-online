"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";

type SectionKey = "basics" | "medical" | "hair" | "nails" | "food" | "lifestyle";

const sectionLabels: Record<SectionKey, string> = {
  basics: "Basics",
  medical: "Medical",
  hair: "Hair",
  nails: "Nails",
  food: "Food",
  lifestyle: "Lifestyle"
};

type MedicalAnswers = {
  knownAllergies: string;
  skinScalpSensitivity: string;
  medicationsOrSupplements: string;
  conditionsOrPregnancy: string;
  emergencyContact: string;
};

type HairAnswers = {
  hairTypeTexture: string;
  scalpCondition: string;
  colorChemicalHistory: string;
  stylingGoal: string;
  avoidForHair: string;
};

type NailAnswers = {
  nailCondition: string;
  gelAcrylicHistory: string;
  productSensitivity: string;
  preferredShapeLength: string;
  avoidForNails: string;
};

type FoodAnswers = {
  dietaryStyle: string;
  foodAllergies: string;
  avoidIngredients: string;
  nutritionGoal: string;
  preferredMealType: string;
};

type LifestyleAnswers = {
  preferredCommunication: string;
  appointmentTiming: string;
  comfortPreferences: string;
  scentMusicSensitivity: string;
  extraNotes: string;
};

const defaultMedicalAnswers: MedicalAnswers = {
  knownAllergies: "",
  skinScalpSensitivity: "",
  medicationsOrSupplements: "",
  conditionsOrPregnancy: "",
  emergencyContact: ""
};

const defaultHairAnswers: HairAnswers = {
  hairTypeTexture: "",
  scalpCondition: "",
  colorChemicalHistory: "",
  stylingGoal: "",
  avoidForHair: ""
};

const defaultNailAnswers: NailAnswers = {
  nailCondition: "",
  gelAcrylicHistory: "",
  productSensitivity: "",
  preferredShapeLength: "",
  avoidForNails: ""
};

const defaultFoodAnswers: FoodAnswers = {
  dietaryStyle: "",
  foodAllergies: "",
  avoidIngredients: "",
  nutritionGoal: "",
  preferredMealType: ""
};

const defaultLifestyleAnswers: LifestyleAnswers = {
  preferredCommunication: "",
  appointmentTiming: "",
  comfortPreferences: "",
  scentMusicSensitivity: "",
  extraNotes: ""
};

function parseSection(value: string | null): SectionKey {
  if (
    value === "basics" ||
    value === "medical" ||
    value === "hair" ||
    value === "nails" ||
    value === "food" ||
    value === "lifestyle"
  ) {
    return value;
  }
  return "basics";
}

function parseStoredAnswers<T extends Record<string, string>>(
  raw: string | undefined | null,
  defaults: T,
  legacyField: keyof T
): T {
  if (!raw?.trim()) {
    return defaults;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<T>;
    return { ...defaults, ...parsed };
  } catch {
    return { ...defaults, [legacyField]: raw };
  }
}

function hasAnyAnswer(values: Record<string, string>) {
  return Object.values(values).some((value) => value.trim().length > 0);
}

export default function OnboardingPage() {
  const router = useRouter();
  const { authReady, isAuthenticated, user, updateProfile } = useAuth();
  const [activeSection, setActiveSection] = useState<SectionKey>("basics");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    dateOfBirth: "",
    address: "",
    city: "",
    country: ""
  });
  const [medicalAnswers, setMedicalAnswers] = useState<MedicalAnswers>(defaultMedicalAnswers);
  const [hairAnswers, setHairAnswers] = useState<HairAnswers>(defaultHairAnswers);
  const [nailAnswers, setNailAnswers] = useState<NailAnswers>(defaultNailAnswers);
  const [foodAnswers, setFoodAnswers] = useState<FoodAnswers>(defaultFoodAnswers);
  const [lifestyleAnswers, setLifestyleAnswers] = useState<LifestyleAnswers>(defaultLifestyleAnswers);

  useEffect(() => {
    if (!authReady) {
      return;
    }
    if (!isAuthenticated) {
      router.replace("/auth/login");
    }
  }, [authReady, isAuthenticated, router]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const params = new URLSearchParams(window.location.search);
    setActiveSection(parseSection(params.get("section")));
  }, []);

  useEffect(() => {
    if (!user) {
      return;
    }
    setForm({
      fullName: user.fullName ?? "",
      phone: user.phone ?? "",
      dateOfBirth: user.dateOfBirth ?? "",
      address: user.address ?? "",
      city: user.city ?? "",
      country: user.country ?? ""
    });
    setMedicalAnswers(
      parseStoredAnswers(user.medicalInfo, defaultMedicalAnswers, "conditionsOrPregnancy")
    );
    setHairAnswers(parseStoredAnswers(user.hairPreferences, defaultHairAnswers, "stylingGoal"));
    setNailAnswers(
      parseStoredAnswers(user.nailPreferences, defaultNailAnswers, "preferredShapeLength")
    );
    setFoodAnswers(parseStoredAnswers(user.foodPreferences, defaultFoodAnswers, "nutritionGoal"));
    setLifestyleAnswers((previous) => ({
      ...previous,
      preferredCommunication: user.preferences ?? "",
      comfortPreferences: user.dislikes ?? "",
      extraNotes: user.bio ?? ""
    }));
  }, [user]);

  const completion = useMemo(() => {
    const checks: Record<SectionKey, boolean> = {
      basics: Boolean(form.fullName.trim() && (form.phone.trim() || form.city.trim())),
      medical: hasAnyAnswer(medicalAnswers),
      hair: hasAnyAnswer(hairAnswers),
      nails: hasAnyAnswer(nailAnswers),
      food: hasAnyAnswer(foodAnswers),
      lifestyle: hasAnyAnswer(lifestyleAnswers)
    };
    return checks;
  }, [foodAnswers, form, hairAnswers, lifestyleAnswers, medicalAnswers, nailAnswers]);

  const saveChanges = async (next: {
    fullName?: string;
    phone?: string;
    dateOfBirth?: string;
    address?: string;
    city?: string;
    country?: string;
    bio?: string;
    preferences?: string;
    dislikes?: string;
    medicalInfo?: string;
    hairPreferences?: string;
    nailPreferences?: string;
    foodPreferences?: string;
  }) => {
    if (!user) {
      return;
    }
    setIsSaving(true);
    setError(null);
    setMessage(null);
    try {
      await updateProfile({
        id: user.id,
        fullName: (next.fullName ?? form.fullName).trim() || user.fullName,
        phone: next.phone ?? form.phone,
        dateOfBirth: next.dateOfBirth ?? form.dateOfBirth,
        address: next.address ?? form.address,
        city: next.city ?? form.city,
        country: next.country ?? form.country,
        bio: next.bio,
        preferences: next.preferences,
        dislikes: next.dislikes,
        medicalInfo: next.medicalInfo,
        hairPreferences: next.hairPreferences,
        nailPreferences: next.nailPreferences,
        foodPreferences: next.foodPreferences
      });
      setMessage(`${sectionLabels[activeSection]} saved.`);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Could not save details.");
    } finally {
      setIsSaving(false);
    }
  };

  const finishOnboarding = async () => {
    if (!user) {
      return;
    }
    setIsFinishing(true);
    setError(null);
    setMessage(null);
    try {
      await updateProfile({
        id: user.id,
        fullName: form.fullName.trim() || user.fullName,
        phone: form.phone,
        dateOfBirth: form.dateOfBirth,
        address: form.address,
        city: form.city,
        country: form.country,
        preferences: lifestyleAnswers.preferredCommunication,
        dislikes: lifestyleAnswers.comfortPreferences,
        bio: lifestyleAnswers.extraNotes,
        medicalInfo: JSON.stringify(medicalAnswers),
        hairPreferences: JSON.stringify(hairAnswers),
        nailPreferences: JSON.stringify(nailAnswers),
        foodPreferences: JSON.stringify(foodAnswers),
        onboardingCompleted: true
      });
      router.push("/dashboard");
    } catch (finishError) {
      setError(finishError instanceof Error ? finishError.message : "Could not finish onboarding.");
    } finally {
      setIsFinishing(false);
    }
  };

  if (!authReady || !isAuthenticated || !user) {
    return null;
  }

  return (
    <Section className="bg-gradient-to-b from-[var(--muted)]/40 via-transparent to-transparent">
      <Container className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <Card className="h-fit p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
            Profile Setup
          </p>
          <h1 className="mt-2 text-xl font-semibold text-[var(--fg)]">Complete in context</h1>
          <div className="mt-4 grid gap-2">
            {(Object.keys(sectionLabels) as SectionKey[]).map((section) => (
              <button
                key={section}
                type="button"
                onClick={() => setActiveSection(section)}
                className={`rounded-xl border px-3 py-2 text-left text-sm ${
                  activeSection === section
                    ? "border-[var(--fg)] bg-[var(--fg)] text-[var(--bg)]"
                    : "border-[var(--border)] bg-[var(--surface)] text-[var(--fg)]"
                }`}
              >
                {sectionLabels[section]} {completion[section] ? "- Complete" : "- Pending"}
              </button>
            ))}
          </div>
          <Button
            type="button"
            onClick={finishOnboarding}
            disabled={isFinishing}
            className="mt-4 w-full"
          >
            {isFinishing ? "Finishing..." : "Finish for now"}
          </Button>
          <Link
            href="/dashboard"
            className="mt-3 block text-center text-xs font-semibold text-[var(--fg)]"
          >
            Skip and go to dashboard
          </Link>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold text-[var(--fg)]">{sectionLabels[activeSection]}</h2>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            Answer targeted questions only for the current context.
          </p>

          {activeSection === "basics" ? (
            <form
              className="mt-5 grid gap-3 md:grid-cols-2"
              onSubmit={async (event) => {
                event.preventDefault();
                await saveChanges({});
              }}
            >
              <input
                type="text"
                placeholder="Full name"
                value={form.fullName}
                onChange={(event) =>
                  setForm((previous) => ({ ...previous, fullName: event.target.value }))
                }
                className="h-11 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm"
                required
              />
              <input
                type="tel"
                placeholder="Phone"
                value={form.phone}
                onChange={(event) =>
                  setForm((previous) => ({ ...previous, phone: event.target.value }))
                }
                className="h-11 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm"
              />
              <input
                type="date"
                value={form.dateOfBirth}
                onChange={(event) =>
                  setForm((previous) => ({ ...previous, dateOfBirth: event.target.value }))
                }
                className="h-11 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm"
              />
              <input
                type="text"
                placeholder="Address"
                value={form.address}
                onChange={(event) =>
                  setForm((previous) => ({ ...previous, address: event.target.value }))
                }
                className="h-11 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm"
              />
              <input
                type="text"
                placeholder="City"
                value={form.city}
                onChange={(event) =>
                  setForm((previous) => ({ ...previous, city: event.target.value }))
                }
                className="h-11 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm"
              />
              <input
                type="text"
                placeholder="Country"
                value={form.country}
                onChange={(event) =>
                  setForm((previous) => ({ ...previous, country: event.target.value }))
                }
                className="h-11 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm"
              />
              <Button type="submit" disabled={isSaving} className="md:col-span-2">
                {isSaving ? "Saving..." : "Save basics"}
              </Button>
            </form>
          ) : null}

          {activeSection === "medical" ? (
            <form
              className="mt-5 grid gap-3 md:grid-cols-2"
              onSubmit={async (event) => {
                event.preventDefault();
                await saveChanges({ medicalInfo: JSON.stringify(medicalAnswers) });
              }}
            >
              <input
                type="text"
                placeholder="Known allergies?"
                value={medicalAnswers.knownAllergies}
                onChange={(event) =>
                  setMedicalAnswers((previous) => ({
                    ...previous,
                    knownAllergies: event.target.value
                  }))
                }
                className="h-11 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm"
              />
              <input
                type="text"
                placeholder="Skin/scalp sensitivities?"
                value={medicalAnswers.skinScalpSensitivity}
                onChange={(event) =>
                  setMedicalAnswers((previous) => ({
                    ...previous,
                    skinScalpSensitivity: event.target.value
                  }))
                }
                className="h-11 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm"
              />
              <input
                type="text"
                placeholder="Current medications/supplements?"
                value={medicalAnswers.medicationsOrSupplements}
                onChange={(event) =>
                  setMedicalAnswers((previous) => ({
                    ...previous,
                    medicationsOrSupplements: event.target.value
                  }))
                }
                className="h-11 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm"
              />
              <input
                type="text"
                placeholder="Condition or pregnancy note?"
                value={medicalAnswers.conditionsOrPregnancy}
                onChange={(event) =>
                  setMedicalAnswers((previous) => ({
                    ...previous,
                    conditionsOrPregnancy: event.target.value
                  }))
                }
                className="h-11 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm"
              />
              <input
                type="text"
                placeholder="Emergency contact (name + phone)"
                value={medicalAnswers.emergencyContact}
                onChange={(event) =>
                  setMedicalAnswers((previous) => ({
                    ...previous,
                    emergencyContact: event.target.value
                  }))
                }
                className="h-11 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm md:col-span-2"
              />
              <Button type="submit" disabled={isSaving} className="md:col-span-2">
                {isSaving ? "Saving..." : "Save medical information"}
              </Button>
            </form>
          ) : null}

          {activeSection === "hair" ? (
            <form
              className="mt-5 grid gap-3 md:grid-cols-2"
              onSubmit={async (event) => {
                event.preventDefault();
                await saveChanges({ hairPreferences: JSON.stringify(hairAnswers) });
              }}
            >
              <input
                type="text"
                placeholder="Hair type/texture?"
                value={hairAnswers.hairTypeTexture}
                onChange={(event) =>
                  setHairAnswers((previous) => ({
                    ...previous,
                    hairTypeTexture: event.target.value
                  }))
                }
                className="h-11 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm"
              />
              <input
                type="text"
                placeholder="Current scalp condition?"
                value={hairAnswers.scalpCondition}
                onChange={(event) =>
                  setHairAnswers((previous) => ({
                    ...previous,
                    scalpCondition: event.target.value
                  }))
                }
                className="h-11 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm"
              />
              <input
                type="text"
                placeholder="Recent color/chemical history?"
                value={hairAnswers.colorChemicalHistory}
                onChange={(event) =>
                  setHairAnswers((previous) => ({
                    ...previous,
                    colorChemicalHistory: event.target.value
                  }))
                }
                className="h-11 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm"
              />
              <input
                type="text"
                placeholder="Primary styling/health goal?"
                value={hairAnswers.stylingGoal}
                onChange={(event) =>
                  setHairAnswers((previous) => ({
                    ...previous,
                    stylingGoal: event.target.value
                  }))
                }
                className="h-11 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm"
              />
              <input
                type="text"
                placeholder="Anything to avoid for hair services?"
                value={hairAnswers.avoidForHair}
                onChange={(event) =>
                  setHairAnswers((previous) => ({
                    ...previous,
                    avoidForHair: event.target.value
                  }))
                }
                className="h-11 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm md:col-span-2"
              />
              <Button type="submit" disabled={isSaving} className="md:col-span-2">
                {isSaving ? "Saving..." : "Save hair preferences"}
              </Button>
            </form>
          ) : null}

          {activeSection === "nails" ? (
            <form
              className="mt-5 grid gap-3 md:grid-cols-2"
              onSubmit={async (event) => {
                event.preventDefault();
                await saveChanges({ nailPreferences: JSON.stringify(nailAnswers) });
              }}
            >
              <input
                type="text"
                placeholder="Current nail condition?"
                value={nailAnswers.nailCondition}
                onChange={(event) =>
                  setNailAnswers((previous) => ({
                    ...previous,
                    nailCondition: event.target.value
                  }))
                }
                className="h-11 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm"
              />
              <input
                type="text"
                placeholder="Gel/acrylic history in last 3 months?"
                value={nailAnswers.gelAcrylicHistory}
                onChange={(event) =>
                  setNailAnswers((previous) => ({
                    ...previous,
                    gelAcrylicHistory: event.target.value
                  }))
                }
                className="h-11 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm"
              />
              <input
                type="text"
                placeholder="Product sensitivity or reactions?"
                value={nailAnswers.productSensitivity}
                onChange={(event) =>
                  setNailAnswers((previous) => ({
                    ...previous,
                    productSensitivity: event.target.value
                  }))
                }
                className="h-11 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm"
              />
              <input
                type="text"
                placeholder="Preferred shape and length?"
                value={nailAnswers.preferredShapeLength}
                onChange={(event) =>
                  setNailAnswers((previous) => ({
                    ...previous,
                    preferredShapeLength: event.target.value
                  }))
                }
                className="h-11 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm"
              />
              <input
                type="text"
                placeholder="Anything to avoid for nail services?"
                value={nailAnswers.avoidForNails}
                onChange={(event) =>
                  setNailAnswers((previous) => ({
                    ...previous,
                    avoidForNails: event.target.value
                  }))
                }
                className="h-11 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm md:col-span-2"
              />
              <Button type="submit" disabled={isSaving} className="md:col-span-2">
                {isSaving ? "Saving..." : "Save nail preferences"}
              </Button>
            </form>
          ) : null}

          {activeSection === "food" ? (
            <form
              className="mt-5 grid gap-3 md:grid-cols-2"
              onSubmit={async (event) => {
                event.preventDefault();
                await saveChanges({ foodPreferences: JSON.stringify(foodAnswers) });
              }}
            >
              <input
                type="text"
                placeholder="Dietary style?"
                value={foodAnswers.dietaryStyle}
                onChange={(event) =>
                  setFoodAnswers((previous) => ({
                    ...previous,
                    dietaryStyle: event.target.value
                  }))
                }
                className="h-11 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm"
              />
              <input
                type="text"
                placeholder="Food allergies?"
                value={foodAnswers.foodAllergies}
                onChange={(event) =>
                  setFoodAnswers((previous) => ({
                    ...previous,
                    foodAllergies: event.target.value
                  }))
                }
                className="h-11 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm"
              />
              <input
                type="text"
                placeholder="Ingredients to avoid?"
                value={foodAnswers.avoidIngredients}
                onChange={(event) =>
                  setFoodAnswers((previous) => ({
                    ...previous,
                    avoidIngredients: event.target.value
                  }))
                }
                className="h-11 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm"
              />
              <input
                type="text"
                placeholder="Primary nutrition goal?"
                value={foodAnswers.nutritionGoal}
                onChange={(event) =>
                  setFoodAnswers((previous) => ({
                    ...previous,
                    nutritionGoal: event.target.value
                  }))
                }
                className="h-11 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm"
              />
              <input
                type="text"
                placeholder="Preferred meal type/flavor profile?"
                value={foodAnswers.preferredMealType}
                onChange={(event) =>
                  setFoodAnswers((previous) => ({
                    ...previous,
                    preferredMealType: event.target.value
                  }))
                }
                className="h-11 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm md:col-span-2"
              />
              <Button type="submit" disabled={isSaving} className="md:col-span-2">
                {isSaving ? "Saving..." : "Save food preferences"}
              </Button>
            </form>
          ) : null}

          {activeSection === "lifestyle" ? (
            <form
              className="mt-5 grid gap-3 md:grid-cols-2"
              onSubmit={async (event) => {
                event.preventDefault();
                await saveChanges({
                  preferences: lifestyleAnswers.preferredCommunication,
                  dislikes: lifestyleAnswers.comfortPreferences,
                  bio: lifestyleAnswers.extraNotes
                });
              }}
            >
              <input
                type="text"
                placeholder="How should consultants communicate with you?"
                value={lifestyleAnswers.preferredCommunication}
                onChange={(event) =>
                  setLifestyleAnswers((previous) => ({
                    ...previous,
                    preferredCommunication: event.target.value
                  }))
                }
                className="h-11 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm"
              />
              <input
                type="text"
                placeholder="Preferred appointment timing?"
                value={lifestyleAnswers.appointmentTiming}
                onChange={(event) =>
                  setLifestyleAnswers((previous) => ({
                    ...previous,
                    appointmentTiming: event.target.value
                  }))
                }
                className="h-11 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm"
              />
              <input
                type="text"
                placeholder="Comfort preferences during service?"
                value={lifestyleAnswers.comfortPreferences}
                onChange={(event) =>
                  setLifestyleAnswers((previous) => ({
                    ...previous,
                    comfortPreferences: event.target.value
                  }))
                }
                className="h-11 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm"
              />
              <input
                type="text"
                placeholder="Scent/music sensitivity?"
                value={lifestyleAnswers.scentMusicSensitivity}
                onChange={(event) =>
                  setLifestyleAnswers((previous) => ({
                    ...previous,
                    scentMusicSensitivity: event.target.value
                  }))
                }
                className="h-11 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm"
              />
              <input
                type="text"
                placeholder="Any extra notes for consultants?"
                value={lifestyleAnswers.extraNotes}
                onChange={(event) =>
                  setLifestyleAnswers((previous) => ({
                    ...previous,
                    extraNotes: event.target.value
                  }))
                }
                className="h-11 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm md:col-span-2"
              />
              <Button type="submit" disabled={isSaving} className="md:col-span-2">
                {isSaving ? "Saving..." : "Save lifestyle preferences"}
              </Button>
            </form>
          ) : null}

          {message ? <p className="mt-4 text-sm text-green-600">{message}</p> : null}
          {error ? <p className="mt-4 text-sm text-red-500">{error}</p> : null}
        </Card>
      </Container>
    </Section>
  );
}
