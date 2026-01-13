"use client";

import {
  InstallPrompt,
  IOSInstallInstructions,
} from "@/components/InstallPrompt";
import { Onboarding } from "@/components/Onboarding";
import { useSettings } from "@/hooks/useSettings";
import { useEffect, useLayoutEffect, useState } from "react";

interface AppWrapperProps {
  children: React.ReactNode;
}

// Hook seguro para SSR
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function AppWrapper({ children }: AppWrapperProps) {
  const {
    settings,
    needsOnboarding,
    completeOnboarding,
    initializeSettings,
    isLoading,
  } = useSettings();
  const [mounted, setMounted] = useState(false);

  // Usar useLayoutEffect para mounted para evitar flash
  useIsomorphicLayoutEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    initializeSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Aplicar tema
  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    const theme = settings.theme ?? "dark";

    if (theme === "system") {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      root.classList.toggle("dark", prefersDark);

      // Listener para cambios del sistema
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handler = (e: MediaQueryListEvent) => {
        root.classList.toggle("dark", e.matches);
      };
      mediaQuery.addEventListener("change", handler);
      return () => mediaQuery.removeEventListener("change", handler);
    } else {
      root.classList.toggle("dark", theme === "dark");
    }
  }, [settings.theme, mounted]);

  // Mostrar loading mientras carga
  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-primary text-2xl font-bold">
          GainOS
        </div>
      </div>
    );
  }

  // Mostrar onboarding si es necesario
  if (needsOnboarding) {
    return (
      <Onboarding
        onComplete={async (data) => {
          await completeOnboarding(data);
        }}
      />
    );
  }

  return (
    <>
      {children}
      <InstallPrompt />
      <IOSInstallInstructions />
    </>
  );
}

