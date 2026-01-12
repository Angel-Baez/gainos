"use client";

import { MealCard } from "@/components/MealCard";
import { Progress } from "@/components/ui/progress";
import { useMeals } from "@/hooks/useMeals";
import { DAILY_CALORIES_TARGET } from "@/lib/constants";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useEffect } from "react";

export default function MealsPage() {
  const { meals, stats, initializeDayMeals, toggleMeal, dateString } =
    useMeals();

  useEffect(() => {
    initializeDayMeals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateString]);

  const completedCalories = meals
    .filter((m) => m.status === "completed")
    .reduce((sum, m) => sum + m.calories, 0);

  const progressPercent = (stats.completed / stats.total) * 100;

  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Comidas de Hoy</h1>
        <p className="text-muted-foreground capitalize">
          {format(new Date(), "EEEE, d 'de' MMMM", { locale: es })}
        </p>
      </div>

      {/* Progress Summary */}
      <div className="bg-card border border-border rounded-xl p-4 mb-6 animate-slide-up">
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
              {completedCalories.toLocaleString()}
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

        {stats.completed === 8 && (
          <div className="mt-3 pt-3 border-t border-border text-center">
            <span className="text-primary font-semibold">
              🎉 ¡Día completado! ¡Excelente trabajo!
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
            <MealCard meal={meal} onToggle={() => toggleMeal(meal.number)} />
          </div>
        ))}
      </div>
    </div>
  );
}
