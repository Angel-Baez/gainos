"use client";

import { DEFAULT_MEAL_PREP_ITEMS } from "@/lib/constants";
import { db } from "@/lib/db";
import { MealPrepRecord } from "@/types";
import { format, startOfWeek } from "date-fns";
import { useLiveQuery } from "dexie-react-hooks";

// Obtener ID de la semana (YYYY-WW)
const getWeekId = (date: Date = new Date()) => {
  const weekStart = startOfWeek(date, { weekStartsOn: 1 }); // Lunes (LUNES SAGRADO)
  return format(weekStart, "yyyy-'W'ww");
};

const getWeekStartString = (date: Date = new Date()) => {
  const weekStart = startOfWeek(date, { weekStartsOn: 1 });
  return format(weekStart, "yyyy-MM-dd");
};

export function useMealPrep(date: Date = new Date()) {
  const weekId = getWeekId(date);

  // Obtener meal prep de la semana actual
  const mealPrep = useLiveQuery(() => db.mealPreps.get(weekId), [weekId]);

  // Inicializar meal prep de la semana si no existe
  const initializeMealPrep = async () => {
    const existing = await db.mealPreps.get(weekId);

    if (!existing) {
      const newMealPrep: MealPrepRecord = {
        id: weekId,
        weekStart: getWeekStartString(date),
        items: DEFAULT_MEAL_PREP_ITEMS.map((item) => ({ ...item })),
      };

      await db.mealPreps.add(newMealPrep);
    }
  };

  // Toggle item completado
  const toggleItem = async (index: number) => {
    if (!mealPrep) return;

    const updatedItems = [...mealPrep.items];
    updatedItems[index] = {
      ...updatedItems[index],
      completed: !updatedItems[index].completed,
    };

    const allCompleted = updatedItems.every((item) => item.completed);

    await db.mealPreps.update(weekId, {
      items: updatedItems,
      completedAt: allCompleted ? new Date() : undefined,
    });
  };

  // Estadisticas
  const stats = {
    total: mealPrep?.items.length ?? 0,
    completed: mealPrep?.items.filter((i) => i.completed).length ?? 0,
    isFullyCompleted: mealPrep?.completedAt !== undefined,
  };

  return {
    mealPrep,
    items: mealPrep?.items ?? [],
    stats,
    initializeMealPrep,
    toggleItem,
    weekId,
  };
}
