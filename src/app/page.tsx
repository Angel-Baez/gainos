"use client";

import { ProgressRing } from "@/components/ProgressRing";
import { WeeklyScoreCard } from "@/components/WeeklyScoreCard";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useBackpack } from "@/hooks/useBackpack";
import { useMealPrep } from "@/hooks/useMealPrep";
import { useMeals } from "@/hooks/useMeals";
import { useScore } from "@/hooks/useScore";
import { useWeight } from "@/hooks/useWeight";
import { DAILY_CALORIES_TARGET } from "@/lib/constants";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Backpack,
  BarChart3,
  Calendar,
  ChevronRight,
  ClipboardList,
  Flame,
  Scale,
  TrendingUp,
  Utensils,
} from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function Dashboard() {
  const { meals, stats: mealStats, initializeDayMeals } = useMeals();
  const { currentWeight, goalWeight, progressPercent, gained } = useWeight();
  const { stats: prepStats, initializeMealPrep } = useMealPrep();
  const { stats: backpackStats, initializeBackpack } = useBackpack();
  const { scores, saveScore } = useScore();

  useEffect(() => {
    initializeDayMeals();
    initializeMealPrep();
    initializeBackpack();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Guardar score al final del día (domingos)
  useEffect(() => {
    const now = new Date();
    if (now.getDay() === 0 && now.getHours() >= 22) {
      saveScore();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scores.total]);

  const completedCalories = meals
    .filter((m) => m.status === "completed")
    .reduce((sum, m) => sum + m.calories, 0);

  const mealProgress = (mealStats.completed / mealStats.total) * 100;
  const isMonday = new Date().getDay() === 1;

  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">GainOS</h1>
        <p className="text-muted-foreground capitalize">
          {format(new Date(), "EEEE, d 'de' MMMM", { locale: es })}
        </p>
      </div>

      {/* Main Progress Ring */}
      <Card className="p-6 mb-6 flex flex-col items-center">
        <ProgressRing progress={mealProgress} size={160} strokeWidth={12}>
          <div className="text-center">
            <p className="text-4xl font-bold">
              {mealStats.completed}/{mealStats.total}
            </p>
            <p className="text-xs text-muted-foreground">comidas</p>
          </div>
        </ProgressRing>

        <div className="w-full mt-6 space-y-2">
          <div className="flex justify-between text-sm">
            <div className="flex items-center gap-2">
              <Flame className="h-4 w-4 text-orange-500" />
              <span className="text-muted-foreground">Calorias</span>
            </div>
            <span className="font-medium">
              {completedCalories.toLocaleString()} /{" "}
              {DAILY_CALORIES_TARGET.toLocaleString()}
            </span>
          </div>
          <Progress
            value={(completedCalories / DAILY_CALORIES_TARGET) * 100}
            className="h-2"
          />
        </div>
      </Card>

      {/* Weight Progress */}
      <Card className="p-4 mb-4 link-card">
        <Link href="/weight" className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Scale className="h-5 w-5 text-primary link-icon" />
            </div>
            <div>
              <p className="text-sm font-semibold">{currentWeight} lb</p>
              <p className="text-xs text-muted-foreground">
                +{gained.toFixed(1)} lb ganadas
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Meta</p>
              <p className="text-sm font-medium">{goalWeight} lb</p>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground link-icon" />
          </div>
        </Link>
        <Progress value={progressPercent} className="h-1.5 mt-3" />
      </Card>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">

        <Link href="/mealprep">
          <Card className="p-4 h-full link-card">
            <div className="flex items-center gap-2 mb-2">
              <ClipboardList className="h-4 w-4 text-primary link-icon" />
              <span className="text-xs font-medium">Meal Prep</span>
            </div>
            <p className="text-2xl font-bold">
              {prepStats.completed}/{prepStats.total}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {prepStats.isFullyCompleted
                ? "Completado"
                : isMonday
                ? "LUNES SAGRADO"
                : "Pendiente"}
            </p>
          </Card>
        </Link>

        <Link href="/backpack">
          <Card className="p-4 h-full link-card">
            <div className="flex items-center gap-2 mb-2">
              <Backpack className="h-4 w-4 text-primary link-icon" />
              <span className="text-xs font-medium">Mochila</span>
            </div>
            <p className="text-2xl font-bold">
              {backpackStats.checked}/{backpackStats.total}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {backpackStats.allChecked ? "Lista" : "Pendiente"}
            </p>
          </Card>
        </Link>
      </div>

      {/* Weekly Score Card */}
      <div className="mb-6">
        <WeeklyScoreCard />
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <Link href="/history">
          <Card className="p-3 link-card">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary link-icon" />
              <span className="text-sm font-medium">Historial</span>
            </div>
          </Card>
        </Link>
        <Link href="/reports">
          <Card className="p-3 link-card">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary link-icon" />
              <span className="text-sm font-medium">Reportes</span>
            </div>
          </Card>
        </Link>
      </div>

      {/* Today's Focus */}
      <Card className="p-4 bg-linear-to-r from-primary/10 to-primary/5 border-primary/20">
        <h2 className="text-sm font-semibold mb-2">Enfoque de Hoy</h2>
        <ul className="text-xs text-muted-foreground space-y-1">
          {mealStats.completed < mealStats.total && (
            <li>• Completar las {mealStats.total - mealStats.completed} comidas restantes</li>
          )}
          {!backpackStats.allChecked && <li>• Preparar mochila para manana</li>}
          {isMonday && !prepStats.isFullyCompleted && (
            <li>• LUNES SAGRADO - Meal prep del lunes</li>
          )}
          {isMonday && <li>• Pesaje semanal (si no lo has hecho)</li>}
          {mealStats.completed === mealStats.total && backpackStats.allChecked && (
            <li className="text-primary font-medium">
              • Excelente dia - todo completado
            </li>
          )}
        </ul>
      </Card>

      {/* Motivational Quote */}
      <div className="mt-6 text-center">
        <p className="text-xs text-muted-foreground italic">
          &ldquo;La consistencia vence al talento. Cada comida cuenta.&rdquo;
        </p>
      </div>
    </div>
  );
}
