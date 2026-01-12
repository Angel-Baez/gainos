"use client";

import { DEFAULT_USER_SETTINGS } from "@/lib/constants";
import { db } from "@/lib/db";
import { UserSettings } from "@/types";
import { useLiveQuery } from "dexie-react-hooks";

const SETTINGS_ID = "user-settings";

export function useSettings() {
  const settings = useLiveQuery(() => db.settings.get(SETTINGS_ID), [], null);

  const isLoading = settings === undefined;

  const effectiveSettings: UserSettings = settings ?? {
    id: SETTINGS_ID,
    ...DEFAULT_USER_SETTINGS,
    theme: "dark",
    onboardingCompleted: false,
  };

  const updateSettings = async (updates: Partial<Omit<UserSettings, "id">>) => {
    const current = await db.settings.get(SETTINGS_ID);
    const newSettings: UserSettings = {
      ...effectiveSettings,
      ...current,
      ...updates,
      id: SETTINGS_ID,
    };
    await db.settings.put(newSettings);
  };

  const initializeSettings = async () => {
    const existing = await db.settings.get(SETTINGS_ID);
    if (!existing) {
      await db.settings.put({
        id: SETTINGS_ID,
        ...DEFAULT_USER_SETTINGS,
        theme: "dark",
        onboardingCompleted: false,
      });
    }
  };

  const completeOnboarding = async (data: {
    startWeight: number;
    goalWeight: number;
    startDate: string;
  }) => {
    await updateSettings({
      ...data,
      onboardingCompleted: true,
    });
  };

  const setTheme = async (theme: "light" | "dark" | "system") => {
    await updateSettings({ theme });

    // Aplicar tema inmediatamente
    if (typeof window !== "undefined") {
      const root = document.documentElement;
      if (theme === "system") {
        const prefersDark = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;
        root.classList.toggle("dark", prefersDark);
      } else {
        root.classList.toggle("dark", theme === "dark");
      }
    }
  };

  return {
    settings: effectiveSettings,
    isLoading,
    needsOnboarding: !effectiveSettings.onboardingCompleted,
    updateSettings,
    initializeSettings,
    completeOnboarding,
    setTheme,
  };
}
