"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useSettings } from "@/hooks/useSettings";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import {
  Monitor,
  Moon,
  RotateCcw,
  Save,
  Scale,
  Sun,
  Target,
} from "lucide-react";
import { useState } from "react";

export default function SettingsPage() {
  const { settings, isLoading, updateSettings, setTheme } = useSettings();

  // Estado local para ediciones (null = usar valor de settings)
  const [editStartWeight, setEditStartWeight] = useState<string | null>(null);
  const [editGoalWeight, setEditGoalWeight] = useState<string | null>(null);
  const [editStartDate, setEditStartDate] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Valores mostrados: local si está editando, settings si no
  const startWeight = editStartWeight ?? settings.startWeight.toString();
  const goalWeight = editGoalWeight ?? settings.goalWeight.toString();
  const startDate = editStartDate ?? settings.startDate;

  const handleSave = async () => {
    setIsSaving(true);
    await updateSettings({
      startWeight: parseFloat(startWeight),
      goalWeight: parseFloat(goalWeight),
      startDate,
    });
    // Limpiar ediciones locales
    setEditStartWeight(null);
    setEditGoalWeight(null);
    setEditStartDate(null);
    setIsSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    setEditStartWeight(null);
    setEditGoalWeight(null);
    setEditStartDate(null);
  };

  const themeOptions = [
    { value: "light", label: "Claro", icon: Sun },
    { value: "dark", label: "Oscuro", icon: Moon },
    { value: "system", label: "Sistema", icon: Monitor },
  ] as const;

  const totalToGain = parseFloat(goalWeight) - parseFloat(startWeight);

  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Configuración</h1>
        <p className="text-muted-foreground">Personaliza tu experiencia</p>
      </div>

      {/* Datos del usuario */}
      <Card className="p-4 mb-6">
        <h2 className="font-semibold mb-4 flex items-center gap-2">
          <Scale className="h-4 w-4 text-primary" />
          Datos de Peso
        </h2>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Peso Inicial (lb)
            </label>
            <div className="relative">
              <Input
                type="number"
                step="0.1"
                value={startWeight}
                onChange={(e) => setEditStartWeight(e.target.value)}
                className="pr-12"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                lb
              </span>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Peso Meta (lb)
            </label>
            <div className="relative">
              <Input
                type="number"
                step="0.1"
                value={goalWeight}
                onChange={(e) => setEditGoalWeight(e.target.value)}
                className="pr-12"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                lb
              </span>
            </div>
          </div>

          {totalToGain > 0 && (
            <div className="p-3 bg-primary/10 rounded-lg">
              <div className="flex items-center gap-2 text-sm">
                <Target className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">
                  Objetivo: ganar{" "}
                  <span className="font-semibold text-primary">
                    {totalToGain.toFixed(1)} lb
                  </span>
                </span>
              </div>
            </div>
          )}

          <div>
            <label className="text-sm font-medium mb-2 block">
              Fecha de Inicio
            </label>
            <div className="relative">
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setEditStartDate(e.target.value)}
              />
            </div>
            {startDate && (
              <p className="text-xs text-muted-foreground mt-1">
                {format(parseISO(startDate), "EEEE, d 'de' MMMM yyyy", {
                  locale: es,
                })}
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button variant="outline" onClick={handleReset} className="flex-1">
            <RotateCcw className="h-4 w-4 mr-2" />
            Restablecer
          </Button>
          <Button onClick={handleSave} disabled={isSaving} className="flex-1">
            <Save className="h-4 w-4 mr-2" />
            {saved ? "¡Guardado!" : isSaving ? "Guardando..." : "Guardar"}
          </Button>
        </div>
      </Card>

      {/* Tema */}
      <Card className="p-4 mb-6">
        <h2 className="font-semibold mb-4 flex items-center gap-2">
          <Moon className="h-4 w-4 text-primary" />
          Tema de la Aplicación
        </h2>

        <div className="grid grid-cols-3 gap-3">
          {themeOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = settings.theme === option.value;

            return (
              <button
                key={option.value}
                onClick={() => setTheme(option.value)}
                className={cn(
                  "flex flex-col items-center gap-2 p-4 rounded-lg border transition-all",
                  isSelected
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border hover:border-primary/50"
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="text-sm font-medium">{option.label}</span>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Info */}
      <Card className="p-4">
        <h2 className="font-semibold mb-2">Acerca de GainOS</h2>
        <div className="text-sm text-muted-foreground space-y-1">
          <p>Versión 1.0.0</p>
          <p>PWA de tracking para plan de aumento de peso</p>
          <p className="pt-2 text-xs">
            Tus datos se guardan localmente en tu dispositivo
          </p>
        </div>
      </Card>
    </div>
  );
}
