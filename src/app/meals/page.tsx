"use client";

import { MealCard } from "@/components/MealCard";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMeals } from "@/hooks/useMeals";
import { DAILY_CALORIES_TARGET, WEEKLY_MEAL_PLAN } from "@/lib/constants";
import { MealStatus } from "@/types";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useEffect } from "react";

export default function MealsPage() {
  const {
    meals,
    stats,
    initializeDayMeals,
    toggleMeal,
    updateMealStatus,
    updateMealNotes,
    dateString,
  } = useMeals();

  useEffect(() => {
    initializeDayMeals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateString]);

  // Calcular calorías considerando estados parciales
  const completedCalories = meals
    .filter((m) => m.status === "completed")
    .reduce((sum, m) => sum + m.calories, 0);

  const partialCalories = meals
    .filter((m) => m.status === "partial")
    .reduce((sum, m) => sum + Math.round(m.calories * 0.5), 0);

  const totalCalories = completedCalories + partialCalories;

  const progressPercent = (stats.completed / stats.total) * 100;

  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Comidas</h1>
        <p className="text-muted-foreground capitalize">
          {format(new Date(), "EEEE, d 'de' MMMM", { locale: es })}
        </p>
      </div>

      {/* Tabs para menú diario y semanal */}
      <Tabs defaultValue="diario" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="diario">Menú Diario</TabsTrigger>
          <TabsTrigger value="semanal">Menú Semanal</TabsTrigger>
        </TabsList>

        {/* Tab: Menú Diario */}
        <TabsContent value="diario">
          {/* Progress Summary */}
          <div className="glass-elevated rounded-xl p-4 mb-6 animate-slide-up">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">
                Progreso del dia
              </span>
              <span className="text-sm font-semibold text-primary">
                {stats.completed}/{stats.total} comidas
              </span>
            </div>
            <Progress value={progressPercent} className="h-2 mb-3" />

            <div className="flex justify-between text-sm">
              <div>
                <span className="text-muted-foreground">Calorias: </span>
                <span className="font-medium">
                  {totalCalories.toLocaleString()}
                </span>
                <span className="text-muted-foreground">
                  {" "}
                  / {DAILY_CALORIES_TARGET.toLocaleString()}
                </span>
              </div>
              <div className="text-primary font-semibold">
                {Math.round(progressPercent)}%
              </div>
            </div>

            {(stats.skipped > 0 ||
              meals.some((m) => m.status === "partial")) && (
              <div className="mt-2 pt-2 border-t border-border/50 flex gap-4 text-xs text-muted-foreground">
                {stats.skipped > 0 && (
                  <span className="text-destructive">
                    {stats.skipped} saltadas
                  </span>
                )}
                {meals.some((m) => m.status === "partial") && (
                  <span className="text-yellow-500">
                    {meals.filter((m) => m.status === "partial").length}{" "}
                    parciales
                  </span>
                )}
              </div>
            )}

            {stats.completed === stats.total && (
              <div className="mt-3 pt-3 border-t border-border text-center">
                <span className="text-primary font-semibold">
                  ¡Dia completado! ¡Excelente trabajo!
                </span>
              </div>
            )}
          </div>

          {/* Meals List */}
          <div className="space-y-3">
            {meals.map((meal, index) => (
              <div
                key={meal.number}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <MealCard
                  meal={meal}
                  onToggle={() => toggleMeal(meal.number)}
                  onStatusChange={(status: MealStatus) =>
                    updateMealStatus(meal.number, status)
                  }
                  onNotesChange={(notes: string) =>
                    updateMealNotes(meal.number, notes)
                  }
                />
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Tab: Menú Semanal */}
        <TabsContent value="semanal">
          <div className="space-y-6">
            {WEEKLY_MEAL_PLAN.map((day) => (
              <div key={day.day}>
                <h2 className="text-sm font-bold text-primary mb-2 capitalize">
                  {day.day}
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  <div className="glass-elevated rounded-lg p-2 flex flex-col items-start min-h-[70px]">
                    <span className="text-xs font-semibold text-muted-foreground mb-1">
                      Desayuno
                    </span>
                    <span className="text-xs">{day.desayuno}</span>
                  </div>
                  <div className="glass-elevated rounded-lg p-2 flex flex-col items-start min-h-[70px]">
                    <span className="text-xs font-semibold text-muted-foreground mb-1">
                      Snack AM
                    </span>
                    <span className="text-xs">{day.snackAM}</span>
                  </div>
                  <div className="glass-elevated rounded-lg p-2 flex flex-col items-start min-h-[70px]">
                    <span className="text-xs font-semibold text-muted-foreground mb-1">
                      Almuerzo
                    </span>
                    <span className="text-xs">{day.almuerzo}</span>
                  </div>
                  <div className="glass glass-elevated rounded-lg p-2 flex flex-col items-start min-h-[70px]">
                    <span className="text-xs font-semibold text-muted-foreground mb-1">
                      Snack PM
                    </span>
                    <span className="text-xs">{day.snackPM}</span>
                  </div>
                  <div className="glass-elevated rounded-lg p-2 flex flex-col items-start min-h-[70px]">
                    <span className="text-xs font-semibold text-muted-foreground mb-1">
                      Cena
                    </span>
                    <span className="text-xs">{day.cena}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
