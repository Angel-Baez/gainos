"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Download, X } from "lucide-react";
import { useEffect, useState, useSyncExternalStore } from "react";

// Tipo para el evento beforeinstallprompt
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

// Custom hook para detectar si está instalada como PWA (client-side only)
function useIsStandalone() {
  return useSyncExternalStore(
    (callback) => {
      const mediaQuery = window.matchMedia("(display-mode: standalone)");
      mediaQuery.addEventListener("change", callback);
      return () => mediaQuery.removeEventListener("change", callback);
    },
    () => window.matchMedia("(display-mode: standalone)").matches,
    () => false // Server-side default
  );
}

// Custom hook para detectar iOS
function useIsIOS() {
  return useSyncExternalStore(
    () => () => {}, // No hay suscripción necesaria
    () =>
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !("MSStream" in window),
    () => false // Server-side default
  );
}

// Check si fue descartado previamente (SSR-safe)
function getInitialDismissed(key: string): boolean {
  if (typeof window === "undefined") return false;
  const wasDismissed = localStorage.getItem(key);
  if (wasDismissed) {
    const dismissedTime = parseInt(wasDismissed, 10);
    // Mostrar de nuevo después de 7 días
    return Date.now() - dismissedTime < 7 * 24 * 60 * 60 * 1000;
  }
  return false;
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [dismissed, setDismissed] = useState(() =>
    getInitialDismissed("pwa-install-dismissed")
  );
  const isInstalled = useIsStandalone();

  useEffect(() => {
    if (isInstalled || dismissed) return;

    // Capturar el evento beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowBanner(true);
    };

    // Detectar cuando se instala
    const handleAppInstalled = () => {
      setShowBanner(false);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, [isInstalled, dismissed]);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      setDeferredPrompt(null);
      setShowBanner(false);
    } catch (error) {
      console.error("Error al instalar PWA:", error);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    setDismissed(true);
    localStorage.setItem("pwa-install-dismissed", Date.now().toString());
  };

  // No mostrar si está instalada, descartada, o no hay prompt
  if (isInstalled || dismissed || !showBanner || !deferredPrompt) {
    return null;
  }

  return (
    <div
      className={cn(
        "fixed bottom-20 left-4 right-4 z-40 max-w-lg mx-auto",
        "bg-card border border-border rounded-xl shadow-lg p-4",
        "animate-slide-up"
      )}
    >
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-primary/10 shrink-0">
          <Download className="h-5 w-5 text-primary" />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm">Instalar GainOS</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Instala la app para acceso rápido y uso offline
          </p>

          <div className="flex gap-2 mt-3">
            <Button
              size="sm"
              className="h-8 text-xs"
              onClick={handleInstall}
              data-testid="install-pwa-button"
            >
              <Download className="h-3.5 w-3.5 mr-1" />
              Instalar
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-xs text-muted-foreground"
              onClick={handleDismiss}
            >
              Ahora no
            </Button>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 shrink-0 text-muted-foreground hover:text-foreground"
          onClick={handleDismiss}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

// Componente alternativo para iOS (que no soporta beforeinstallprompt)
export function IOSInstallInstructions() {
  const [showInstructions, setShowInstructions] = useState(false);
  const [dismissed, setDismissed] = useState(() =>
    getInitialDismissed("ios-install-dismissed")
  );
  const isIOS = useIsIOS();
  const isInstalled = useIsStandalone();

  useEffect(() => {
    if (!isIOS || isInstalled || dismissed) return;

    // Mostrar después de un delay si es iOS y no está instalada
    const timer = setTimeout(() => setShowInstructions(true), 3000);
    return () => clearTimeout(timer);
  }, [isIOS, isInstalled, dismissed]);

  const handleDismiss = () => {
    setShowInstructions(false);
    setDismissed(true);
    localStorage.setItem("ios-install-dismissed", Date.now().toString());
  };

  if (!isIOS || isInstalled || dismissed || !showInstructions) {
    return null;
  }

  return (
    <div
      className={cn(
        "fixed bottom-20 left-4 right-4 z-40 max-w-lg mx-auto",
        "bg-card border border-border rounded-xl shadow-lg p-4",
        "animate-slide-up"
      )}
    >
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-primary/10 shrink-0">
          <Download className="h-5 w-5 text-primary" />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm">Instalar GainOS</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Para instalar en tu iPhone:
          </p>
          <ol className="text-xs text-muted-foreground mt-2 space-y-1 list-decimal list-inside">
            <li>Toca el botón compartir (📤)</li>
            <li>Selecciona &quot;Agregar a pantalla de inicio&quot;</li>
            <li>Toca &quot;Agregar&quot;</li>
          </ol>

          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs mt-3 text-muted-foreground"
            onClick={handleDismiss}
          >
            Entendido
          </Button>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 shrink-0 text-muted-foreground hover:text-foreground"
          onClick={handleDismiss}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
