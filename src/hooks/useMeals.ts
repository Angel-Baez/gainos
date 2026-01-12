'use client';

import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { DailyMeal, MealStatus } from '@/types';
import { MEALS } from '@/lib/constants';
import { format } from 'date-fns';

// Generar ID unico para comida
const getMealId = (date: string, mealNumber: number) =>
  `${date}-${mealNumber}`;

// Obtener fecha en formato YYYY-MM-DD
export const getDateString = (date: Date = new Date()) =>
  format(date, 'yyyy-MM-dd');

// Hook para manejar las comidas de un dia
export function useMeals(date: Date = new Date()) {
  const dateString = getDateString(date);

  // Obtener comidas del dia (reactivo)
  const meals = useLiveQuery(
    () => db.meals.where('date').equals(dateString).toArray(),
    [dateString],
    []
  );

  // Inicializar comidas del dia si no existen
  const initializeDayMeals = async () => {
    const existing = await db.meals
      .where('date')
      .equals(dateString)
      .count();

    if (existing === 0) {
      const newMeals: DailyMeal[] = MEALS.map((meal) => ({
        id: getMealId(dateString, meal.number),
        date: dateString,
        mealNumber: meal.number,
        status: 'pending' as MealStatus,
      }));

      await db.meals.bulkAdd(newMeals);
    }
  };

  // Actualizar estado de una comida
  const updateMealStatus = async (
    mealNumber: number,
    status: MealStatus
  ) => {
    const id = getMealId(dateString, mealNumber);
    await db.meals.update(id, {
      status,
      completedAt: status === 'completed' ? new Date() : undefined,
    });
  };

  // Toggle entre completada y pendiente
  const toggleMeal = async (mealNumber: number) => {
    const id = getMealId(dateString, mealNumber);
    const meal = await db.meals.get(id);

    if (meal) {
      const newStatus: MealStatus =
        meal.status === 'completed' ? 'pending' : 'completed';
      await updateMealStatus(mealNumber, newStatus);
    }
  };

  // Obtener estadisticas del dia
  const stats = {
    total: 8,
    completed: meals?.filter((m) => m.status === 'completed').length ?? 0,
    skipped: meals?.filter((m) => m.status === 'skipped').length ?? 0,
    pending: meals?.filter((m) => m.status === 'pending').length ?? 0,
  };

  // Combinar info de comidas con datos del dia
  const mealsWithInfo = MEALS.map((info) => {
    const dayMeal = meals?.find((m) => m.mealNumber === info.number);
    return {
      ...info,
      status: dayMeal?.status ?? 'pending',
      completedAt: dayMeal?.completedAt,
    };
  });

  return {
    meals: mealsWithInfo,
    stats,
    initializeDayMeals,
    updateMealStatus,
    toggleMeal,
    dateString,
  };
}

// Hook para obtener comidas de la semana
export function useWeekMeals(weekStartDate: Date) {
  const startString = getDateString(weekStartDate);

  const weekMeals = useLiveQuery(async () => {
    const endDate = new Date(weekStartDate);
    endDate.setDate(endDate.getDate() + 6);
    const endString = getDateString(endDate);

    return db.meals
      .where('date')
      .between(startString, endString, true, true)
      .toArray();
  }, [startString]);

  const completedCount =
    weekMeals?.filter((m) => m.status === 'completed').length ?? 0;
  const totalPossible = 56; // 8 comidas x 7 dias

  return {
    meals: weekMeals,
    completedCount,
    totalPossible,
    percentage: Math.round((completedCount / totalPossible) * 100),
  };
}
