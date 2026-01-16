"use client";

import { MEALS, WEEKLY_MEAL_PLAN } from "@/lib/constants";
import { db } from "@/lib/db";
import { DailyMeal, MealStatus } from "@/types";
import { format } from "date-fns";
import { useLiveQuery } from "dexie-react-hooks";

// Generar ID unico para comida
const getMealId = (date: string, mealNumber: number) => `${date}-${mealNumber}`;

// Obtener fecha en formato YYYY-MM-DD
export const getDateString = (date: Date = new Date()) =>
  format(date, "yyyy-MM-dd");

// Hook para manejar las comidas de un dia
export function useMeals(date: Date = new Date()) {
  const dateString = getDateString(date);

  // Determinar el menú del día según WEEKLY_MEAL_PLAN
  const days = ["DOM", "LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB"];
  const jsDay = date.getDay();
  // getDay(): 0=Domingo, 1=Lunes, ...
  const planDay = days[jsDay];
  const todayMenu = WEEKLY_MEAL_PLAN.find((d) => d.day === planDay);

  // Generar estructura de comidas del día según el menú semanal
  const dailyMealsInfo = todayMenu
    ? [
        {
          number: 1,
          name: "Desayuno",
          time: "06:00",
          calories: 650,
          description: todayMenu.desayuno,
        },
        {
          number: 2,
          name: "Snack AM",
          time: "10:00",
          calories: 400,
          description: todayMenu.snackAM,
        },
        {
          number: 3,
          name: "Almuerzo",
          time: "13:00",
          calories: 750,
          description: todayMenu.almuerzo,
        },
        {
          number: 4,
          name: "Snack PM",
          time: "17:00",
          calories: 400,
          description: todayMenu.snackPM,
        },
        {
          number: 5,
          name: "Cena",
          time: "21:30",
          calories: 400,
          description: todayMenu.cena,
        },
      ]
    : MEALS;

  // Inicializar comidas del dia si no existen
  const initializeDayMeals = async () => {
    const existing = await db.meals.where("date").equals(dateString).count();
    if (existing === 0) {
      const newMeals: DailyMeal[] = dailyMealsInfo.map((meal) => ({
        id: getMealId(dateString, meal.number),
        date: dateString,
        mealNumber: meal.number as 1 | 2 | 3 | 4 | 5,
        status: "pending" as MealStatus,
      }));
      await db.meals.bulkPut(newMeals);
    }
  };

  // Actualizar estado de una comida
  const updateMealStatus = async (mealNumber: number, status: MealStatus) => {
    const id = getMealId(dateString, mealNumber);
    await db.meals.update(id, {
      status,
      completedAt: status === "completed" ? new Date() : undefined,
    });
  };

  // Actualizar notas de una comida
  const updateMealNotes = async (mealNumber: number, notes: string) => {
    const id = getMealId(dateString, mealNumber);
    await db.meals.update(id, { notes: notes || undefined });
  };

  // Toggle entre completada y pendiente
  const toggleMeal = async (mealNumber: number) => {
    const id = getMealId(dateString, mealNumber);
    const meal = await db.meals.get(id);

    if (meal) {
      const newStatus: MealStatus =
        meal.status === "completed" ? "pending" : "completed";
      await updateMealStatus(mealNumber, newStatus);
    }
  };

  // Obtener comidas del dia (reactivo)
  const meals = useLiveQuery(
    () => db.meals.where("date").equals(dateString).toArray(),
    [dateString],
    []
  );

  // Obtener estadisticas del dia
  const stats = {
    total: 5,
    completed: meals?.filter((m) => m.status === "completed").length ?? 0,
    skipped: meals?.filter((m) => m.status === "skipped").length ?? 0,
    partial: meals?.filter((m) => m.status === "partial").length ?? 0,
    pending: meals?.filter((m) => m.status === "pending").length ?? 0,
  };

  // Combinar info de comidas con datos del dia
  const mealsWithInfo = dailyMealsInfo.map((info) => {
    const dayMeal = meals?.find((m) => m.mealNumber === info.number);
    return {
      ...info,
      number: info.number as 1 | 2 | 3 | 4 | 5,
      status: dayMeal?.status ?? "pending",
      completedAt: dayMeal?.completedAt,
      notes: dayMeal?.notes,
    };
  });

  return {
    meals: mealsWithInfo,
    stats,
    initializeDayMeals,
    updateMealStatus,
    updateMealNotes,
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
      .where("date")
      .between(startString, endString, true, true)
      .toArray();
  }, [startString]);

  const completedCount =
    weekMeals?.filter((m) => m.status === "completed").length ?? 0;
  const totalPossible = 35; // 5 comidas x 7 dias

  return {
    meals: weekMeals,
    completedCount,
    totalPossible,
    percentage: Math.round((completedCount / totalPossible) * 100),
  };
}
