'use client';

import { useEffect } from 'react';
import { useMeals } from '@/hooks/useMeals';
import { MealCard } from '@/components/MealCard';
import { Progress } from '@/components/ui/progress';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { DAILY_CALORIES_TARGET } from '@/lib/constants';

export default function MealsPage() {
  const { meals, stats, initializeDayMeals, toggleMeal, dateString } = useMeals();

  useEffect(() => {
    initializeDayMeals();
  }, [dateString]);

  const completedCalories = meals
    .filter((m) => m.status === 'completed')
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
      <div className="bg-card border border-border rounded-xl p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">Progreso del dia</span>
          <span className="text-sm font-semibold text-primary">
            {stats.completed}/{stats.total} comidas
          </span>
        </div>
        <Progress value={progressPercent} className="h-2 mb-3" />

        <div className="flex justify-between text-sm">
          <div>
            <span className="text-muted-foreground">Calorias: </span>
            <span className="font-medium">{completedCalories.toLocaleString()}</span>
            <span className="text-muted-foreground"> / {DAILY_CALORIES_TARGET.toLocaleString()}</span>
          </div>
          <div className="text-primary font-semibold">
            {Math.round(progressPercent)}%
          </div>
        </div>
      </div>

      {/* Meals List */}
      <div className="space-y-3">
        {meals.map((meal) => (
          <MealCard
            key={meal.number}
            meal={meal}
            onToggle={() => toggleMeal(meal.number)}
          />
        ))}
      </div>
    </div>
  );
}
