"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Flame,
  Rocket,
  Scale,
  Target,
  Trophy,
} from "lucide-react";
import { useState } from "react";

interface OnboardingProps {
  onComplete: (data: {
    startWeight: number;
    goalWeight: number;
    startDate: string;
  }) => void;
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0);
  const [startWeight, setStartWeight] = useState("");
  const [goalWeight, setGoalWeight] = useState("");
  const [startDate, setStartDate] = useState(format(new Date(), "yyyy-MM-dd"));

  const steps = [
    {
      title: "¡Bienvenido a GainOS!",
      subtitle: "Tu compañero para ganar peso de forma saludable",
      icon: Rocket,
    },
    {
      title: "¿Cuánto pesas ahora?",
      subtitle: "Ingresa tu peso actual para comenzar a trackear",
      icon: Scale,
    },
    {
      title: "¿Cuál es tu meta?",
      subtitle: "Define tu peso objetivo",
      icon: Target,
    },
    {
      title: "¿Cuándo empiezas?",
      subtitle: "Selecciona tu fecha de inicio",
      icon: Calendar,
    },
    {
      title: "¡Todo listo!",
      subtitle: "Prepárate para transformar tu cuerpo",
      icon: Trophy,
    },
  ];

  const totalToGain = parseFloat(goalWeight) - parseFloat(startWeight);
  const weeksEstimate = totalToGain > 0 ? Math.ceil(totalToGain / 0.75) : 0;

  const canContinue = () => {
    switch (step) {
      case 0:
        return true;
      case 1:
        const start = parseFloat(startWeight);
        return !isNaN(start) && start > 0 && start < 500;
      case 2:
        const startW = parseFloat(startWeight);
        const goalW = parseFloat(goalWeight);
        return !isNaN(goalW) && goalW > startW && goalW < 500;
      case 3:
        // Validar que la fecha sea válida
        if (!startDate) return false;
        const dateObj = new Date(startDate);
        return !isNaN(dateObj.getTime());
      case 4:
        return true;
      default:
        return true;
    }
  };

  const handleFinish = () => {
    onComplete({
      startWeight: parseFloat(startWeight),
      goalWeight: parseFloat(goalWeight),
      startDate,
    });
  };

  const CurrentIcon = steps[step].icon;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      {/* Progress */}
      <div className="w-full max-w-md mb-8">
        <Progress value={(step / (steps.length - 1)) * 100} className="h-1" />
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          <span>
            Paso {step + 1} de {steps.length}
          </span>
          <span>{Math.round((step / (steps.length - 1)) * 100)}%</span>
        </div>
      </div>

      <Card className="w-full max-w-md p-6">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="p-4 rounded-full bg-primary/10">
            <CurrentIcon className="h-10 w-10 text-primary" />
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">{steps[step].title}</h1>
          <p className="text-muted-foreground">{steps[step].subtitle}</p>
        </div>

        {/* Content */}
        <div className="mb-8">
          {step === 0 && (
            <div className="space-y-4 text-center">
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-muted/50">
                  <Flame className="h-6 w-6 mx-auto text-orange-500 mb-2" />
                  <p className="text-sm font-medium">8 comidas</p>
                  <p className="text-xs text-muted-foreground">diarias</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <Scale className="h-6 w-6 mx-auto text-primary mb-2" />
                  <p className="text-sm font-medium">Tracking</p>
                  <p className="text-xs text-muted-foreground">de peso</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <Trophy className="h-6 w-6 mx-auto text-yellow-500 mb-2" />
                  <p className="text-sm font-medium">Puntuación</p>
                  <p className="text-xs text-muted-foreground">semanal</p>
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <div className="relative">
                <Input
                  type="number"
                  step="0.1"
                  min="50"
                  max="300"
                  value={startWeight}
                  onChange={(e) => setStartWeight(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && canContinue()) {
                      setStep(step + 1);
                    }
                  }}
                  placeholder="Ej: 104"
                  className="text-2xl text-center h-16 pr-12"
                  autoFocus
                  data-testid="input-start-weight"
                  inputMode="decimal"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-lg">
                  lb
                </span>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="relative">
                <Input
                  type="number"
                  step="0.1"
                  min={parseFloat(startWeight) + 1 || 51}
                  max="300"
                  value={goalWeight}
                  onChange={(e) => setGoalWeight(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && canContinue()) {
                      setStep(step + 1);
                    }
                  }}
                  placeholder="Ej: 135"
                  className="text-2xl text-center h-16 pr-12"
                  autoFocus
                  data-testid="input-goal-weight"
                  inputMode="decimal"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-lg">
                  lb
                </span>
              </div>

              {totalToGain > 0 && (
                <div className="p-4 rounded-lg bg-primary/10 text-center">
                  <p className="text-sm text-muted-foreground">
                    Objetivo: ganar{" "}
                    <span className="font-bold text-primary">
                      {totalToGain.toFixed(1)} lb
                    </span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Estimado: ~{weeksEstimate} semanas
                  </p>
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && canContinue()) {
                    setStep(step + 1);
                  }
                }}
                className="text-lg text-center h-14"
                data-testid="input-start-date"
              />
              {startDate && (
                <p className="text-center text-sm text-muted-foreground capitalize">
                  {format(new Date(startDate), "EEEE, d 'de' MMMM yyyy", {
                    locale: es,
                  })}
                </p>
              )}
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-muted/50 space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Peso inicial</span>
                  <span className="font-semibold">{startWeight} lb</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Peso meta</span>
                  <span className="font-semibold">{goalWeight} lb</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">A ganar</span>
                  <span className="font-semibold text-primary">
                    +{totalToGain.toFixed(1)} lb
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-border">
                  <span className="text-muted-foreground">Fecha inicio</span>
                  <span className="font-semibold">
                    {format(new Date(startDate), "d 'de' MMMM", { locale: es })}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex gap-3">
          {step > 0 && (
            <Button
              variant="outline"
              onClick={() => setStep(step - 1)}
              className="flex-1"
              data-testid="onboarding-back"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Atrás
            </Button>
          )}

          {step < steps.length - 1 ? (
            <Button
              onClick={() => setStep(step + 1)}
              disabled={!canContinue()}
              className="flex-1"
              data-testid="onboarding-continue"
              type="button"
            >
              Continuar
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleFinish}
              className="flex-1 bg-primary"
              data-testid="onboarding-finish"
              type="button"
            >
              ¡Comenzar!
              <Rocket className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
